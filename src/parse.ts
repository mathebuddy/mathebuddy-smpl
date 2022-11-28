/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Lexer } from '@multila/multila-lexer';
import { functionPrototypes } from './prototypes';

import {
  BaseType,
  Code,
  createFunctionPrototypes,
  SymbolKind,
  SymTabEntry,
  Type,
  TypedCode,
} from './symbol';

export class SMPL_Parser {
  private lexer: Lexer = null;
  private symTab: SymTabEntry[] = []; // TODO: add and remove ONLY via methods

  private loopLevel = 0;
  private scope = 0;

  private getSymbol(id: string): SymTabEntry {
    // TODO: scoping
    // TODO: function parameters
    for (const sym of this.symTab) {
      if (sym.id === id) {
        return sym;
      }
    }
    return null;
  }

  public removeSymTabEntry(e: SymTabEntry): void {
    const newList: SymTabEntry[] = [];
    for (const sym of this.symTab) {
      if (sym === e) continue;
      else newList.push(sym);
    }
    this.symTab = newList;
  }

  public getLocalSymbols(): SymTabEntry[] {
    const locals: SymTabEntry[] = [];
    for (const s of this.symTab) {
      if (s.kind === SymbolKind.Local) {
        if (s.type.base === BaseType.TERM_VAR) continue;
        locals.push(s);
      }
    }
    return locals;
  }

  public parse(src: string): string {
    this.loopLevel = 0;
    this.scope = 0;
    this.symTab = createFunctionPrototypes(functionPrototypes);

    this.lexer = new Lexer();
    this.lexer.configureSingleLineComments('//');
    this.lexer.configureMultiLineComments('/*', '*/');
    this.lexer.enableEmitNewlines(false); // TODO
    this.lexer.enableEmitIndentation(false);
    this.lexer.enableBackslashLineBreaks(false);
    this.lexer.pushSource('FILE', src);
    this.lexer.setTerminals(['&&', '||', '==', '!=', '>=', '<=', '++', '--']);
    const c = this.parseProgram();
    //console.log(c.str);
    return c.str;
  }

  //G program = { statement };
  private parseProgram(): Code {
    const c = new Code();
    while (this.lexer.isNotEND()) {
      const s = this.parseStatement();
      c.str += s.str;
    }
    return c;
  }

  //G statement = declaration | if | for | do | while | switch | function | return | break | continue | expression EOS;
  private parseStatement(): Code {
    if (this.lexer.isTER('let')) return this.parseDeclaration();
    else if (this.lexer.isTER('if')) return this.parseIf();
    //else if (this.lexer.isTER('for')) return this.parseFor();
    else if (this.lexer.isTER('do')) return this.parseDo();
    else if (this.lexer.isTER('while')) return this.parseWhile();
    //else if (this.lexer.isTER('switch')) return this.parseSwitch();
    else if (this.lexer.isTER('function')) return this.parseFunction();
    else if (this.lexer.isTER('return')) return this.parseReturn();
    else if (this.lexer.isTER('break')) return this.parseBreak();
    else if (this.lexer.isTER('continue')) return this.parseContinue();
    else {
      const c = this.parseExpression();
      this.lexer.EOS();
      return new Code(c.code.str + ';');
    }
  }

  //G declaration = "let" id_list "=" expr EOS | "let" ID "(" ID { "," ID } ")" "=" expr EOS;
  //G id_list = ID { ":" ID } | ID { "/" ID };
  // TODO: continue declaration after "," (e.g. "let x=4, y=6;")
  private parseDeclaration(): Code {
    // e.g. "let a:b = rand(5);" -> "let a=rand(5), b=rand(5);"
    const c = new Code();
    this.lexer.TER('let');
    const ids: string[] = [];
    ids.push(this.lexer.ID());
    if (this.lexer.isTER('(')) {
      // function declaration; e.g. "let f(x,y) = x^2 + y;"
      const id = ids[0]; // e.g. "f"
      this.lexer.next();
      const varIds: string[] = []; // e.g. ["x", "y"];
      varIds.push(this.lexer.ID());
      while (this.lexer.isTER(',')) {
        this.lexer.next();
        varIds.push(this.lexer.ID());
      }
      // push term variables to symbol table temporarily
      for (const varId of varIds) {
        const type = new Type(BaseType.TERM_VAR);
        const symbol = new SymTabEntry(
          varId,
          SymbolKind.Local,
          type,
          this.scope,
          [],
        );
        this.symTab.push(symbol);
      }
      this.lexer.TER(')');
      this.lexer.TER('=');
      const e = this.parseExpression();
      if (e.type.base !== BaseType.TERM) {
        switch (e.type.base) {
          case BaseType.INT:
          case BaseType.REAL:
            e.code.str =
              'runtime.interpret_term._numberToTerm(' + e.code.str + ')';
            e.type.base = BaseType.TERM;
            break;
          default:
            // TODO: create custom error
            this.lexer.error('right-hand side is not a term');
        }
      }
      // write term declaration (e.g. "runtime.interpret_term._powTermReal( x,  2 , '3:17');");
      c.str += 'let ' + id + ' = ' + e.code.str + ';';
      // pop temporary symbols
      for (let i = 0; i < varIds.length; i++) this.symTab.pop();
      // push function symbol to symbol table
      // - sub-symbols := variables IDs (e.g. x and y for "f(x,y)")
      const subSymbols: SymTabEntry[] = [];
      for (const varId of varIds) {
        subSymbols.push(
          new SymTabEntry(
            varId,
            SymbolKind.Parameter,
            new Type(BaseType.TERM_VAR),
            this.scope + 1,
            [],
          ),
        );
      }
      // symbol (e.g. f)
      const symbol = new SymTabEntry(
        id,
        SymbolKind.Local,
        new Type(BaseType.TERM),
        this.scope,
        subSymbols,
      );
      this.symTab.push(symbol);

      // remove varIds from symbol table
      /*for (const e of varIdSymbols) {
        this.removeSymTabEntry(e);
      }*/

      this.lexer.EOS();
    } else {
      // non-function declaration
      let distinctValues = false; // if true, then each variable has a different value
      while (this.lexer.isTER(':') || this.lexer.isTER('/')) {
        if (this.lexer.isTER('/')) distinctValues = true;
        if (this.lexer.isTER(':') && distinctValues == true) {
          this.lexer.error('cannot mix ":" and "/"');
        }
        this.lexer.next();
        ids.push(this.lexer.ID());
      }
      this.lexer.TER('=');
      const e = this.parseExpression();
      for (const id of ids) {
        // TODO: check if symbol with same name is available at same scope
        const symbol = new SymTabEntry(
          id,
          SymbolKind.Local,
          e.type,
          this.scope,
          [],
        );
        this.symTab.push(symbol);
      }
      if (distinctValues) {
        // declare variables and run initialization such that each variable
        // has a value that is different to all other variables.
        // Note: In case that the right-hand side (expression "e") is
        // not (sufficiently) randomized, we run into an infinite loop...
        if (e.type.base !== BaseType.INT)
          this.lexer.error(
            'declaration operator "/" is unimplemented for type ' + e.type.base,
          );
        c.str += 'let ';
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          if (i > 0) c.str += ', ';
          c.str += id;
        }
        c.str += ';\n';
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          if (i == 0) {
            c.str += id + ' = ' + e.code.str + ';\n';
          } else {
            c.str += 'do { ' + id + ' = ' + e.code.str + '; } while (';
            let condition = '';
            for (let j = 0; j < i; j++) {
              if (condition.length > 0) condition += ' || ';
              condition += id + ' == ' + ids[j];
            }
            c.str += condition;
            c.str += ');\n';
          }
        }
      } else {
        // just declare variables and set right-hand side
        for (const id of ids) {
          c.str += 'let ' + id + ' = ' + e.code.str + ';';
        }
      }
      this.lexer.EOS();
    }
    return c;
  }

  //G expression = or { ("="|"+="|"-="|"/=") or };
  private parseExpression(): TypedCode {
    // TODO: operators "+=", ...
    const x = this.parseOr();
    while (this.lexer.isTER('=')) {
      const op = this.lexer.getToken().token;
      this.lexer.next();
      const y = this.parseOr();
      if (x.code.tmp.includes('setElement')) {
        // TODO: this is ugly...
        if (y.type.base !== BaseType.INT && y.type.base !== BaseType.REAL)
          this.lexer.error('element must be of type INT or REAL.');
        x.code.str = x.code.tmp.replace('§RHS§', y.code.str);
        x.type.base = BaseType.VOID;
      } else if (
        (x.type.base === BaseType.INT || x.type.base === BaseType.REAL) &&
        (y.type.base === BaseType.INT || y.type.base === BaseType.REAL)
      ) {
        x.type.base = BaseType.INT;
        x.code.str = x.code.str + ' ' + op + ' ' + y.code.str;
      } else if (
        x.type.base === BaseType.VECTOR &&
        y.type.base === BaseType.VECTOR
      ) {
        x.type.base = BaseType.VECTOR;
        x.code.str =
          x.code.str +
          ' ' +
          op +
          ' runtime.interpret_vector._clone(' +
          y.code.str +
          ')';
      } else if (
        x.type.base === BaseType.MATRIX &&
        y.type.base === BaseType.MATRIX
      ) {
        x.type.base = BaseType.MATRIX;
        x.code.str =
          x.code.str +
          ' ' +
          op +
          ' runtime.interpret_matrix._clone(' +
          y.code.str +
          ')';
      } else
        this.lexer.errorTypesInBinaryOperation(op, x.type.base, y.type.base);
    }
    return x;
  }

  //G or = and { "||" and };
  private parseOr(): TypedCode {
    const x = this.parseAnd();
    while (this.lexer.isTER('||')) {
      const op = this.lexer.getToken().token;
      this.lexer.next();
      const y = this.parseAnd();
      if (x.type.base == BaseType.BOOL && y.type.base == BaseType.BOOL) {
        x.type.base = BaseType.BOOL;
        x.code.str = x.code.str + ' ' + op + ' ' + y.code.str;
      } else
        this.lexer.errorTypesInBinaryOperation(op, x.type.base, y.type.base);
    }
    return x;
  }

  //G and = equal { "&&" equal };
  private parseAnd(): TypedCode {
    const x = this.parseEqual();
    while (this.lexer.isTER('&&')) {
      const op = this.lexer.getToken().token;
      this.lexer.next();
      const y = this.parseEqual();
      if (x.type.base == BaseType.BOOL && y.type.base == BaseType.BOOL) {
        x.type.base = BaseType.BOOL;
        x.code.str = x.code.str + ' ' + op + ' ' + y.code.str;
      } else
        this.lexer.errorTypesInBinaryOperation(op, x.type.base, y.type.base);
    }
    return x;
  }

  //G equal = relational [ ("=="|"!=") relational ];
  private parseEqual(): TypedCode {
    const x = this.parseRelational();
    if (this.lexer.isTER('==') || this.lexer.isTER('!=')) {
      const op = this.lexer.getToken().token;
      this.lexer.next();
      const y = this.parseRelational();
      if (x.type.base == BaseType.BOOL && y.type.base == BaseType.BOOL) {
        x.type.base = BaseType.BOOL;
        x.code.str = x.code.str + ' ' + op + ' ' + y.code.str;
      } else if (x.type.base == BaseType.INT && y.type.base == BaseType.INT) {
        x.type.base = BaseType.BOOL;
        x.code.str = x.code.str + ' ' + op + ' ' + y.code.str;
      } else if (
        (x.type.base == BaseType.INT || x.type.base == BaseType.REAL) &&
        (y.type.base == BaseType.INT || y.type.base == BaseType.REAL)
      ) {
        x.type.base = BaseType.BOOL;
        x.code.str =
          op == '=='
            ? '(Math.abs((' + x.code.str + ') - (' + y.code.str + ')) <= 1e-9)'
            : '(Math.abs((' + x.code.str + ') - (' + y.code.str + ')) > 1e-9)';
      } else
        this.lexer.errorTypesInBinaryOperation(op, x.type.base, y.type.base);
    }
    return x;
  }

  //G relational = add [ ("<="|">="|"<"|">") add ];
  private parseRelational(): TypedCode {
    const x = this.parseAdd();
    if (
      this.lexer.isTER('<=') ||
      this.lexer.isTER('>=') ||
      this.lexer.isTER('<') ||
      this.lexer.isTER('>')
    ) {
      const op = this.lexer.getToken().token;
      this.lexer.next();
      const y = this.parseAdd();
      if (
        (x.type.base == BaseType.INT || x.type.base == BaseType.REAL) &&
        (y.type.base == BaseType.INT || y.type.base == BaseType.REAL)
      ) {
        x.type.base = BaseType.BOOL;
        x.code.str = x.code.str + ' ' + op + ' ' + y.code.str;
      } else
        this.lexer.errorTypesInBinaryOperation(op, x.type.base, y.type.base);
    }
    return x;
  }

  //G add = mul { ("+"|"-") mul };
  private parseAdd(): TypedCode {
    let x = this.parseMul();
    while (this.lexer.isTER('+') || this.lexer.isTER('-')) {
      const op = this.lexer.getToken().token;
      this.lexer.next();
      const y = this.parseMul();
      x = this.call(this.getSymbol(op === '+' ? '_add' : '_sub'), [], [x, y]);
    }
    return x;
  }

  //G mul = pow { ("*"|"/"|"mod") pow };
  private parseMul(): TypedCode {
    let x = this.parsePow();
    while (
      this.lexer.isTER('*') ||
      this.lexer.isTER('/') ||
      this.lexer.isTER('mod')
    ) {
      const op = this.lexer.getToken().token;
      this.lexer.next();
      const y = this.parsePow();
      x = this.call(
        this.getSymbol(op === '*' ? '_mul' : op === '/' ? '_div' : '_mod'),
        [],
        [x, y],
      );
    }
    return x;
  }

  //G pow = unary [ "^" unary ];
  private parsePow(): TypedCode {
    let x = this.parseUnary();
    if (this.lexer.isTER('^')) {
      this.lexer.next();
      const y = this.parseUnary();
      x = this.call(this.getSymbol('_pow'), [], [x, y]);
    }
    return x;
  }

  //G unary = unaryExpression [ unaryPostfix ];
  private parseUnary(): TypedCode {
    let tc = this.parseUnaryExpression();
    if (
      tc.sym != null &&
      tc.sym.kind === SymbolKind.Function &&
      this.lexer.isNotTER('(') &&
      this.lexer.isNotTER('<')
    ) {
      this.lexer.errorExpected(['(', '<']);
    }
    if (
      this.lexer.isTER('++') ||
      this.lexer.isTER('--') ||
      (tc.sym != null &&
        tc.sym.kind === SymbolKind.Function &&
        this.lexer.isTER('<')) ||
      this.lexer.isTER('(') ||
      this.lexer.isTER('[')
    ) {
      tc = this.parseUnaryPostfix(tc);
    }
    return tc;
  }

  //G unaryExpression = "true" | "false" | INT ["i"] | REAL ["i"] | "(" expr ")" | "[" matrix_row "," { matrix_row } "]" | | ID | "-" unary | "!" unary;
  private parseUnaryExpression(): TypedCode {
    let tc = new TypedCode();
    if (this.lexer.isTER('true')) {
      tc.code.str = ' true ';
      tc.type.base = BaseType.BOOL;
      this.lexer.next();
    } else if (this.lexer.isTER('false')) {
      tc.code.str = ' false ';
      tc.type.base = BaseType.BOOL;
      this.lexer.next();
    } else if (this.lexer.isINT()) {
      const value = this.lexer.INT();
      tc.code.str = ' ' + value + ' ';
      tc.type.base = BaseType.INT;
      if (this.lexer.isTER('i')) {
        this.lexer.next();
        tc.code.str = 'runtime.interpret_complex._create(0,' + value + ')';
        tc.type.base = BaseType.COMPLEX;
      }
    } else if (this.lexer.isREAL()) {
      const value = this.lexer.REAL();
      tc.code.str = ' ' + value + ' ';
      tc.type.base = BaseType.REAL;
      if (this.lexer.isTER('i')) {
        this.lexer.next();
        tc.code.str = 'runtime.interpret_complex._create(0,' + value + ')';
        tc.type.base = BaseType.COMPLEX;
      }
    } else if (this.lexer.isTER('(')) {
      this.lexer.next();
      const e = this.parseExpression();
      this.lexer.TER(')');
      tc.code.str = ' ( ' + e.code.str + ' ) ';
      tc.type = e.type;
    } else if (this.lexer.isTER('[')) {
      this.lexer.next();
      let i = 0;
      let m = -1; // num rows
      let n = -1; // num cols
      const elements: TypedCode[] = []; // matrix elements in row major order
      while (this.lexer.isNotTER(']')) {
        if (i > 0) this.lexer.TER(',');
        const row = this.parseMatrixRow();
        if (i == 0) n = row.length;
        else if (n != row.length)
          this.lexer.error('inconsistent number of matrix columns');
        for (const r of row) elements.push(r);
        i++;
      }
      m = i;
      this.lexer.TER(']');
      let elementsCode = '[';
      let k = 0;
      for (const e of elements) {
        if (k > 0) elementsCode += ', ';
        elementsCode += e.code.str;
        k++;
      }
      elementsCode += ']';
      tc.code.str =
        'runtime.interpret_matrix._create(' +
        m +
        ', ' +
        n +
        ', ' +
        elementsCode +
        ')';
      tc.type.base = BaseType.MATRIX;
    } else if (this.lexer.isID()) {
      const id = this.lexer.ID();
      tc.sym = this.getSymbol(id);
      if (tc.sym == null) this.lexer.errorUnknownSymbol(id);
      if (tc.sym.type.base === BaseType.TERM_VAR) {
        tc.type = new Type(BaseType.TERM);
        tc.code.str = 'runtime.interpret_term.var("' + id + '")';
      } else {
        tc.type = tc.sym.type.clone();
        tc.code.str = ' ' + id;
      }
    } else if (this.lexer.isTER('-')) {
      this.lexer.next();
      const x = this.parseUnary();
      tc = this.call(this.getSymbol('_unaryMinus'), [], [x]);
    } else if (this.lexer.isTER('!')) {
      this.lexer.next();
      const x = this.parseUnary();
      tc = this.call(this.getSymbol('_unaryNot'), [], [x]);
    } else this.lexer.errorExpected(['INT', 'IMAG', 'REAL', '(', 'ID']);
    return tc;
  }

  //G matrix_row = "[" expr { "," expr } "]";
  private parseMatrixRow(): TypedCode[] {
    this.lexer.TER('[');
    let j = 0;
    const col: TypedCode[] = [];
    while (this.lexer.isNotTER(']')) {
      if (j > 0) this.lexer.TER(',');
      const e = this.parseExpression();
      if (e.type.base !== BaseType.INT && e.type.base !== BaseType.REAL)
        this.lexer.error('matrix element must be of type INT or REAL.');
      col.push(e);
      j++;
    }
    this.lexer.TER(']');
    return col;
  }

  //G unaryPostfix = "++" | "--" | [ "<" [ unary { "," unary } ] ">" ] "(" [ expr { "," expr } ] ")" | "[" expr "]";
  private parseUnaryPostfix(tc: TypedCode): TypedCode {
    if (this.lexer.isTER('++')) {
      // TODO: only for INT|REAL!
      this.lexer.next();
      tc.code.str += ' ++ ';
    } else if (this.lexer.isTER('--')) {
      // TODO: only for INT|REAL!
      this.lexer.next();
      tc.code.str += ' -- ';
    } else if (this.lexer.isTER('<') || this.lexer.isTER('(')) {
      // function call
      const dims: TypedCode[] = [];
      const params: TypedCode[] = [];
      // (a) dimensions (if applicable)
      if (this.lexer.isTER('<')) {
        this.lexer.next();
        let i = 0;
        while (this.lexer.isNotTER('>')) {
          if (i > 0) this.lexer.TER(',');
          dims.push(this.parseUnary());
          i++;
        }
        this.lexer.TER('>');
      }
      // (b) parameters (required)
      this.lexer.TER('(');
      if (tc.sym == null) {
        this.lexer.errorNotAFunction();
      }
      if (
        tc.sym.kind == SymbolKind.Function ||
        (tc.sym.kind == SymbolKind.Local && tc.sym.type.base === BaseType.TERM)
      ) {
        let i = 0;
        while (this.lexer.isNotTER(')')) {
          if (i > 0) this.lexer.TER(',');
          params.push(this.parseExpression());
          i++;
        }
        this.lexer.TER(')');
      } else {
        this.lexer.errorNotAFunction();
      }
      if (tc.sym.kind == SymbolKind.Function) {
        // (c.1) call
        tc = this.call(tc.sym, dims, params);
      } else {
        // (c.2) evaluate term
        if (tc.sym.subSymbols.length != params.length)
          this.lexer.error('invalid parameters for function ' + tc.sym.id);
        let paramDictStr = '{';
        for (let i = 0; i < params.length; i++) {
          if (
            params[i].type.base !== BaseType.INT &&
            params[i].type.base !== BaseType.REAL
          ) {
            this.lexer.error(
              'parameters for function must be of type INT or REAL.',
            );
          }
          if (i > 0) paramDictStr += ', ';
          paramDictStr += tc.sym.subSymbols[i].id + ': ' + params[i].code.str;
        }
        paramDictStr += '}';
        tc.code.str =
          'runtime.interpret_term._eval' +
          '(' +
          tc.sym.id +
          ', ' +
          paramDictStr +
          ', ' +
          this.getTokenPosStr() +
          ')';
        tc.type = new Type(BaseType.REAL); // TODO: always real??
      }
    } else if (this.lexer.isTER('[')) {
      this.lexer.next();
      const indices: TypedCode[] = [];
      let i = 0;
      while (this.lexer.isNotTER(']')) {
        if (i > 0) this.lexer.TER(',');
        indices.push(this.parseExpression());
        i++;
      }
      this.lexer.TER(']');
      if (tc.type.base === BaseType.VECTOR) {
        if (indices.length != 1) this.lexer.error('expected one index');
        if (indices[0].type.base !== BaseType.INT)
          this.lexer.error('index is not of type integer');
        tc.type.base = BaseType.REAL; // TODO: INT vs REAL
        tc.code.str =
          'runtime.interpret_vector._getElement(' +
          tc.sym.id +
          ', ' +
          indices[0].code.str +
          ', ' +
          this.getTokenPosStr() +
          ')';
        tc.code.tmp =
          'runtime.interpret_vector._setElement(' +
          tc.sym.id +
          ', ' +
          indices[0].code.str +
          ', §RHS§' +
          ', ' +
          this.getTokenPosStr() +
          ')';
      } else if (tc.type.base === BaseType.MATRIX) {
        if (indices.length != 2) this.lexer.error('expected two indices');
        for (let i = 0; i < indices.length; i++) {
          if (indices[i].type.base !== BaseType.INT)
            this.lexer.error('index ' + (i + 1) + ' is not of type integer');
        }
        tc.type.base = BaseType.REAL; // TODO: INT vs REAL
        tc.code.str =
          'runtime.interpret_matrix._getElement(' +
          tc.sym.id +
          ', ' +
          indices[0].code.str +
          ', ' +
          indices[1].code.str +
          ', ' +
          this.getTokenPosStr() +
          ')';
        tc.code.tmp =
          'runtime.interpret_matrix._setElement(' +
          tc.sym.id +
          ', ' +
          indices[0].code.str +
          ', ' +
          indices[1].code.str +
          ', §RHS§' +
          ', ' +
          this.getTokenPosStr() +
          ')';
      } else {
        this.lexer.error('can only index a matrix or a vector');
      }
    } else {
      this.lexer.errorExpected(['++', '--', '(', '[']);
    }
    return tc;
  }

  private call(
    functionSym: SymTabEntry,
    dims: TypedCode[],
    params: TypedCode[],
  ): TypedCode {
    const tc = new TypedCode();
    tc.sym = functionSym;
    tc.type = functionSym.type.clone();
    let prototype = functionSym;
    // find matching function prototype (overloading)
    while (prototype != null) {
      // get lists of prototype dimensions and formal parameters
      const prototypeDims: SymTabEntry[] = [];
      const prototypeParams: SymTabEntry[] = [];
      for (const subSymbol of prototype.subSymbols) {
        if (subSymbol.kind == SymbolKind.Dimension)
          prototypeDims.push(subSymbol);
        else if (subSymbol.kind === SymbolKind.Parameter)
          prototypeParams.push(subSymbol);
      }
      // check
      if (
        (prototypeDims.length == dims.length &&
          prototypeParams.length == params.length) ||
        (prototypeParams.length == 1 &&
          (prototypeParams[0].type.base == BaseType.INT_LIST ||
            prototypeParams[0].type.base == BaseType.COMPLEX_LIST ||
            prototypeParams[0].type.base == BaseType.VECTOR_LIST))
      ) {
        const is_int_list =
          prototypeParams.length == 1 &&
          prototypeParams[0].type.base == BaseType.INT_LIST;
        const is_complex_list =
          prototypeParams.length == 1 &&
          prototypeParams[0].type.base == BaseType.COMPLEX_LIST;
        const is_vector_list =
          prototypeParams.length == 1 &&
          prototypeParams[0].type.base == BaseType.VECTOR_LIST;

        let match = true;

        //check dimension types
        for (let k = 0; k < prototypeDims.length; k++) {
          if (prototypeDims[k].type.base !== dims[k].type.base) {
            match = false;
            break;
          }
        }

        // check parameter types
        if (is_int_list || is_complex_list || is_vector_list) {
          for (let k = 0; k < params.length; k++) {
            if (
              (is_int_list && params[k].type.base != BaseType.INT) ||
              (is_complex_list && params[k].type.base != BaseType.COMPLEX) ||
              (is_vector_list && params[k].type.base != BaseType.VECTOR)
            ) {
              match = false;
              break;
            }
          }
        } else {
          for (let k = 0; k < prototypeParams.length; k++) {
            if (prototypeParams[k].type.base !== params[k].type.base) {
              match = false;
              break;
            }
          }
        }

        // generate code in case of matching dimension and parameter types
        if (match) {
          tc.type = prototype.type.clone();
          tc.code.str = 'runtime.' + prototype.runtimeId + '(';
          // put dimensions first
          let pos = 0;
          for (let k = 0; k < prototypeDims.length; k++) {
            if (pos > 0) tc.code.str += ', ';
            tc.code.str += dims[k].code.str;
            pos++;
          }
          // then put actual parameter
          if (is_int_list || is_complex_list || is_vector_list) {
            if (pos > 0) tc.code.str += ', ';
            tc.code.str += '[';
            for (let k = 0; k < params.length; k++) {
              if (k > 0) tc.code.str += ',';
              tc.code.str += params[k].code.str;
            }
            tc.code.str += ']';
            pos++;
          } else {
            for (let k = 0; k < prototypeParams.length; k++) {
              if (pos > 0) tc.code.str += ', ';
              tc.code.str += params[k].code.str;
              pos++;
            }
          }
          // finally put lexer position
          //if (prototype.runtimeExceptions) {
          if (pos > 0) tc.code.str += ', ';
          tc.code.str += this.getTokenPosStr();
          pos++;
          //}
          tc.code.str += ')';
          tc.sym = null;
          break;
        }
      }
      // try next
      prototype = prototype.functionOverloadSuccessor;
    }
    if (prototype == null) {
      let argTypes = '';
      for (const param of params) {
        if (argTypes.length > 0) argTypes += ', ';
        argTypes += param.type.toString();
      }
      // TODO: also show dim types
      this.lexer.error(
        'no matching function prototype for calling "' +
          tc.sym.id +
          '" with types (' +
          argTypes +
          ')',
      ); // TODO: create custom error method
    }
    return tc;
  }

  //G for = "for" "(" expression ";" expression ";" expression ")" block;
  // TODO: implementation

  //G if = "if" "(" expression ")" block [ "else" block ];
  private parseIf(): Code {
    const c = new Code();
    this.lexer.TER('if');
    this.lexer.TER('(');
    const e = this.parseExpression();
    if (e.type.base !== BaseType.BOOL) this.lexer.errorConditionNotBoolean();
    this.lexer.TER(')');
    c.str = 'if (' + e.code.str + ')';
    const b1 = this.parseBlock();
    c.str += b1.str;
    if (this.lexer.isTER('else')) {
      this.lexer.next();
      c.str += ' else ';
      const b2 = this.parseBlock();
      c.str += b2.str;
    }
    return c;
  }

  //G block = statement | "{" { statement } "}";
  private parseBlock(): Code {
    const c = new Code();
    if (this.lexer.isTER('{')) {
      this.lexer.next();
      c.str += '{';
      while (this.lexer.isNotTER('}')) {
        c.str += this.parseStatement().str;
      }
      this.lexer.TER('}');
      c.str += '}';
      return c;
    } else return this.parseStatement();
  }

  //G do = "do" block "while" "(" expr ")" EOS;
  private parseDo(): Code {
    this.lexer.TER('do');
    this.loopLevel++;
    const b = this.parseBlock();
    this.loopLevel--;
    this.lexer.TER('while');
    this.lexer.TER('(');
    const e = this.parseExpression();
    if (e.type.base !== BaseType.BOOL) this.lexer.errorConditionNotBoolean();
    this.lexer.TER(')');
    this.lexer.EOS();
    return new Code(' do ' + b.str + ' while( ' + e.code.str + ' ); ');
  }

  //G while = "while" "(" expr ")" block;
  private parseWhile(): Code {
    this.lexer.TER('while');
    this.lexer.TER('(');
    const e = this.parseExpression();
    if (e.type.base !== BaseType.BOOL) this.lexer.errorConditionNotBoolean();
    this.lexer.TER(')');
    this.loopLevel++;
    const b = this.parseBlock();
    this.loopLevel--;
    const c = new Code(' while( ' + e.code.str + ' ) ' + b.str);
    return c;
  }

  //G switch = "switch" "(" expr ")" "{" { "case" INT ":" { statement } } "default" ":" { statement } "}";
  // TODO: implementation

  //G function = "function" ID "(" [ ID { "," ID } ] ")" block;
  private parseFunction(): Code {
    // TODO: code generation and symbol table population yet unimplemented
    this.lexer.TER('function');
    const id = this.lexer.ID();
    this.lexer.TER('(');
    let paramIdx = 0;
    while (this.lexer.isNotTER(')')) {
      if (paramIdx > 0) this.lexer.TER(',');
      const paramId = this.lexer.ID();
      paramIdx++;
    }
    this.lexer.TER(')');
    const b = this.parseBlock();
    return b;
  }

  //G return = "return" [ expr ] EOS;
  private parseReturn(): Code {
    this.lexer.TER('return');
    // TODO: check if return type matches function return type
    if (this.lexer.isEOS() == false) {
      const e = this.parseExpression();
      this.lexer.EOS();
      return new Code(' return ' + e.code);
    } else {
      this.lexer.EOS();
      return new Code(' return ');
    }
  }

  //G break = "break" EOS;
  private parseBreak(): Code {
    this.lexer.TER('break');
    if (this.loopLevel == 0) this.lexer.error('break not allowed outside loop');
    this.lexer.EOS();
    return new Code(' break ');
  }

  //G continue = "continue" EOS;
  private parseContinue(): Code {
    this.lexer.TER('continue');
    if (this.loopLevel == 0)
      this.lexer.error('continue not allowed outside loop');
    this.lexer.EOS();
    return new Code(' continue ');
  }

  private getTokenPosStr(): string {
    return (
      "'" + this.lexer.getToken().row + ':' + this.lexer.getToken().col + "'"
    );
  }
}

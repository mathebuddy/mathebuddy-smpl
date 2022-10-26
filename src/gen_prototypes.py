#/**
# * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
# * (c) 2022 by TH Koeln
# * Author: Andreas Schwenk contact@compiler-construction.com
# * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
# * License: GPL-3.0-or-later
# */

files = ['interpret_basic.ts', 'interpret_set.ts', 'interpret_complex.ts', 'interpret_matrix.ts', 'interpret_term.ts']

prototypes = ''

for file in files:
  f = open(file, 'r')
  lines = f.readlines()
  for line in lines:
    line = line.strip()
    if line.startswith('//G '):
      prototypes += line[4:].replace(' -> ', ' -> ' + file[:-3] + '.') + '\n'

print('''/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/**
 * THIS FILE IS GENERATED AUTOMATICALLY BY RUNNING "python3 gen_prototypes.py > prototypes.ts"
 */

export const functionPrototypes = `
''')

print(prototypes)

print('`;\n')

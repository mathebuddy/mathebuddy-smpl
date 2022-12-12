/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Figure2d } from './figure';
import { RunError, SMPL_Interpreter } from './interpret';
import { Term } from './term';
import { Vector } from './vector';

// TODO: check all parameters (e.g. that max > min, ...)

export class SMPL_Interpreter_Plot {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  //G figure2d(): FIGURE_2D -> _create_figure2d;
  _create_figure2d(): Figure2d {
    const figure = new Figure2d();
    return figure;
  }

  //G figure_color(fig:FIGURE_2D,color_key:INT):VOID -> _figure_color;
  _figure_color(figure: Figure2d, color_key: number): void {
    figure.setColor(color_key);
  }

  //G figure_x_range(fig:FIGURE_2D,min:INT,max:INT):VOID -> _figure_x_range;
  //G figure_x_range(fig:FIGURE_2D,min:INT,max:REAL):VOID -> _figure_x_range;
  //G figure_x_range(fig:FIGURE_2D,min:REAL,max:INT):VOID -> _figure_x_range;
  //G figure_x_range(fig:FIGURE_2D,min:REAL,max:REAL):VOID -> _figure_x_range;
  _figure_x_range(figure: Figure2d, min: number, max: number): void {
    figure.setRangeX(min, max);
  }

  //G figure_y_range(fig:FIGURE_2D,min:INT,max:INT):VOID -> _figure_y_range;
  //G figure_y_range(fig:FIGURE_2D,min:INT,max:REAL):VOID -> _figure_y_range;
  //G figure_y_range(fig:FIGURE_2D,min:REAL,max:INT):VOID -> _figure_y_range;
  //G figure_y_range(fig:FIGURE_2D,min:INT,max:INT):VOID -> _figure_y_range;
  _figure_y_range(figure: Figure2d, min: number, max: number): void {
    figure.setRangeY(min, max);
  }

  //G figure_x_label(fig:FIGURE_2D,label:STRING):VOID -> _figure_x_label;
  _figure_x_label(figure: Figure2d, label: string): void {
    figure.setLabelX(label);
  }

  //G figure_y_label(fig:FIGURE_2D,label:STRING):VOID -> _figure_y_label;
  _figure_y_label(figure: Figure2d, label: string): void {
    figure.setLabelY(label);
  }

  //G figure_plot(fig:FIGURE_2D,term:TERM):VOID -> _figure_plot_term;
  _figure_plot_term(figure: Figure2d, term: Term): void {
    figure.plotTerm(term);
  }

  //G figure_plot(fig:FIGURE_2D,point2d:VECTOR):VOID -> _figure_plot_point;
  _figure_plot_point(figure: Figure2d, point2d: Vector, ERR_POS: string): void {
    if (point2d.getSize() != 2) {
      throw new RunError(ERR_POS, 'expected a vector with 2 elements');
    }
    figure.plotPoint(point2d.getValue(0), point2d.getValue(1));
  }
}

/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as buffer from 'buffer';

import { Term } from './term';

class PlotVec2 {
  x = 0;
  y = 0;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class PlotCurve {
  color = 0;
  points: PlotVec2[] = [];
  toString(invertYAxis = false): string {
    const decPlaces = 3; // TODO
    let s = '';
    for (const p of this.points) {
      if (invertYAxis)
        s += p.x.toFixed(decPlaces) + ' ' + -p.y.toFixed(decPlaces) + ' ';
      else s += p.x.toFixed(decPlaces) + ' ' + p.y.toFixed(decPlaces) + ' ';
    }
    return s;
  }
}

class PlotPoint {
  color = 0;
  x = 0;
  y = 0;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

export class Figure2d {
  private color = 0;
  private xLabel = 'x';
  private yLabel = 'y';
  private xRangeMin = -5;
  private xRangeMax = 5;
  private yRangeMin = -5;
  private yRangeMax = 5;

  private curves: PlotCurve[] = [];
  private points: PlotPoint[] = [];

  public setColor(color_key: number): void {
    this.color = color_key;
  }

  public setRangeX(min: number, max: number): void {
    this.xRangeMin = min;
    this.xRangeMax = max;
  }

  public setRangeY(min: number, max: number): void {
    this.yRangeMin = min;
    this.yRangeMax = max;
  }

  public setLabelX(label: string): void {
    this.xLabel = label;
  }

  public setLabelY(label: string): void {
    this.yLabel = label;
  }

  public plotTerm(term: Term): void {
    const n = 30; // TODO!!
    const h = (this.xRangeMax - this.xRangeMin) / n;
    const curve = new PlotCurve();
    this.curves.push(curve);
    curve.color = this.color;
    for (let x = this.xRangeMin; x <= this.xRangeMax; x += h)
      curve.points.push(new PlotVec2(x, term.eval({ x: x })));
    // TODO: cut points out of y range!
  }

  public plotPoint(x: number, y: number): void {
    const point = new PlotPoint(x, y);
    this.points.push(point);
    point.color = this.color;
  }

  public toString(): string {
    let code = '';

    for (const curve of this.curves) {
      const c = (curve.color * 50) % 256; // TODO: need a color table!!
      code += `<polyline points="${curve.toString(
        true,
      )}" fill="none" style="stroke: rgb(${c},${c},${c}); stroke-width: 0.05"/>\n`;
    }

    for (const point of this.points) {
      const c = (point.color * 50) % 256; // TODO: need a color table!!
      const cx = point.x.toFixed(3);
      const cy = -point.y.toFixed(3);
      // TODO: radius!
      code += `<circle cx="${cx}" cy="${cy}" r="0.2" fill="none" style="stroke: rgb(${c},${c},${c}); stroke-width: 0.05"/>\n`;
    }

    const xMin = this.xRangeMin;
    const yMin = this.yRangeMin;
    const width = this.xRangeMax - this.xRangeMin;
    const height = this.yRangeMax - this.yRangeMin;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
          viewBox="${xMin} ${yMin} ${width} ${height}">
          ${code}
      </svg>
    `;
    console.log(svg);
    const data =
      'data:image/svg+xml;base64,' + buffer.Buffer.from(svg).toString('base64');
    return data;
  }
}

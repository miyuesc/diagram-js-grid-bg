import {
  append as svgAppend,
  attr as svgAttr,
  clear as svgClear,
  create as svgCreate
} from 'tiny-svg'
import { query as domQuery } from 'min-dom'
import { quantize } from 'diagram-js/lib/features/grid-snapping/GridUtil'
import { getMid } from 'diagram-js/lib/layout/LayoutUtil'
import Canvas, { CanvasViewbox } from 'diagram-js/lib/core/Canvas'
import EventBus from "diagram-js/lib/core/EventBus";

const SmallGridSpacing = 10
const GridSpacing = SmallGridSpacing * 10
const GridLineStroke = 0.5
const GridLineOpacity = 0.4
const GridLineColor = '#ccc'

const LAYER_NAME = 'djs-grid-line'

const GRID_DIMENSIONS = {
  width: 100000,
  height: 100000
}

export type GridLineConf = {
  smallGridSpacing?: number
  gridSpacing?: number
  gridLineStroke?: number
  gridLineOpacity?: number
  gridLineColor?: string
}

class GridLine {
  static $inject: string[]
  private _visible: boolean
  private _canvas: Canvas
  private _gfx?: SVGElement
  private _pattern?: SVGPatternElement
  private _config: Required<GridLineConf>

  constructor(config: GridLineConf, canvas: Canvas, eventBus: EventBus) {
    this._config = {
      smallGridSpacing: SmallGridSpacing,
      gridSpacing: GridSpacing,
      gridLineStroke: GridLineStroke,
      gridLineOpacity: GridLineOpacity,
      gridLineColor: GridLineColor,
      ...(config || {})
    }
    this._canvas = canvas
    this._visible = false

    eventBus.on('diagram.init', () => {
      this._init()
      this.toggle(true)
    })

    eventBus.on('gridSnapping.toggle', <T extends boolean>(event) => {
      const active = event.active
      this.toggle(active)
      this._centerGridAroundViewbox()
    })

    eventBus.on('canvas.viewbox.changed', <CanvasViewbox>(context) => {
      const viewbox = context.viewbox

      this._centerGridAroundViewbox(viewbox)
    })
  }

  _init() {
    // @ts-ignore
    let defs = domQuery('defs', this._canvas._svg)

    if (!defs) {
      defs = svgCreate('defs')
      // @ts-ignore
      svgAppend(this._canvas._svg, defs)
    }

    // 小网格
    const smallGridPattern = svgCreate('pattern')
    const smallGridPatternId = 'djs-small-grid-pattern-' + randomNumber()
    svgAttr(smallGridPattern, {
      id: smallGridPatternId,
      width: this._config.smallGridSpacing,
      height: this._config.smallGridSpacing,
      patternUnits: 'userSpaceOnUse'
    })

    const smallGridPath = svgCreate('path')
    svgAttr(smallGridPath, {
      d: `M ${this._config.smallGridSpacing},0 L 0,0 0,${this._config.smallGridSpacing} ${this._config.smallGridSpacing},${this._config.smallGridSpacing} Z`,
      fill: 'none',
      stroke: this._config.gridLineColor,
      strokeWidth: this._config.gridLineStroke,
      opacity: this._config.gridLineOpacity
    })
    svgAppend(smallGridPattern, smallGridPath)

    // 大网格
    const gridPattern = (this._pattern = svgCreate('pattern'))
    const gridPatternId = 'djs-grid-pattern-' + randomNumber()
    svgAttr(gridPattern, {
      id: gridPatternId,
      width: this._config.gridSpacing,
      height: this._config.gridSpacing,
      patternUnits: 'userSpaceOnUse'
    })

    const gridPath = svgCreate('path')
    svgAttr(gridPath, {
      d: `M ${this._config.gridSpacing},0 L 0,0 0,${this._config.gridSpacing} ${this._config.gridSpacing},${this._config.gridSpacing} Z`,
      fill: 'none',
      stroke: this._config.gridLineColor,
      strokeWidth: this._config.gridLineStroke * 2,
      opacity: this._config.gridLineOpacity * 2
    })
    svgAppend(gridPattern, gridPath)

    const gridRect = svgCreate('rect')
    svgAttr(gridRect, {
      width: this._config.gridSpacing,
      height: this._config.gridSpacing,
      fill: `url(#${smallGridPatternId})`
    })
    svgAppend(gridPattern, gridRect)

    // 注册 svg def
    svgAppend(defs!, smallGridPattern)
    svgAppend(defs!, gridPattern)

    // 绘制和添加网格背景
    const grid = (this._gfx = svgCreate('rect'))
    svgAttr(grid, {
      x: -(GRID_DIMENSIONS.width / 2),
      y: -(GRID_DIMENSIONS.height / 2),
      width: GRID_DIMENSIONS.width,
      height: GRID_DIMENSIONS.height,
      fill: `url(#${gridPatternId})`
    })
  }

  _centerGridAroundViewbox(viewbox?: CanvasViewbox) {
    if (!viewbox) {
      viewbox = this._canvas.viewbox()
    }

    // @ts-ignore
    const mid = getMid(viewbox)

    svgAttr(this._gfx!, {
      x: -(GRID_DIMENSIONS.width / 2) + quantize(mid.x, this._config.gridSpacing, 'round'),
      y: -(GRID_DIMENSIONS.height / 2) + quantize(mid.y, this._config.gridSpacing, 'round')
    })
  }

  isVisible() {
    return this._visible
  }

  toggle(visible?: boolean) {
    if (typeof visible === 'undefined') {
      visible = !this._visible
    }

    if (visible === this._visible) {
      return
    }

    const parent = this._getParent()

    if (visible) {
      svgAppend(parent, this._gfx!)
    } else {
      svgClear(parent)
    }

    this._visible = visible
  }

  _getParent() {
    return this._canvas.getLayer(LAYER_NAME, -2)
  }
}

GridLine.$inject = ['config.gridLine', 'canvas', 'eventBus']

// helpers ///////////////
function randomNumber() {
  return Math.round(Math.random() * 1000000)
}

export default GridLine

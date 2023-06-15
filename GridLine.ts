import {
  append as svgAppend,
  attr as svgAttr,
  clear as svgClear,
  create as svgCreate
} from 'tiny-svg'
import { query as domQuery } from 'min-dom'
import { SPACING, quantize } from 'diagram-js/lib/features/grid-snapping/GridUtil'
import { getMid } from 'diagram-js/lib/layout/LayoutUtil'
import type Canvas from 'diagram-js/lib/core/Canvas'

/**
 * @typedef {import('diagram-js/lib/core/Canvas').default} Canvas
 * @typedef {import('diagram-js/lib/core/EventBus').default} EventBus
 */

const SmallGridSpacing = SPACING
const GridLineSpacing = SmallGridSpacing * 10
const GridLineStroke = 0.5
const GridLineOpacity = 0.5

const GRID_COLOR = '#ccc'
const LAYER_NAME = 'djs-grid-line'

const GRID_DIMENSIONS = {
  width: 100000,
  height: 100000
}

class GridLine {
  private _visible: boolean
  private _canvas: Canvas
  static $inject: string[]
  private _gfx?: SVGElement
  private _pattern?: SVGPatternElement

  /**
   * @param {Canvas} canvas
   * @param {EventBus} eventBus
   */
  constructor(canvas, eventBus) {
    this._canvas = canvas
    this._visible = false

    eventBus.on('diagram.init', () => {
      this._init()
    })

    eventBus.on('gridSnapping.toggle', (event) => {
      const active = event.active
      this.toggle(active)
      this._centerGridAroundViewbox()
    })

    eventBus.on('canvas.viewbox.changed', (context) => {
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
      width: SmallGridSpacing,
      height: SmallGridSpacing,
      patternUnits: 'userSpaceOnUse'
    })

    const smallGridPath = svgCreate('path')
    svgAttr(smallGridPath, {
      d: `M ${SmallGridSpacing} 0 L 0 0 0 ${SmallGridSpacing}`,
      fill: 'none',
      stroke: GRID_COLOR,
      strokeWidth: GridLineStroke,
      opacity: GridLineOpacity
    })
    svgAppend(smallGridPattern, smallGridPath)

    // 大网格
    const gridPattern = (this._pattern = svgCreate('pattern'))
    const gridPatternId = 'djs-grid-pattern-' + randomNumber()
    svgAttr(gridPattern, {
      id: gridPatternId,
      width: GridLineSpacing,
      height: GridLineSpacing,
      patternUnits: 'userSpaceOnUse'
    })

    const gridPath = svgCreate('path')
    svgAttr(gridPath, {
      d: `M ${GridLineSpacing} 0 L 0 0 0 ${GridLineSpacing}`,
      fill: 'none',
      stroke: GRID_COLOR,
      strokeWidth: GridLineStroke * 2,
      opacity: GridLineOpacity * 2
    })
    svgAppend(gridPattern, gridPath)

    const gridRect = svgCreate('rect')
    svgAttr(gridRect, {
      width: GridLineSpacing,
      height: GridLineSpacing,
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

  _centerGridAroundViewbox(viewbox?) {
    if (!viewbox) {
      viewbox = this._canvas.viewbox()
    }

    const mid = getMid(viewbox)

    svgAttr(this._gfx!, {
      x: -(GRID_DIMENSIONS.width / 2) + quantize(mid.x, GridLineSpacing, 'round'),
      y: -(GRID_DIMENSIONS.height / 2) + quantize(mid.y, GridLineSpacing, 'round')
    })
  }

  isVisible() {
    return this._visible
  }

  toggle(visible) {
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

GridLine.$inject = ['canvas', 'eventBus']

// helpers ///////////////
function randomNumber() {
  return Math.trunc(Math.random() * 1000000)
}

export default GridLine

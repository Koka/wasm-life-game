import { perfSpan } from "../util/perf"

import { CELL_SIZE } from './cell'
import drawCells from "./cells"
import drawCursor from "./cursor"
import drawGrid from "./grid"

const initCanvas = perfSpan(
  'Init canvas',
  (canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D | null => {
    canvas.height = (CELL_SIZE + 1) * height + 1
    canvas.width = (CELL_SIZE + 1) * width + 1
    return canvas.getContext('2d')
  }
)

const convertCoordinates =
  (widthCells: number, heightCells: number, fn: (row: number, col: number) => void) =>
  (canvasLeft: number, canvasTop: number) => {
    if (canvasTop < 0 || canvasLeft < 0) return

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), heightCells - 1)
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), widthCells - 1)
    fn(row, col)
  }

function initRenderer(
  canvas: HTMLCanvasElement,
  widthCells: number,
  heightCells: number,
  getCells: () => Uint8Array,
  toggleCell: (row: number, col: number) => void
) {
  const ctx = initCanvas(canvas, widthCells, heightCells)
  if (!ctx) throw new Error('No canvas 2d context')

  let cursorPos: [number, number] | null = null

  const render = () => {
    const cells = getCells()
    const fetchCellAge = (row: number, col: number): number => {
      const idx = row * widthCells + col
      return cells[idx]
    }

    drawGrid(ctx)
    drawCells(ctx, widthCells, heightCells, fetchCellAge)
    if (cursorPos) {
      const [row, col] = cursorPos
      drawCursor(ctx, row, col)
    }
  }

  const onHover = convertCoordinates(widthCells, heightCells, (row: number, col: number) => {
    cursorPos = [row, col]
    render()
  })

  const onClick = convertCoordinates(widthCells, heightCells, (row: number, col: number) => {
    toggleCell(row, col)
    cursorPos = [row, col]
    render()
  })

  const onLeave = () => {
    setTimeout(() => {
      cursorPos = null
    }, 50)
  }

  return { render, onClick, onHover, onLeave }
}

export default initRenderer

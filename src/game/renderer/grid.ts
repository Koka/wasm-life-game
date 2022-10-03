import { perfSpan } from "../util/perf"
import { CELL_SIZE } from "./cell"

const GRID_COLOR = '#cccccc'

const drawGrid = perfSpan('Draw grid', (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas

  ctx.beginPath()
  ctx.strokeStyle = GRID_COLOR

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0)
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1)
  }

  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1)
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1)
  }

  ctx.stroke()
})

export default drawGrid

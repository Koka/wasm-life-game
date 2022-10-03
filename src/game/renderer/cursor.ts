import { drawSingleCell } from "./cell"

const CURSOR_COLOR = '#ff0ca8'

const drawCursor = (ctx: CanvasRenderingContext2D, row: number, col: number) => {
  ctx.beginPath()
  ctx.fillStyle = CURSOR_COLOR
  drawSingleCell(ctx, row, col)
  ctx.stroke()
}


export default drawCursor

import { perfSpan } from "../util/perf"
import { drawSingleCell, getCellColor } from "./cell"

const drawCells = perfSpan(
  'Draw cells',
  (
    ctx: CanvasRenderingContext2D,
    widthCells: number,
    heightCells: number,
    getAge: (row: number, col: number) => number
  ) => {
    ctx.beginPath()

    // Fill style is expensive so let's unroll edge cases to minimise it's invocations

    ctx.fillStyle = getCellColor(0)
    for (let row = 0; row < heightCells; row++) {
      for (let col = 0; col < widthCells; col++) {
        const age = getAge(row, col)
        if (age === 0) {
          drawSingleCell(ctx, row, col)
        }
      }
    }

    ctx.fillStyle = getCellColor(1)
    for (let row = 0; row < heightCells; row++) {
      for (let col = 0; col < widthCells; col++) {
        const age = getAge(row, col)
        if (age === 1) {
          drawSingleCell(ctx, row, col)
        }
      }
    }

    for (let row = 0; row < heightCells; row++) {
      for (let col = 0; col < widthCells; col++) {
        const age = getAge(row, col)
        if (age > 1) {
          ctx.fillStyle = getCellColor(age)
          drawSingleCell(ctx, row, col)
        }
      }
    }

    ctx.stroke()
  }
)

export default drawCells

import { perfSpan } from "./perf"

const GRID_COLOR = '#cccccc'
const DEAD_COLOR = '#ffffff'
const ALIVE_COLOR = '#000000'

const CELL_SIZE = 8

export const initCanvas = perfSpan(
  'Init canvas',
  (canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D | null => {
      canvas.height = (CELL_SIZE + 1) * height + 1
      canvas.width = (CELL_SIZE + 1) * width + 1
      return canvas.getContext('2d')
  }
)

export const drawGrid = perfSpan('Draw grid', (ctx: CanvasRenderingContext2D) => {
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

export const drawCells = perfSpan(
  'Draw cells',
  (ctx: CanvasRenderingContext2D, isAlive: (row: number, col: number) => boolean) => {
    const { width, height } = ctx.canvas

    ctx.beginPath()

    ctx.fillStyle = ALIVE_COLOR
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (isAlive(row, col)) {
          ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE)
        }
      }
    }

    ctx.fillStyle = DEAD_COLOR
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (!isAlive(row, col)) {
          ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE)
        }
      }
    }

    ctx.stroke()
  }
)

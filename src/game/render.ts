import { perfSpan } from "./perf"

const GRID_COLOR = '#cccccc'
const DEAD_COLOR = '#ffffff'
const NEWBORN_COLOR = '#0fa00f'

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
  (
    ctx: CanvasRenderingContext2D,
    widthCells: number,
    heightCells: number,
    getAge: (row: number, col: number) => number
  ) => {
    ctx.beginPath()

    ctx.fillStyle = DEAD_COLOR
    for (let row = 0; row < heightCells; row++) {
      for (let col = 0; col < widthCells; col++) {
        const age = getAge(row, col)
        if (age === 0) {
          ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE)
        }
      }
    }

    ctx.fillStyle = NEWBORN_COLOR
    for (let row = 0; row < heightCells; row++) {
      for (let col = 0; col < widthCells; col++) {
        const age = getAge(row, col)
        if (age === 1) {
          ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE)
        }
      }
    }

    const minGreen = 160
    const fullRange = 255 - minGreen

    for (let row = 0; row < heightCells; row++) {
      for (let col = 0; col < widthCells; col++) {
        const age = getAge(row, col)
        if (age > 1) {
          const green = Math.round(fullRange * age / 255)
          const hexG = ('0' + (fullRange - green & 0xff).toString(16)).slice(-2)

          const hexR = age > 127 ? 'a0' : '0f'

          ctx.fillStyle = `#${hexR}${hexG}0f`
          ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE)
        }
      }
    }

    ctx.stroke()
  }
)

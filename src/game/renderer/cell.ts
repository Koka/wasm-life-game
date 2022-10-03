export const CELL_SIZE = 8

const DEAD_COLOR = '#ffffff'
const NEWBORN_COLOR = '#0fa00f'

export const drawSingleCell = (ctx: CanvasRenderingContext2D, row: number, col: number) => {
  ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE)
}

const MIN_GREEN = 160
const REMAINING_GREEN = 255 - MIN_GREEN

export const getCellColor = (age: number) => {
  switch (age) {
    case 0:
      return DEAD_COLOR
    case 1:
      return NEWBORN_COLOR
    default:
      const green = Math.round(REMAINING_GREEN * age / 255)
      const hexG = ('0' + (REMAINING_GREEN - green & 0xff).toString(16)).slice(-2)

      const hexR = age > 127 ? 'a0' : '0f'

      return `#${hexR}${hexG}0f`
  }
}



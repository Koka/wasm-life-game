import { Universe } from 'wasm/wasm-life/pkg/wasm_life'
import { memory } from 'wasm/wasm-life/pkg/wasm_life_bg.wasm'

import { drawCells, drawGrid, initCanvas } from './render'
import { perfSpan } from './perf'

function prepareUniverse() {
  const universe = Universe.new()
  const widthCells = universe.width()
  const heightCells = universe.height()

  let iterationCount = 0
  let tps = 0
  const calcTps = (ms: number) => {
    tps = 1000 / ms
    iterationCount++
  }

  const tick = perfSpan('Engine tick', () => universe.tick(), calcTps)

  let cells = new Uint8Array(memory.buffer, universe.cells(), widthCells * heightCells)

  const restart = () => {
    universe.restart()
    iterationCount = 0
    cells = new Uint8Array(memory.buffer, universe.cells(), widthCells * heightCells)
  }

  const fetchCellAge = (row: number, col: number): number => {
    const idx = row * widthCells + col
    return cells[idx]
  }

  return {
    widthCells,
    heightCells,
    tick,
    fetchCellAge,
    restart,
    getTPS: () => tps,
    getIterationCount: () => iterationCount,
  }
}

function initRenderer(
  canvas: HTMLCanvasElement,
  widthCells: number,
  heightCells: number,
  fetchCellAge: (row: number, col: number) => number
) {
  const ctx = initCanvas(canvas, widthCells, heightCells)
  if (!ctx) throw new Error('No canvas 2d context')

  const render = () => {
    drawGrid(ctx)
    drawCells(ctx, widthCells, heightCells, fetchCellAge)
  }

  return render
}

function runLife(canvas: HTMLCanvasElement) {
  const { widthCells, heightCells, tick, fetchCellAge, restart, getTPS, getIterationCount } = prepareUniverse()
  const render = initRenderer(canvas, widthCells, heightCells, fetchCellAge)

  let fps = 0
  const calcFps = (ms: number) => {
    fps = 1000 / ms
  }

  let speed = 1

  let loop: null | ReturnType<typeof requestAnimationFrame> = null

  let loopsBeforeTick = 0
  const gameLoop = perfSpan(
    'Loop iteration',
    () => {
      if (speed > 0) {
        for (let i = 0; i < speed; i++) {
          tick()
        }
      } else if (speed < 0) {
        if (loopsBeforeTick > 0) {
          loopsBeforeTick--
        } else {
          tick()
          loopsBeforeTick = Math.abs(speed)
        }
      }
      render()

      loop = requestAnimationFrame(gameLoop)
    },
    calcFps
  )

  render()
  loop = requestAnimationFrame(gameLoop)

  return {
    size: [widthCells, heightCells],
    getFPS: () => fps,
    getTPS,
    getIterationCount,

    restart: () => {
      restart()
      if (!loop) {
        render()
      }
    },

    isPlaying: () => !!loop,
    play: () => {
      if (loop !== null) return
      loop = requestAnimationFrame(gameLoop)
    },
    pause: () => {
      if (loop !== null) {
        cancelAnimationFrame(loop)
      }
      loop = null
    },

    getSpeed: () => speed,
    setSpeed: (num: number) => {
      speed = num
    },
  }
}

export default runLife

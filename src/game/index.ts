import { Universe } from 'wasm/wasm-life/pkg/wasm_life'
import { memory } from 'wasm/wasm-life/pkg/wasm_life_bg.wasm'

import { drawCells, drawGrid, initCanvas } from './render'
import { perfSpan } from './perf'

function prepareUniverse() {
  const universe = Universe.new()
  const widthCells = universe.width()
  const heightCells = universe.height()

  const tick = perfSpan('Engine tick', () => universe.tick())

  let cells = new Uint8Array(memory.buffer, universe.cells(), widthCells * heightCells)

  const restart = () => {
    universe.restart()
    cells = new Uint8Array(memory.buffer, universe.cells(), widthCells * heightCells)
  }

  const fetchCellAge = (row: number, col: number): number => {
    const idx = row * widthCells + col
    return cells[idx]
  }

  return { widthCells, heightCells, tick, fetchCellAge, restart }
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
  const { widthCells, heightCells, tick, fetchCellAge, restart } = prepareUniverse()
  const render = initRenderer(canvas, widthCells, heightCells, fetchCellAge)

  let fps = 0
  const calcFps = (ms: number) => {
    fps = 1000 / ms
  }

  let ticksPerFrame = 1

  let loop: null | ReturnType<typeof requestAnimationFrame> = null

  const gameLoop = perfSpan(
    'Loop iteration',
    () => {
      for (let i = 0; i < ticksPerFrame; i++) {
        tick()
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

    getSpeed: () => ticksPerFrame,
    setSpeed: (num: number) => {
      ticksPerFrame = num
    },
  }
}

export default runLife

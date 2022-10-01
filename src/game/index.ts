import { Cell, Universe } from "wasm/wasm-life/pkg/wasm_life"
import { memory } from "wasm/wasm-life/pkg/wasm_life_bg.wasm"

import { drawCells, drawGrid, initCanvas } from "./render"
import { perfSpan } from "./perf"

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

  const fetchCell = (row: number, col: number) => {
    const idx = row * widthCells + col
    return cells[idx] === Cell.Alive
  }

  return { widthCells, heightCells, tick, fetchCell, restart }
}

function initRenderer(widthCells: number, heightCells: number, fetchCell: (row: number, col: number) => boolean) {
  const canvas = document.getElementById('app') as HTMLCanvasElement

  const ctx = initCanvas(canvas, widthCells, heightCells)
  if (!ctx) throw new Error('No canvas 2d context')

  const render = () => {
    drawGrid(ctx)
    drawCells(ctx, fetchCell)
  }

  return render
}

function runLife() {
  const { widthCells, heightCells, tick, fetchCell, restart } = prepareUniverse()
  const render = initRenderer(widthCells, heightCells, fetchCell)

  let fps = 0
  const calcFps = (ms: number) => {
    fps = 1000 / ms
  }

  let loop: null | ReturnType<typeof requestAnimationFrame> = null

  const gameLoop = perfSpan(
    'Loop iteration',
    () => {
      tick()
      render()
      loop = requestAnimationFrame(gameLoop)
    },
    calcFps
  )

  render()
  loop = requestAnimationFrame(gameLoop)

  return {
    restart: () => {
      restart()
      if (!loop) {
        render()
      }
    },
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
    isPlaying: () => !!loop,
    getFPS: () => fps,
  }
}

export default runLife

import { Cell, Universe } from "wasm/wasm-life/pkg/wasm_life"
import { memory } from "wasm/wasm-life/pkg/wasm_life_bg.wasm"

import { drawCells, drawGrid, initCanvas } from "./render"
import { isPerfEnabled, perfSpan, setPerfEnabled } from "./perf"

function prepareUniverse() {
  const universe = Universe.new()
  const widthCells = universe.width()
  const heightCells = universe.height()

  const tick = perfSpan('Engine tick', () => universe.tick())

  const cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, widthCells * heightCells)
  const fetchCell = (row: number, col: number) => {
    const idx = row * widthCells + col
    return cells[idx] === Cell.Alive
  }

  return { widthCells, heightCells, tick, fetchCell }
}

function initRenderer(widthCells: number, heightCells: number, fetchCell: (row: number, col: number) => boolean) {
  const canvas = document.getElementById('app') as HTMLCanvasElement

  const ctx = initCanvas(canvas, widthCells, heightCells)
  if (!ctx) throw new Error('No canvas 2d context')

  const render = () => drawCells(ctx, fetchCell)

  drawGrid(ctx)
  render()

  return render
}

function runLife() {
  const { widthCells, heightCells, tick, fetchCell } = prepareUniverse()
  const render = initRenderer(widthCells, heightCells, fetchCell)

  let fps = 0
  const calcFps = (ms: number) => {
    fps = 1000 / ms
  }

  const renderLoop = perfSpan(
    'Loop iteration',
    () => {
      tick()
      render()
      requestAnimationFrame(renderLoop)
    },
    calcFps
  )

  requestAnimationFrame(renderLoop)

  const fpsContainer = document.getElementById('fps') as HTMLElement
  setInterval(() => {
    const num = Math.round(fps)
    fpsContainer.textContent = `${num} fps`
  }, 500)

  const perfBtn = document.getElementById('perfBtn')
  if (perfBtn) {
    perfBtn.textContent = `Perf logging ${isPerfEnabled() ? 'ON' : 'OFF'}`

    perfBtn.addEventListener('click', () => {
      setPerfEnabled(!isPerfEnabled())
      perfBtn.textContent = `Perf logging ${isPerfEnabled() ? 'ON' : 'OFF'}`
    })
  }
}

export default runLife

import { Universe } from "wasm/wasm-life/pkg/wasm_life"
import { memory } from "wasm/wasm-life/pkg/wasm_life_bg.wasm"
import { perfSpan } from "./util/perf"

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

  const toggleCell = (row: number, col: number) => universe.toggle_cell(row, col)

  const getCells = () => new Uint8Array(memory.buffer, universe.cells(), widthCells * heightCells)

  const restart = () => {
    universe.restart()
    iterationCount = 0
  }

  return {
    widthCells,
    heightCells,
    tick,
    getCells,
    toggleCell,
    restart,
    getTPS: () => tps,
    getIterationCount: () => iterationCount,
  }
}

export default prepareUniverse

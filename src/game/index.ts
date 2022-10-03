import { perfSpan } from './util/perf'
import prepareUniverse from './logic'
import initRenderer from './renderer'

function runLife(canvas: HTMLCanvasElement) {
  const { widthCells, heightCells, tick, getCells, toggleCell, restart, getTPS, getIterationCount } = prepareUniverse()

  const { render, onClick, onHover, onLeave } = initRenderer(canvas, widthCells, heightCells, getCells, toggleCell)

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
    getTPS: () => (speed <= 1 ? getTPS() : fps * speed),
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
      if (num === 0 || num === -1) {
        speed = 1
      } else {
        speed = num
      }
    },
    onClick,
    onHover,
    onLeave,
  }
}

export default runLife

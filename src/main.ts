import runLife from './game'
import { isPerfEnabled, setPerfEnabled } from './game/util/perf'

import './main.css'

type ICtx = ReturnType<typeof runLife>

function buildUI(ctx: ICtx) {
  const fpsContainer = document.getElementById('fps') as HTMLElement
  setInterval(() => {
    const fpsNum = Math.round(ctx.getFPS())
    const tpsNum = Math.round(ctx.getTPS())
    const speed = ctx.getSpeed()
    const iterations = ctx.getIterationCount()

    const [w, h] = ctx.size

    fpsContainer.textContent = `${fpsNum} fps ${tpsNum} tps (Speed x${
      speed > 0 ? speed : `1/${Math.abs(speed)}`
    }, cells: ${w * h}, iterations: ${iterations})`
  }, 500)

  const perfBtn = document.getElementById('perfBtn')
  if (perfBtn) {
    perfBtn.textContent = `Perf logging ${isPerfEnabled() ? 'ON' : 'OFF'}`

    perfBtn.addEventListener('click', () => {
      setPerfEnabled(!isPerfEnabled())
      perfBtn.textContent = `Perf logging ${isPerfEnabled() ? 'ON' : 'OFF'}`
    })
  }

  const playPauseBtn = document.getElementById('playPauseBtn')
  if (playPauseBtn) {
    playPauseBtn.textContent = ctx.isPlaying() ? 'Pause' : 'Play'

    playPauseBtn.addEventListener('click', () => {
      if (ctx.isPlaying()) {
        ctx.pause()
      } else {
        ctx.play()
      }
      playPauseBtn.textContent = ctx.isPlaying() ? 'Pause' : 'Play'
    })
  }

  const restartBtn = document.getElementById('restartBtn')
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      ctx.restart()
    })
  }

  const speedSlider =  document.getElementById('speedSlider') as HTMLInputElement
  if (speedSlider) {
    speedSlider.value = String(ctx.getSpeed())
    speedSlider.addEventListener('change', (e: Event) => {
      const tgt = e.target! as HTMLInputElement
      ctx.setSpeed(Number(tgt.value))
    })
  }

  canvas.addEventListener('click', (e: MouseEvent) => {
    ctx.pause()
    if (playPauseBtn) {
      playPauseBtn.textContent = ctx.isPlaying() ? 'Pause' : 'Play'
    }

    requestAnimationFrame(() => {
      const [canvasLeft, canvasTop] = cursorPos(e)
      ctx.onClick(canvasLeft, canvasTop)
    })
  })

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    requestAnimationFrame(() => {
      const [canvasLeft, canvasTop] = cursorPos(e)
      ctx.onHover(canvasLeft, canvasTop)
    })
  })

  canvas.addEventListener('mouseleave', () => {
    ctx.onLeave()
  })
}

const canvas = document.getElementById('app') as HTMLCanvasElement

let ctx = runLife(canvas)

const cursorPos = (e: MouseEvent) => {
  const boundingRect = canvas.getBoundingClientRect()

  const scaleX = canvas.width / boundingRect.width
  const scaleY = canvas.height / boundingRect.height

  const canvasLeft = (e.clientX - boundingRect.left) * scaleX
  const canvasTop = (e.clientY - boundingRect.top) * scaleY

  return [canvasLeft, canvasTop]
}

buildUI(ctx)

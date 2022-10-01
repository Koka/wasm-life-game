import runLife from './game'
import { isPerfEnabled, setPerfEnabled } from './game/perf'

import './main.css'

type ICtx = ReturnType<typeof runLife>

function buildUI(ctx: ICtx) {
  const fpsContainer = document.getElementById('fps') as HTMLElement
  setInterval(() => {
    const num = Math.round(ctx.getFPS())
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
}

let ctx = runLife()
buildUI(ctx)

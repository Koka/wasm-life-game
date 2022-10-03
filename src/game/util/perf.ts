let logEnabled = false

const prevTime = new Map<string, number>()

export const perfSpan =
  <A extends any[], R>(name: string, fn: (...args: A) => R, logTimeElapsed?: (time: number) => void): ((...args: A) => R) =>
  (...args) => {
    if (logEnabled) {
      console.time(name)
    }
    try {
      return fn(...args)
    } finally {
      if (logEnabled) {
        console.timeEnd(name)
      }

      if (logTimeElapsed) {
        const prev = prevTime.get(name)
        const now = performance.now()
        if (prev) {
          logTimeElapsed(now - prev)
        }
        prevTime.set(name, now)
      }
    }
  }

export function isPerfEnabled() {
  return logEnabled
}

export function setPerfEnabled(on: boolean) {
  logEnabled = on
}

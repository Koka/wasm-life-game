let logEnabled = false

export const perfSpan =
  <A extends any[], R>(name: string, fn: (...args: A) => R, logTime?: (time: number) => void): ((...args: A) => R) =>
  (...args) => {
    const start = performance.now()

    if (logEnabled) {
      console.time(name)
    }
    try {
      return fn(...args)
    } finally {
      if (logEnabled) {
        console.timeEnd(name)
      }

      if (logTime) {
        const finish = performance.now()
        logTime(finish - start)
      }
    }
  }

export function isPerfEnabled() {
  return logEnabled
}

export function setPerfEnabled(on: boolean) {
  logEnabled = on
}

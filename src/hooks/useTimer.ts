import { ref, computed, Ref, ComputedRef } from 'vue'

export interface TimerInterface {
  seconds: Ref<number>
  formattedTime: ComputedRef<string>
  isRunning: Ref<boolean>
  start: () => void
  pause: () => void
  reset: () => void
  restart: () => void
}

export function useTimer(): TimerInterface {
  // Track milliseconds internally for precision
  const milliseconds = ref<number>(0)
  const seconds = computed<number>(() => Math.floor(milliseconds.value / 1000))
  const isRunning = ref<boolean>(false)
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null)

  // Store start time and accumulated time separately
  const startTime = ref<number>(0)
  const accumulatedTime = ref<number>(0)

  const formattedTime = computed<string>(() => {
    const totalSeconds = Math.floor(milliseconds.value / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60
    const ms = milliseconds.value % 1000

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
  })

  const start = (): void => {
    if (isRunning.value) return

    isRunning.value = true
    startTime.value = Date.now()

    intervalId.value = setInterval(() => {
      // Calculate current elapsed time: accumulated + time since last start
      milliseconds.value =
        accumulatedTime.value + (Date.now() - startTime.value)
    }, 50) // Update more frequently for smoother display
  }

  const pause = (): void => {
    if (!isRunning.value) return

    if (intervalId.value !== null) {
      // Store accumulated time when pausing
      accumulatedTime.value = milliseconds.value

      clearInterval(intervalId.value)
      intervalId.value = null
      isRunning.value = false
    }
  }

  const reset = (): void => {
    pause()
    milliseconds.value = 0
    accumulatedTime.value = 0
  }

  const restart = (): void => {
    reset()
    start()
  }

  return {
    seconds: computed(() => Math.floor(milliseconds.value / 1000)),
    formattedTime,
    isRunning,
    start,
    pause,
    reset,
    restart,
  }
}

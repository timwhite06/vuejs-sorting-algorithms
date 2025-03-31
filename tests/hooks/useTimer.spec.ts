import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useTimer } from '@/hooks/useTimer'

describe('useTimer', () => {
  // Store original implementations using spyOn
  let dateNowSpy: any
  let setIntervalSpy: any
  let clearIntervalSpy: any

  // Mock values
  let currentTime = 1000
  let intervalCallback: Function | null = null
  let intervalId = 123

  beforeEach(() => {
    // Mock Date.now to return controlled time
    dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => currentTime)

    // Mock setInterval to capture callback
    setIntervalSpy = vi
      .spyOn(window, 'setInterval')
      .mockImplementation((callback: any, ms?: number) => {
        intervalCallback = callback as Function
        return intervalId as any
      })

    // Mock clearInterval
    clearIntervalSpy = vi
      .spyOn(window, 'clearInterval')
      .mockImplementation(() => {})

    // Reset time for each test
    currentTime = 1000
  })

  afterEach(() => {
    // Restore original functions
    dateNowSpy.mockRestore()
    setIntervalSpy.mockRestore()
    clearIntervalSpy.mockRestore()

    // Reset interval callback
    intervalCallback = null
  })

  it('initializes with correct values', () => {
    const timer = useTimer()

    expect(timer.seconds.value).toBe(0)
    expect(timer.formattedTime.value).toBe('00:00.000')
    expect(timer.isRunning.value).toBe(false)
  })

  it('starts the timer correctly', () => {
    const timer = useTimer()

    timer.start()

    expect(timer.isRunning.value).toBe(true)
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 50)
  })

  it('updates milliseconds correctly when running', async () => {
    const timer = useTimer()

    timer.start()

    // Simulate time passing (500ms)
    currentTime += 500
    if (intervalCallback) intervalCallback()
    await nextTick()

    expect(timer.seconds.value).toBe(0)
    expect(timer.formattedTime.value).toBe('00:00.500')

    // Simulate more time passing (600ms more, total 1100ms)
    currentTime += 600
    if (intervalCallback) intervalCallback()
    await nextTick()

    expect(timer.seconds.value).toBe(1)
    expect(timer.formattedTime.value).toBe('00:01.100')
  })

  it('pauses the timer correctly', () => {
    const timer = useTimer()

    // Start and advance timer
    timer.start()
    currentTime += 1500
    if (intervalCallback) intervalCallback()

    // Pause timer
    timer.pause()

    expect(timer.isRunning.value).toBe(false)
    expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId)
    expect(timer.seconds.value).toBe(1)
    expect(timer.formattedTime.value).toBe('00:01.500')

    // Verify time is frozen
    currentTime += 1000
    expect(timer.seconds.value).toBe(1)
    expect(timer.formattedTime.value).toBe('00:01.500')
  })

  it('resumes from the correct position after pause', async () => {
    const timer = useTimer()

    // Start and advance timer
    timer.start()
    currentTime += 1500
    if (intervalCallback) intervalCallback()

    // Pause timer
    timer.pause()
    expect(timer.formattedTime.value).toBe('00:01.500')

    // Resume timer (simulate a new interval)
    currentTime += 500 // Simulate 500ms delay before resuming
    timer.start()

    // Verify it doesn't jump ahead due to the delay
    expect(timer.formattedTime.value).toBe('00:01.500')

    // Advance time after resuming
    currentTime += 800
    if (intervalCallback) intervalCallback()
    await nextTick()

    // Should be 1500ms + 800ms = 2300ms
    expect(timer.seconds.value).toBe(2)
    expect(timer.formattedTime.value).toBe('00:02.300')
  })

  it('resets the timer correctly', () => {
    const timer = useTimer()

    // Start and advance timer
    timer.start()
    currentTime += 5500
    if (intervalCallback) intervalCallback()
    expect(timer.seconds.value).toBe(5)

    // Reset timer
    timer.reset()

    expect(timer.isRunning.value).toBe(false)
    expect(timer.seconds.value).toBe(0)
    expect(timer.formattedTime.value).toBe('00:00.000')
    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('restarts the timer correctly', () => {
    const timer = useTimer()

    // Start and advance timer
    timer.start()
    currentTime += 5500
    if (intervalCallback) intervalCallback()
    expect(timer.seconds.value).toBe(5)

    // Reset calls to track restart properly
    vi.clearAllMocks()

    // Restart timer
    timer.restart()

    expect(timer.isRunning.value).toBe(true)
    expect(timer.seconds.value).toBe(0)
    expect(timer.formattedTime.value).toBe('00:00.000')
    expect(clearIntervalSpy).toHaveBeenCalled()
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 50)
  })

  it('formats time with millisecond precision', async () => {
    const timer = useTimer()

    timer.start()

    // Test various times
    const testTimes = [
      { advance: 123, expected: '00:00.123' },
      { advance: 877, expected: '00:01.000' }, // 1000ms total
      { advance: 59000, expected: '01:00.000' }, // 60000ms total
      { advance: 60000, expected: '02:00.000' }, // 120000ms total
      { advance: 506, expected: '02:00.506' }, // 120506ms total
    ]

    for (const test of testTimes) {
      currentTime += test.advance
      if (intervalCallback) intervalCallback()
      await nextTick()

      expect(timer.formattedTime.value).toBe(test.expected)
    }
  })

  it('does nothing when starting an already running timer', () => {
    const timer = useTimer()

    timer.start()
    const firstCall = setIntervalSpy.mock.calls.length

    // Try to start again
    timer.start()

    // setInterval should not be called again
    expect(setIntervalSpy.mock.calls.length).toBe(firstCall)
  })

  it('does nothing when pausing an already stopped timer', () => {
    const timer = useTimer()

    // Try to pause without starting
    timer.pause()

    // clearInterval should not be called
    expect(clearIntervalSpy).not.toHaveBeenCalled()
  })
})

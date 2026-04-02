import { useState, useEffect } from 'react'

const START_DATE = new Date('2024-10-01T00:00:00')

export function useLoveCounter() {
  const [timeElapsed, setTimeElapsed] = useState(calculateTime())

  function calculateTime() {
    const now = new Date()
    const diff = now - START_DATE

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    const totalHours = Math.floor(diff / (1000 * 60 * 60))
    const totalMinutes = Math.floor(diff / (1000 * 60))
    const totalHeartbeats = Math.floor(diff / 1000) * 72 // avg heartbeat per second approx

    return {
      days,
      hours,
      minutes,
      seconds,
      totalHours,
      totalMinutes,
      totalHeartbeats,
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(calculateTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return timeElapsed
}

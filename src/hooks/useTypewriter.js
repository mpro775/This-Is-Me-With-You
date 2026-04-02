import { useState, useEffect, useCallback } from 'react'

export function useTypewriter(text, speed = 60, delay = 0) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)
    setIsStarted(false)

    const startTimer = setTimeout(() => {
      setIsStarted(true)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [text, delay])

  useEffect(() => {
    if (!isStarted) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, isStarted])

  const skip = useCallback(() => {
    setDisplayedText(text)
    setIsComplete(true)
  }, [text])

  return { displayedText, isComplete, skip }
}

import { useState, useEffect } from 'react'

const SECTIONS = ['timeline', 'messages', 'scenarios', 'counter', 'climax']

export function useSectionTracker() {
  const [activeSection, setActiveSection] = useState('timeline')

  useEffect(() => {
    const observers = []

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
      )

      observer.observe(el)
      observers.push({ observer, el })
    })

    return () => {
      observers.forEach(({ observer, el }) => observer.unobserve(el))
    }
  }, [])

  return activeSection
}

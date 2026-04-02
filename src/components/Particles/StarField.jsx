import { useState } from 'react'

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 4,
    opacity: Math.random() * 0.6 + 0.1,
  }))
}

export default function StarField({ count = 60 }) {
  const [stars] = useState(() => generateStars(count))

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill={`rgba(212, 165, 116, ${star.opacity})`}
          >
            <animate
              attributeName="opacity"
              values={`${star.opacity * 0.3};${star.opacity};${star.opacity * 0.3}`}
              dur={`${star.duration}s`}
              begin={`${star.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${star.size * 0.8};${star.size * 1.2};${star.size * 0.8}`}
              dur={`${star.duration}s`}
              begin={`${star.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

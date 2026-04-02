import { useState } from 'react'
import { motion } from 'framer-motion'

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 15,
    duration: 12 + Math.random() * 18,
    x: Math.random() * 100,
    size: 1.5 + Math.random() * 4,
    opacity: 0.08 + Math.random() * 0.25,
    drift: (Math.random() - 0.5) * 80,
    type: Math.random() > 0.7 ? 'rose' : 'gold',
  }))
}

function Particle({ delay, duration, x, size, opacity, drift, type }) {
  const color = type === 'rose'
    ? `rgba(201, 123, 139, ${opacity})`
    : `rgba(212, 165, 116, ${opacity})`

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '-20px',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      animate={{
        y: [0, -window.innerHeight - 100],
        x: [0, drift],
        opacity: [0, opacity, opacity, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export default function FloatingParticles({ count = 25, className = '' }) {
  const [particles] = useState(() => generateParticles(count))

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  )
}

import { useEffect, useState } from 'react'

export default function StarBurst({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 900)
    return () => clearTimeout(t)
  }, [onDone])

  if (!visible) return null

  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 360
    const rad   = (angle * Math.PI) / 180
    const dist  = 40 + Math.random() * 20
    return {
      tx: `${Math.cos(rad) * dist}px`,
      ty: `${Math.sin(rad) * dist}px`,
    }
  })

  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute text-[10px]"
          style={{
            '--tx': p.tx,
            '--ty': p.ty,
            animation: `particle-fly 0.6s ${i * 40}ms ease-out forwards`,
          }}
        >⭐</span>
      ))}
      {/* big star */}
      <span className="animate-star-pop text-3xl absolute">⭐</span>
    </span>
  )
}

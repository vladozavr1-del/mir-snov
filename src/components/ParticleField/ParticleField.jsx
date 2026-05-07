import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

const PARTICLE_COUNT = 80

function createParticle(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.3,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -(Math.random() * 0.4 + 0.1),
    opacity: Math.random() * 0.6 + 0.1,
    opacitySpeed: (Math.random() - 0.5) * 0.003,
    hue: Math.random() * 60 + 240, // blue-purple range
  }
}

export function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(canvas))
      particles[i].y = Math.random() * canvas.height
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.opacitySpeed

        if (p.opacity <= 0.05) p.opacitySpeed = Math.abs(p.opacitySpeed)
        if (p.opacity >= 0.7) p.opacitySpeed = -Math.abs(p.opacitySpeed)

        if (p.y < -10) {
          particles[i] = createParticle(canvas)
          particles[i].y = canvas.height + 10
        }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = `hsl(${p.hue}, 70%, 75%)`
        ctx.shadowBlur = p.size * 4
        ctx.shadowColor = `hsl(${p.hue}, 80%, 70%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}

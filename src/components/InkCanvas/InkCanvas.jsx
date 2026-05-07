import { useEffect, useRef } from 'react'

const MAX_AGE = 55
const MAX_POINTS = 220

export function InkCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const points = []
    let lastX = -1, lastY = -1

    const onMove = (e) => {
      const vx = lastX >= 0 ? e.clientX - lastX : 0
      const vy = lastY >= 0 ? e.clientY - lastY : 0
      const speed = Math.sqrt(vx * vx + vy * vy)

      points.push({ x: e.clientX, y: e.clientY, vx, vy, speed, age: 0, size: 0.8 + Math.random() * 1.4 })

      if (speed > 9 && Math.random() > 0.45) {
        points.push({
          x: e.clientX + (Math.random() - 0.5) * 7,
          y: e.clientY + (Math.random() - 0.5) * 7,
          vx: vx * 0.3, vy: vy * 0.3, speed: speed * 0.3,
          age: Math.floor(Math.random() * 14),
          size: 0.4 + Math.random() * 0.9,
        })
      }

      lastX = e.clientX
      lastY = e.clientY
      while (points.length > MAX_POINTS) points.shift()
    }
    window.addEventListener('mousemove', onMove)

    let rafId
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i]
        p.age++
        if (p.age >= MAX_AGE) { points.splice(i, 1); continue }

        const t = p.age / MAX_AGE
        const alpha = (1 - t) * (1 - t) * 0.48

        if (p.speed > 1.5) {
          const len = Math.min(p.speed * 0.4, 9)
          const nx = p.vx / Math.max(p.speed, 0.001)
          const ny = p.vy / Math.max(p.speed, 0.001)
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - nx * len, p.y - ny * len)
          ctx.strokeStyle = `rgba(167,139,250,${alpha})`
          ctx.lineWidth = p.size
          ctx.lineCap = 'round'
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(167,139,250,${alpha})`
          ctx.fill()
        }
      }

      rafId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 198 }}
      aria-hidden="true"
    />
  )
}

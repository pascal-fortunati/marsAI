import { useEffect, useRef } from 'react'
import { marsaiColors, withAlpha } from '../theme/marsai'

function CinemaCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let W = 0
    let H = 0
    let reduced = false

    type Node = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number }
    type Frame = { x: number; y: number; w: number; h: number; alpha: number; speed: number; col: string }

    let nodes: Node[] = []
    let frames: Frame[] = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(canvas.offsetWidth * dpr)
      canvas.height = Math.floor(canvas.offsetHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      W = canvas.offsetWidth
      H = canvas.offsetHeight

      const count = reduced ? 35 : 85
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.6 ? 255 : Math.random() > 0.5 ? 20 : 270,
      }))

      const frameCount = reduced ? 4 : 8
      frames = Array.from({ length: frameCount }, () => ({
        x: (Math.random() * 0.85 + 0.05) * W,
        y: (Math.random() * 0.85 + 0.05) * H,
        w: Math.random() * 80 + 60,
        h: Math.random() * 55 + 40,
        alpha: Math.random() * 0.12 + 0.04,
        speed: (Math.random() - 0.5) * 0.15,
        col: Math.random() > 0.5 ? marsaiColors.primary : marsaiColors.accent,
      }))
    }

    const drawCornerFrame = (x: number, y: number, w: number, h: number, col: string, alpha: number) => {
      const s = 12
      ctx.strokeStyle = col
      ctx.globalAlpha = alpha
      ctx.lineWidth = 1

      ctx.beginPath()
      ctx.moveTo(x, y + s)
      ctx.lineTo(x, y)
      ctx.lineTo(x + s, y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x + w - s, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, y + s)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x, y + h - s)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x + s, y + h)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x + w - s, y + h)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x + w, y + h - s)
      ctx.stroke()

      for (let i = 0; i < 3; i++) {
        ctx.strokeRect(x - 8, y + 6 + i * 10, 5, 6)
        ctx.strokeRect(x + w + 3, y + 6 + i * 10, 5, 6)
      }

      ctx.globalAlpha = 1
    }

    let scanY = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      scanY = (scanY + 0.4) % H
      const sg = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60)
      sg.addColorStop(0, withAlpha(marsaiColors.primary, 0))
      sg.addColorStop(0.5, withAlpha(marsaiColors.primary, 0.04))
      sg.addColorStop(1, withAlpha(marsaiColors.primary, 0))
      ctx.fillStyle = sg
      ctx.fillRect(0, scanY - 60, W, 120)

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(125,113,251,${(1 - d / 110) * 0.15})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0) n.x = W
        if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H
        if (n.y > H) n.y = 0

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4)
        grd.addColorStop(0, `hsla(${n.hue},90%,70%,${n.alpha})`)
        grd.addColorStop(1, `hsla(${n.hue},90%,70%,0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${n.hue},90%,75%,${n.alpha + 0.3})`
        ctx.fill()
      }

      for (const f of frames) {
        f.y += f.speed
        if (f.y > H + 80) f.y = -80
        if (f.y < -80) f.y = H + 80
        drawCornerFrame(f.x - f.w / 2, f.y - f.h / 2, f.w, f.h, f.col, f.alpha)
      }

      raf = requestAnimationFrame(draw)
    }

    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const setReduced = () => {
      reduced = Boolean(mql?.matches)
      resize()
    }

    setReduced()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else draw()
    }
    document.addEventListener('visibilitychange', onVis)

    try {
      mql?.addEventListener?.('change', setReduced)
    } catch {
      void 0
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      try {
        mql?.removeEventListener?.('change', setReduced)
      } catch {
        void 0
      }
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}

export function MarsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0" style={{ background: marsaiColors.bg }} />
      <div className="absolute inset-0 opacity-90">
        <CinemaCanvas />
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, ${marsaiColors.bg} 100%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,113,251,1) 1px,transparent 1px),linear-gradient(90deg,rgba(125,113,251,1) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${withAlpha(marsaiColors.primary, 0.55)}, transparent)` }}
      />
    </div>
  )
}
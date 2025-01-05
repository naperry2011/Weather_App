'use client'

import { useEffect, useRef } from 'react'

const animations: Record<string, (ctx: CanvasRenderingContext2D) => void> = {
  'clear': (ctx) => {
    // Sun animation
    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
    ctx.fillStyle = '#FFD700'
    ctx.fill()
  },
  'rain': (ctx) => {
    // Rain animation
    ctx.fillStyle = '#4A90E2'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * ctx.canvas.width
      const y = Math.random() * ctx.canvas.height
      ctx.fillRect(x, y, 2, 10)
    }
  },
  // Add more weather animations as needed
}

interface WeatherAnimationProps {
  condition?: string
}

export default function WeatherAnimation({ condition = 'clear' }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const animate = animations[condition] || animations.clear
      animate(ctx)
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [condition])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      width={800}
      height={400}
    />
  )
} 
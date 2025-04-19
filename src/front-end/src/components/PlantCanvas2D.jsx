"use client"

import { useEffect, useRef } from "react"

const PlantCanvas2D = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      console.error("Could not get 2D context")
      return
    }

    // Definir tamanho do canvas
    const setCanvasSize = () => {
      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      drawPlant()
    }

    // Desenhar a planta
    const drawPlant = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Centralizar a planta
      const centerX = canvas.width / 2
      const baseY = canvas.height * 0.8

      // Desenhar vaso
      ctx.fillStyle = "#8B4513"
      ctx.beginPath()
      ctx.moveTo(centerX - 50, baseY)
      ctx.lineTo(centerX - 40, baseY - 60)
      ctx.lineTo(centerX + 40, baseY - 60)
      ctx.lineTo(centerX + 50, baseY)
      ctx.closePath()
      ctx.fill()

      // Desenhar terra
      ctx.fillStyle = "#3E2723"
      ctx.beginPath()
      ctx.ellipse(centerX, baseY - 60, 40, 15, 0, 0, Math.PI * 2)
      ctx.fill()

      // Desenhar caule
      ctx.strokeStyle = "#33691E"
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(centerX, baseY - 60)
      ctx.bezierCurveTo(centerX, baseY - 120, centerX - 10, baseY - 180, centerX, baseY - 240)
      ctx.stroke()

      // Desenhar folhas
      const drawLeaf = (startX, startY, controlX, controlY, endX, endY) => {
        ctx.fillStyle = "#4CAF50"
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.quadraticCurveTo(controlX, controlY, endX, endY)
        ctx.quadraticCurveTo(controlX + 5, controlY + 5, startX, startY)
        ctx.fill()
      }

      // Folha 1
      drawLeaf(centerX, baseY - 120, centerX + 60, baseY - 140, centerX + 80, baseY - 130)

      // Folha 2
      drawLeaf(centerX, baseY - 160, centerX - 70, baseY - 180, centerX - 90, baseY - 170)

      // Folha 3
      drawLeaf(centerX, baseY - 200, centerX + 50, baseY - 220, centerX + 70, baseY - 210)

      // Folha 4
      drawLeaf(centerX, baseY - 240, centerX - 40, baseY - 260, centerX - 60, baseY - 250)

      // Adicionar sombra
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.beginPath()
      ctx.ellipse(centerX, baseY, 50, 15, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Animação simples
    let angle = 0
    const animate = () => {
      angle += 0.01
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.save()
          ctx.translate(canvas.width / 2, canvas.height * 0.8 - 150)
          ctx.rotate(Math.sin(angle) * 0.03)
          ctx.translate(-canvas.width / 2, -(canvas.height * 0.8 - 150))
          drawPlant()
          ctx.restore()
        }
      }
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-gray-50">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
        2D Plant Illustration
      </div>
    </div>
  )
}

export default PlantCanvas2D

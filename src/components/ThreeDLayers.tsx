import React, { useEffect, useRef } from 'react'

let lastFrameTime = Date.now()
const frameInterval = 1000 / 60

const getRandomWarmColor = () => {
  const warmColors = [
    '#FF6347',
    '#FF4500',
    '#FF8C00',
    '#FFA500',
    '#FFD700',
    '#FF1493',
    '#FF69B4',
    '#FFB6C1',
  ]
  return warmColors[Math.floor(Math.random() * warmColors.length)]
}

interface ThreeDLayersProps {
  numLayers: number
  easingFactor?: number
  blurAmount?: number
  circleSize?: number
}

const ThreeDLayers: React.FC<ThreeDLayersProps> = ({ numLayers, easingFactor = 0.005, blurAmount = 1, circleSize = 1 }) => {
  const layersRef = useRef<HTMLDivElement[]>([])
  const targetX = useRef(0)
  const targetY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)
  const velocityX = useRef(0)
  const velocityY = useRef(0)
  const directionFactors = useRef<number[]>([])
  const animationFrameId = useRef<number | null>(null)

  const friction = 0.8

  useEffect(() => {
    directionFactors.current = Array.from({ length: numLayers }, () =>
      Math.random() < 0.5 ? 1 : -1
    )

    layersRef.current.forEach((layer) => {
      const circle = layer.querySelector('.circle') as HTMLDivElement
      if (circle) {
        const randomX = (Math.random() - 0.5) * 500
        const randomY = (Math.random() - 0.5) * 500
        circle.style.transform = `translate(${randomX}px, ${randomY}px)`
      }
    })
  }, [numLayers])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) - 0.5
      const mouseY = (event.clientY / window.innerHeight) - 0.5

      targetX.current = mouseX * 0.4
      targetY.current = mouseY * 0.4
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const animate = () => {
    const now = Date.now()
    if (now - lastFrameTime >= frameInterval) {
      lastFrameTime = now
      const accelerationFactor = easingFactor

      const accelerationX = (targetX.current - currentX.current) * accelerationFactor
      const accelerationY = (targetY.current - currentY.current) * accelerationFactor

      velocityX.current = velocityX.current * friction + accelerationX
      velocityY.current = velocityY.current * friction + accelerationY

      currentX.current += velocityX.current
      currentY.current += velocityY.current

      layersRef.current.forEach((layer, index) => {
        const depthMultiplier = 100
        const depth = -index * depthMultiplier + depthMultiplier * layersRef.current.length / 2
        const directionFactor = directionFactors.current[index]

        const moveX = currentX.current * depth * 2 * directionFactor
        const moveY = currentY.current * depth * 2 * directionFactor

        const rotateX = currentY.current * 90
        const rotateY = currentX.current * 90

        layer.style.transform = `translateZ(${depth}px) translate(${moveX}px, ${moveY}px) rotateY(${rotateX}deg) rotateZ(${rotateY}deg)`

        const _blurAmount = Math.abs(depth) / 50 * blurAmount
        layer.style.filter = `blur(${_blurAmount}px)`

        layer.style.zIndex = `${layersRef.current.length - index}`
      })
    }

    animationFrameId.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
    }
    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [easingFactor, blurAmount, circleSize])

  return (
    <div className="relative w-full h-full max-h-full max-w-full overflow-hidden flex justify-center items-center bg-gradient-to-r from-red-500/10"
      style={{ perspective: '1100px' }}>
      {Array.from({ length: numLayers }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) layersRef.current[index] = el
          }}
          className="absolute w-full h-full flex justify-center items-center transform-gpu"
          style={{willChange: 'transform'}}
        >
          <div
            className={`circle rounded-full border-4 bg-black`}
            style={{
              borderColor: getRandomWarmColor(),
              width: circleSize * 100 + 'px',
              height: circleSize * 100 + 'px',
              boxShadow: `0px 0px 20px ${getRandomWarmColor()}`,
            }}
          ></div>
        </div>
      ))}
    </div>
  )
}

export default ThreeDLayers

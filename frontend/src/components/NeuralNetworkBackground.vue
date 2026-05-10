<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationFrameId = null
let mouse = { x: null, y: null, radius: 150 }

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  let particlesArray = []

  const setCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  setCanvasSize()

  window.addEventListener('resize', setCanvasSize)

  const handleMouseMove = (event) => {
    mouse.x = event.x
    mouse.y = event.y
  }
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseout', () => {
    mouse.x = undefined
    mouse.y = undefined
  })

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x
      this.y = y
      this.directionX = directionX
      this.directionY = directionY
      this.size = size
      this.color = color
    }
    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
      ctx.fillStyle = isDark ? 'rgba(118, 185, 0, 0.5)' : 'rgba(74, 222, 128, 0.5)'
      ctx.fill()
    }
    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY
      }

      // Check collision
      let dx = mouse.x - this.x
      let dy = mouse.y - this.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 10
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 10
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 10
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 10
        }
      }
      
      this.x += this.directionX
      this.y += this.directionY
      this.draw()
    }
  }

  const init = () => {
    particlesArray = []
    let numberOfParticles = (canvas.height * canvas.width) / 14000
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 1
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2)
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2)
      let directionX = (Math.random() * 2) - 1
      let directionY = (Math.random() * 2) - 1
      let color = '#76b900'

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update()
    }
    connect()
  }

  const connect = () => {
    let opacityValue = 1
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                       ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y))
        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
          opacityValue = (1 - (distance / 20000)) * 0.35
          ctx.strokeStyle = isDark ? `rgba(118, 185, 0, ${opacityValue})` : `rgba(74, 222, 128, ${opacityValue})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
          ctx.stroke()
        }
      }
    }
  }

  init()
  animate()

  onUnmounted(() => {
    window.removeEventListener('resize', setCanvasSize)
    window.removeEventListener('mousemove', handleMouseMove)
    cancelAnimationFrame(animationFrameId)
  })
})
</script>

<template>
  <canvas ref="canvasRef" class="neural-network-bg"></canvas>
</template>

<style scoped>
.neural-network-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  opacity: 1;
}
</style>

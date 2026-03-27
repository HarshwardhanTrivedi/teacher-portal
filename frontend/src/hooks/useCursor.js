import { useEffect } from 'react'

export default function useCursor() {
  useEffect(() => {
    const dot  = document.getElementById('cursor-dot')
    const ring = document.getElementById('cursor-ring')
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'
      rafId = requestAnimationFrame(animate)
    }

    const onEnter = () => ring.classList.add('hovered')
    const onLeave = () => ring.classList.remove('hovered')

    document.addEventListener('mousemove', onMove)
    const interactives = document.querySelectorAll('a, button, input, select, textarea, [data-cursor]')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])
}

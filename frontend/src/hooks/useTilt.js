import { useRef, useCallback } from 'react'

export default function useTilt(strength = 8) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.transform = `perspective(600px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(4px)`
    el.style.transition = 'transform 0.1s ease'
  }, [strength])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
    el.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)'
  }, [])

  return { ref, onMouseMove: onMove, onMouseLeave: onLeave }
}

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimations(containerRef) {
  useEffect(() => {
    if (!containerRef?.current) return

    const ctx = gsap.context(() => {

      // ── Section numbers: rotate in from left
      gsap.utils.toArray('[data-anim="number"]').forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
          opacity: 0,
          x: -50,
          rotateY: -90,
          duration: 0.9,
          ease: 'expo.out',
        })
      })

      // ── Big headings: dramatic clip-path + 3D drop
      gsap.utils.toArray('[data-anim="heading"]').forEach(el => {
        gsap.fromTo(el,
          { y: 80, rotateX: -30, opacity: 0, filter: 'blur(4px)' },
          {
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
            y: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)',
            duration: 1.2,
            ease: 'expo.out',
            transformOrigin: '50% 0%',
          }
        )
      })

      // ── Staggered items — alternating left/right + depth
      gsap.utils.toArray('[data-anim="stagger-parent"]').forEach(parent => {
        const children = parent.querySelectorAll('[data-anim="stagger-child"]')
        gsap.fromTo(children,
          {
            opacity: 0,
            x: (i) => i % 2 === 0 ? -60 : 60,
            y: 40,
            rotateX: -18,
            filter: 'blur(3px)',
          },
          {
            scrollTrigger: { trigger: parent, start: 'top 82%' },
            opacity: 1,
            x: 0,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: { amount: 0.4, from: 'start' },
            ease: 'expo.out',
            transformOrigin: '50% 0%',
          }
        )
      })

      // ── Featured card: rises from depth with tilt
      gsap.utils.toArray('[data-anim="featured"]').forEach(el => {
        gsap.fromTo(el,
          { z: -180, y: 60, opacity: 0, scale: 0.9, rotateX: 8, filter: 'blur(6px)' },
          {
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
            z: 0, y: 0, opacity: 1, scale: 1, rotateX: 0, filter: 'blur(0px)',
            duration: 1.4,
            ease: 'expo.out',
          }
        )
      })

      // ── Quote: blur-unfold reveal
      gsap.utils.toArray('[data-anim="quote"]').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.94, filter: 'blur(12px)' },
          {
            scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none reverse' },
            opacity: 1, scale: 1, filter: 'blur(0px)',
            duration: 1.8,
            ease: 'power3.out',
          }
        )
      })

      // ── Parallax: elements with data-parallax="speed"
      gsap.utils.toArray('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2
        gsap.to(el, {
          scrollTrigger: {
            trigger: el.closest('section') || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          y: () => -window.innerHeight * speed,
          ease: 'none',
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [containerRef])
}

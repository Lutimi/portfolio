// Magic UI — NumberTicker (MIT, github.com/magicuidesign/magicui)
// Adapted: renders the final value on the server so the number is right
// without JavaScript; counts once, with a fixed-duration exponential ease-out
// instead of a spring (a spring's long tail shows "99+" on the way to 100);
// skips the count under prefers-reduced-motion.
import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  value: number
  startValue?: number
  delay?: number
  duration?: number
  decimalPlaces?: number
}

const format = (n: number, decimals: number) =>
  Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(
    Number(n.toFixed(decimals)),
  )

export function NumberTicker({
  value,
  startValue = 0,
  delay = 0,
  duration = 1.2,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (!isInView || reduceMotion || !ref.current) return
    const node = ref.current
    const controls = animate(startValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => (node.textContent = format(latest, decimalPlaces)),
      onComplete: () => (node.textContent = format(value, decimalPlaces)),
    })
    return () => controls.stop()
  }, [isInView, reduceMotion, startValue, value, duration, delay, decimalPlaces])

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)} {...props}>
      {format(value, decimalPlaces)}
    </span>
  )
}

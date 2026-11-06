import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Word({
  word,
  progress,
  start,
  end,
}: {
  word: string
  progress: MotionValue<number>
  start: number
  end: number
}) {
  const opacity = useTransform(progress, [start, end], [0.14, 1])
  return (
    <motion.span style={{ opacity }} aria-hidden="true">
      {word}
    </motion.span>
  )
}

interface Props {
  text: string
  className?: string
  style?: React.CSSProperties
}

export function ScrollReadText({ text, className, style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.5'],
  })

  const words = text.split(' ')

  if (REDUCED) {
    return (
      <p ref={ref} className={className} style={style}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = Math.min(1, (i + 2) / words.length)
        return (
          <span key={i}>
            <Word word={word} progress={scrollYProgress} start={start} end={end} />
            {i < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </p>
  )
}

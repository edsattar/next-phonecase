'use client'

import { useEffect, useRef, useState } from 'react'
import { AspectRatio } from './ui/aspect-ratio'
import { cn } from '@/lib/utils'
import { Configuration } from '@/db/schema'

const PhonePreview = ({
  croppedImageUrl,
  color,
}: {
  croppedImageUrl: string
  color: Configuration['color']
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [renderedDimensions, setRenderedDimensions] = useState({
    height: 0,
    width: 0,
  })

  const handleResize = () => {
    if (!ref.current) return
    const { width, height } = ref.current.getBoundingClientRect()
    setRenderedDimensions({ width, height })
  }

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  let caseBackgroundColor = 'bg-zinc-950'
  if (color === 'blue') caseBackgroundColor = 'bg-blue-950'
  if (color === 'rose') caseBackgroundColor = 'bg-rose-950'

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className='relative'>
      <div
        className='absolute scale-[1.0352]'
        style={{
          left:
            renderedDimensions.width / 2 -
            renderedDimensions.width / (1216 / 121),
          top: renderedDimensions.height / 6.22,
        }}>
        <img
          width={renderedDimensions.width / (3000 / 637)}
          className={cn(
            'phone-skew relative rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]',
            caseBackgroundColor
          )}
          src={croppedImageUrl}
          alt='crop preview'
        />
      </div>

      <div className='relative h-full w-full'>
        <img
          alt='phone'
          src='/clearphone.png'
          className='pointer-events-none h-full w-full antialiased rounded-md'
        />
      </div>
    </AspectRatio>
  )
}

export default PhonePreview

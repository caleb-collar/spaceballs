'use client'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/lib/confetti'
import { getCount, increment } from '@/lib/kv-client'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const getLoader = async () => {
  const { helix } = await import('ldrs')
  helix.register()
}

const HelixLoader = ({ theme }: { theme: 'light' | 'dark' }) => {
  const color = theme === 'dark' ? 'white' : 'black'
  console.log(color)
  return color ? <l-helix size="35" speed="1" color={color} /> : null
}

const Readout = ({
  count,
  loading,
}: {
  count: number | null
  loading: boolean
}) => {
  let { resolvedTheme } = useTheme() as { resolvedTheme: 'light' | 'dark' }
  if (!resolvedTheme) resolvedTheme = 'dark'
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div
        className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${
          loading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-500`}
      >
        <h2 className="text-xl font-bold tracking-tighter sm:text-2xl lg:text-3xl">
          {`References Made: ${count}`}
        </h2>
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${
          loading ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500`}
      >
        <div className="flex flex-row items-center space-x-2">
          <h2 className="text-xl font-bold tracking-tighter sm:text-2xl lg:text-3xl">
            {`References Made: `}
          </h2>
          <HelixLoader theme={resolvedTheme} />
        </div>
      </div>
    </div>
  )
}

const SPACEBALLS = () => {
  const MAX_POLLS = 7 //Max number of times to poll in a session
  const POLL_INTERVAL = 4000 //Poll interval in ms
  const LOADER_HYSTERESIS = 500 //Time to wait before hiding loader

  const [spaceballRefCount, setspaceballRefCount] = useState<number | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [pollCount, setPollCount] = useState(0)
  const confettiRef = useRef<Confetti | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    getLoader().then(() => {
      interval = setInterval(() => {
        if (pollCount >= MAX_POLLS) {
          clearInterval(interval)
        } else {
          getCount().then((count) => {
            setspaceballRefCount(count)
            confettiRef.current = new Confetti('+1-button')
            setTimeout(() => {
              setLoading(false)
            }, LOADER_HYSTERESIS)
          })
          setPollCount(pollCount + 1)
        }
      }, POLL_INTERVAL)
    })
    // Clear interval on component unmount
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [pollCount])

  useEffect(() => {
    if (spaceballRefCount) {
      console.log(`References Made: ${spaceballRefCount}`)
    }
  }, [spaceballRefCount])

  const handleIncrement = async () => {
    await increment()
    getCount().then((count) => {
      setspaceballRefCount(count)
      setPollCount(0)
    })
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
        <Image
          src="/spaceball.svg"
          alt="a spaceballs helmet"
          className="dark:invert"
          width={42}
          height={42}
          priority
        />
        <DarkModeToggle />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen pt-16 py-6 space-y-2 text-center">
        <div className="space-y-10">
          <Readout count={spaceballRefCount} loading={loading} />
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-6xl">
            Did you make a spaceballs reference?
          </h1>
          <div className="flex justify-center">
            <div className="space-y-5">
              <p className="mx-auto max-w-[400px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Click the button 👇
              </p>
              <Button
                variant="outline"
                className="text-base scale-125"
                onClick={handleIncrement}
                id="+1-button"
              >
                +1
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SPACEBALLS

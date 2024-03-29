'use client'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { Button } from '@/components/ui/button'
import { getCount, increment } from '@/lib/kv-client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function SPACEBALLS() {
  const [spaceballRefCount, setspaceballRefCount] = useState(0)

  useEffect(() => {
    getCount().then((count) => {
      setspaceballRefCount(count)
    })
  }, [])

  useEffect(() => {
    console.log(spaceballRefCount)
  }, [spaceballRefCount])

  const handleIncrement = async () => {
    await increment()
    getCount().then((count) => {
      setspaceballRefCount(count)
    })
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 z-50">
        <Image
          src="/spaceball.svg"
          alt="a spaceball helmet"
          className="dark:invert"
          width={42}
          height={42}
          priority
        />
        <DarkModeToggle />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen pt-16 py-6 space-y-2 text-center">
        <div className="space-y-10">
          <h2 className="text-xl font-bold tracking-tighter sm:text-2xl lg:text-3xl">
            {`References Made: ${spaceballRefCount}`}
          </h2>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-6xl">
            Did you make a spaceball reference?
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

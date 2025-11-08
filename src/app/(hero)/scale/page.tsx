import Hero from '@/src/components/hero'
import React from 'react'
import homeSrc from '@/public/4.png'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scale',
}

export default function page() {
  return (
    <div>
    <Hero imgUrl={homeSrc} altText='Scale' content='Welcome to our scale'/>
    </div>
  )
}

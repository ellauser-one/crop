import Hero from '@/src/components/hero'
import React from 'react'
import homeSrc from '@/public/3.png'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reliability',
}

export default function page() {
  return (
    <div>
    <Hero imgUrl={homeSrc} altText='Reliability' content='our reliability'/>
    </div>
  )
}

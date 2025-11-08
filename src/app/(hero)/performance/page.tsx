import Hero from '@/src/components/hero'
import homeSrc from '@/public/2.png'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Performance',
}

export default function page() {
  return (
    <div>
    <Hero imgUrl={homeSrc} altText='Performance' content='Welcome to performance'/>
    </div>
  )
}

// 'use client'
import Image from 'next/image'
import React from 'react'
import homeSrc from '@/public/1.png'
import Hero from '../../components/hero'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

export default function page() {
  return (
    <Hero imgUrl={homeSrc} altText='Home' content='Welcome to our website' />
  )
}

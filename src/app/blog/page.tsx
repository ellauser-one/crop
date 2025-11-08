
import BlogList from '@/src/components/blogList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '博客列表',
}

export default function page() {
    return (
      <BlogList/>
    )
}

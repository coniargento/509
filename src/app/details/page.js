import React from 'react'
import PageDetails from '@/app/components/PageDetails'
import { Suspense } from 'react'

export default function page() {
  return (
    <div><Suspense><PageDetails/></Suspense></div>
  )
}


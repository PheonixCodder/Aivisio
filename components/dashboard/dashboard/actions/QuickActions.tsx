import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/lib/routes'
import { CreditCardIcon, PlusIcon, Wand2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const QuickActions = () => {
  return (
    <Card>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>Quick Actions</CardTitle>
          <CardDescription>Get started with a few quick actions</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Button asChild className='w-full'>
            <Link href={ROUTES.IMAGE_GENERATION}>
            <Wand2Icon className='mr-2 h-4 w-4' />
            Generate Image
            </Link>
        </Button>
        <Button asChild className='w-full'>
            <Link href={ROUTES.MODEL_TRAINING}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Train AI Model
            </Link>
        </Button>
        <Button asChild className='w-full'>
            <Link href={ROUTES.BILLING}>
            <CreditCardIcon className='mr-2 h-4 w-4' />
            Generate Image
            </Link>
        </Button>
      </CardContent>
      </Card>
  )
}

export default QuickActions

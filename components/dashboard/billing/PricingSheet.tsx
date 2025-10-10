import React from 'react'
import { PlanSummaryProps } from './PlanSummary'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import Pricing from '@/components/dashboard/billing/Pricing'

const PricingSheet = ({ user, products, subscription }: PlanSummaryProps) => {
  return (
    <Sheet>
  <SheetTrigger asChild>
    <Button>Upgrade</Button>
  </SheetTrigger>
  <SheetContent className='max-w-full sm:max-w-[90vw] lg:max-w-[70vw] text-left w-full'>
    <SheetHeader>
      <SheetTitle>Change Subscription Plan</SheetTitle>
      <SheetDescription>
        Choose the plan that fits your needs and budget to continue using our services
      </SheetDescription>
    </SheetHeader>
    <Pricing user={user} subscription={subscription} MostPopular='pro' products={products} />
  </SheetContent>
</Sheet>
  )
}

export default PricingSheet

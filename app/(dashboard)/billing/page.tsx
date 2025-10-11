import { getCredits } from '@/actions/credit.actions';
import PlanSummary from '@/components/dashboard/billing/PlanSummary';
import Pricing from '@/components/dashboard/billing/Pricing';
import { getProducts, getSubscription, getUser } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server';
import React from 'react'

const Page = async () => {
    const supabase = await createClient();    
  
  const [user, products, subscription, { data: credits}] = await Promise.all([
      getUser(supabase),
      getProducts(supabase),
      getSubscription(supabase),
      getCredits()
    ])
    
    
  return (
    <section className='container mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Plans & Billing</h1>
        <p className='text-muted-foreground'>
          Manage your subscription plan and billing details
        </p>
      </div>
      <div className='grid gap-10'>
        <PlanSummary credits={credits!} subscription={subscription} user={user} products={products!}  />
        {
          subscription.status === 'active' && (
            <Pricing subscription={subscription} showInterval={false} user={user} products={products!} activeProduct={subscription.prices.products.name.toLowerCase() || "pro"} />
          )
        }
      </div>
    </section>
  )
}

export default Page

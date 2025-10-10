import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tables } from '@/database.types';
import { User } from '@supabase/supabase-js';
import React from 'react'
import PricingSheet from './PricingSheet';

type Product = Tables<"products">;
type Price = Tables<"prices">;
type Subscription = Tables<"subscriptions">;

export interface ProductWithPrices extends Product {
  prices: Price[];
}

export interface PriceWithProduct extends Price {
  products: Product | null;
}

export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

export interface PlanSummaryProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[];
}


const PlanSummary = ( { subscription, user, products }: PlanSummaryProps) => {
    if (!subscription || !subscription.status === true) return (
        <Card className='max-w-5xl'>
            <CardContent className='px-5 py-4'>
                <h3 className='pb-4 text-base font-semibold flex flex-wrap items-center gap-x-2'><span>Plan Summary</span><Badge variant={"secondary"} className='bg-primary/10'>No Plan</Badge></h3>
                <div className='grid grid-cols-8 gap-4'>
                    <div className='col-span-5 flex flex-col pr-12'>
                        <div className='flex-1 text-sm font-normal flex w-full justify-between pb-1'>
                            <span className='font-normal text-muted-foreground ml-1'>Image Generation Credits left</span>
                            <span className='font-medium'>0 Remaining</span>
                        </div>
                        <div className='mb-1 flex items-end'>
                            <Progress value={0} className='w-full h-2 mt-4' />
                        </div>
                    </div>
                    <div className='col-span-5 flex flex-col pr-12'>
                        <div className='flex-1 text-sm font-normal flex w-full justify-between pb-1'>
                            <span className='font-normal text-muted-foreground ml-1'>Model Training Credits left</span>
                            <span className='font-medium'>0 Remaining</span>
                        </div>
                        <div className='mb-1 flex items-end'>
                            <Progress value={0} className='w-full h-2 mt-4' />
                        </div>
                    </div>
                    <div className='col-span-full flex flex-col'>
                        Please upgrade your plan to continue using our services
                    </div>
                </div>
            </CardContent>
            <CardFooter className='border-t border-border px-4 py-3'>
                <span className='flex ml-auto flex-row'>
                    <PricingSheet user={user} products={products} subscription={subscription} />
                </span>
            </CardFooter>
        </Card>
    )
  return (
    <div>
      
    </div>
  )
}

export default PlanSummary

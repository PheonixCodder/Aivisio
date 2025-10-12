import { getCredits } from '@/actions/credit.actions';
import { getImages } from '@/actions/image.actions';
import { fetchModels } from '@/actions/models.actions';
import QuickActions from '@/components/dashboard/dashboard/actions/QuickActions';
import RecentModels from '@/components/dashboard/dashboard/actions/RecentModels';
import RecentImages from '@/components/dashboard/dashboard/cards/RecentImages';
import StatsCard from '@/components/dashboard/dashboard/cards/StatsCard';
import { createClient } from '@/lib/supabase/server';
import React from 'react'

const Dashboard = async () => {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();
  const {data: models, count: modelCount} = await fetchModels()
  const {data: credits} = await getCredits()
  const {data: images} = await getImages()

  const imageCount = images?.length || 0
  return (
    <section className='container mx-auto flex-1 space-y-6'>
      <div className="flex items-center justify-between">
        <h2 className='text-3xl font-bold tracking-tight'>Welcome back, {user?.user_metadata.name}</h2>
      </div>
      <StatsCard modelCount={modelCount} imageCount={imageCount} credits={credits!} />

      <div className='grid gap-6 grid-cols-4'>
        {/* TODO: recent images */}
        <RecentImages images={images?.slice(0, 6) || []} />
        <div className='h-4 flex flex-col space-y-6'>
        {/* TODO: quick actions */}
        <QuickActions />
        {/* TODO: recent models */}
        <RecentModels models={models?.slice(0, 6) || []} />
        </div>
      </div>
    </section>
  )
}

export default Dashboard

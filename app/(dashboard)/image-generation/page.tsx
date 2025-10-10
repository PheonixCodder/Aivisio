import { fetchModels } from '@/actions/models.actions'
import Configurations from '@/components/dashboard/image-generation/forms/Configurations'
import GeneratedImages from '@/components/dashboard/image-generation/output/GeneratedImages'
import { Tables } from '@/database.types'
import React from 'react'

interface searchParams {
  model_id?: string
}

// const userModels = [
//   {
//     id: 1,
//     created_at: new Date(),
//     user_id: "1",
//     model_id: "1",
//     model_name: "model1",
//     trigger_word: "trigger1",
//     version: "1",
//     training_status: "starting",
//     training_steps: 0,
//     training_time: "300",
//     gender: "man",
//   },
//   {
//     id: 2,
//     created_at: new Date(),
//     user_id: "1",
//     model_id: "2",
//     model_name: "model2",
//     trigger_word: "trigger2",
//     version: "1",
//     training_status: "completed",
//     training_steps: 0,
//     training_time: "600",
//     gender: "woman",
//   },
// ]

const ImageGeneration = async ({searchParams} : {searchParams: Promise<searchParams>}) => {
  const model_id = (await searchParams).model_id
  const { data: userModels } = await fetchModels()
  return (
    <section className='container mx-auto grid gap-4 grid-cols-3 overflow-hidden'>
      <Configurations userModels={userModels as Tables<"models">[] || []} model_id={model_id} />
      <div className='col-span-2 p-4 rounded-xl flex items-center justify-center h-fit'>
        <GeneratedImages  />
      </div>
    </section>
  )
}

export default ImageGeneration

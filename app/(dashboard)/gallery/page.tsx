import { getImages } from '@/actions/image.actions'
import GalleryComp from '@/components/dashboard/gallery/GalleryComp'
import React from 'react'

const Gallery = async () => {

  const {data: images} = await getImages()

  return (
    <section className='container mx-auto'>
      <h1 className='text-3xl font-semibold mb-2'>My Images</h1>
      <p className='text-muted-foreground mb-6'>Here you can see all the images you have generated. Click on image to view details.</p>
      <GalleryComp images={images} />
    </section>
  )
}

export default Gallery

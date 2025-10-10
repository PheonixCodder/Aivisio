"use client";

import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { Carousel, CarouselNext, CarouselPrevious, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import useGeneratedStore from '@/store/useGeneratedStore'

// const images = [
//     {
//         id: 1,
//         src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
//         alt: "Image 1"
//     },
//     {
//         id: 2,
//         src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
//         alt: "Image 2"
//     },
//     {
//         id: 3,
//         src: "/hero-images/Confident Woman in Red Outfit.jpeg",
//         alt: "Image 3"
//     },
//     {
//         id: 4,
//         src: "/hero-images/Confident Woman in Urban Setting.jpeg",
//         alt: "Image 4"
//     },
// ]
const GeneratedImages = () => {
    const {images, loading} = useGeneratedStore((state) => state);
    if (images.length === 0) {
        return (
            <Card className='w-full max-w-2xl bg-muted'>
                <CardContent className='flex aspect-square items-center justify-center p-6'>
                    <span className='text-lg'>No Images Generated</span>
                </CardContent>
            </Card>
        )
    }
    return (
        <Carousel
      className="w-full max-w-2xl"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className=" flex items-center relative justify-center rounded-lg aspect-square overflow-hidden">
{              // eslint-disable-next-line @next/next/no-img-element
}              <img src={image.url} alt={"image"} className='w-full h-full object-cover absolute inset-0' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    )
}

export default GeneratedImages

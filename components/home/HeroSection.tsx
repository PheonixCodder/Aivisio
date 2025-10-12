import { cn } from '@/lib/utils'
import React from 'react'
import { AnimatedGradientText } from '../ui/animated-gradient-text'
import { ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ROUTES } from '@/lib/routes';
import { Marquee } from '../ui/marquee';
import img1 from "@/public/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg";
import img2 from "@/public/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg";
import img3 from "@/public/hero-images/Confident Woman in Red Outfit.jpeg";
import img4 from "@/public/hero-images/Confident Woman in Urban Setting.jpeg";
import img5 from "@/public/hero-images/Futuristic Helmet Portrait.jpeg";
import img6 from "@/public/hero-images/Futuristic Woman in Armor.jpeg";
import img7 from "@/public/hero-images/Man in Brown Suit.jpeg";
import img8 from "@/public/hero-images/Poised Elegance of a Young Professional.jpeg";
import img9 from "@/public/hero-images/Professional Business Portrait.jpeg";
import img10 from "@/public/hero-images/Professional Woman in Navy Blue Suit.jpeg";
import img11 from "@/public/hero-images/Sophisticated Businessman Portrait.jpeg";
import Image from 'next/image';

const avatars = [
  {
    src: "/avatars/AutumnTechFocus.jpeg",
    fallback: "CN",
  },
  {
    src: "/avatars/Casual Creative Professional.jpeg",
    fallback: "AB",
  },
  {
    src: "/avatars/Golden Hour Contemplation.jpeg",
    fallback: "FG",
  },
  {
    src: "/avatars/Portrait of a Woman in Rust-Colored Top.jpeg",
    fallback: "PW",
  },
  {
    src: "/avatars/Radiant Comfort.jpeg",
    fallback: "RC",
  },
  {
    src: "/avatars/Relaxed Bearded Man with Tattoo at Cozy Cafe.jpeg",
    fallback: "RB",
  },
];

const Images = [
  {
    src: img1,
    alt: "AI generated image",
  },
  {
    src: img2,
    alt: "AI generated image",
  },
  {
    src: img3,
    alt: "AI generated image",
  },
  {
    src: img4,
    alt: "AI generated image",
  },
  {
    src: img5,
    alt: "AI generated image",
  },
  {
    src: img6,
    alt: "AI generated image",
  },
  {
    src: img7,
    alt: "AI generated image",
  },
  {
    src: img8,
    alt: "AI generated image",
  },
  {
    src: img9,
    alt: "AI generated image",
  },
  {
    src: img10,
    alt: "AI generated image",
  },
  {
    src: img11,
    alt: "AI generated image",
  },
];

const MarqueeComp = ({reverse, duration, className} : {reverse?: boolean, duration?: string, className?: string}) => {
    return (
        <>
        <Marquee vertical reverse={reverse} className={cn("w-full relative h-full flex flex-col justify-center items-center [--duration:120s]", className)} pauseOnHover>
            {Images.sort(() => Math.random() - 0.5).map((image, index) => {
                return <Image src={image.src} alt={image.alt} key={index} priority className='w-full h-full object-cover rounded opacity-[.25] hover:opacity-100 transition-opacity duration-300 ease-in-out' />
})}
      </Marquee>
      
      </>
    )
}

const HeroSection = () => {
  return (
    <section className='w-full relative overflow-hidden min-h-screen  flex flex-col items-center justify-center'>
      <div className='relative w-fit mx-auto flex flex-col items-center justify-center space-y-4 text-center z-40 backdrop-blur-[2px]'>
        <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      <span
        className={cn(
          "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText className="text-sm font-medium">
        Try new Flux models
      </AnimatedGradientText>
      <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </div>
    <h1 className='text-6xl font-extrabold tracking-tighter'>Transform Your Photos with the Power of AI</h1>
    <p className='mx-auto max-w-3xl text-xl mb-8 text-gray-600'>From LinkedIn headshots to Instagram influencer photos, Aivisio&apos;s state-of-the-art technology ensures you always look your best. Create, edit, and generate images effortlessly.</p>
    <div className='flex items-center space-x-2 mb-4'>
        <div className="flex items-center -space-x-4 overflow-hidden">
          {avatars.map((avatar) => (
            <Avatar key={avatar.src} className='inline-block border-2 border-background' >
                <AvatarImage className='h-full object-cover' src={avatar.src} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className='text-sm font-medium'>Loved by 1k+ users</span>
    </div>
    <Link href={`${ROUTES.LOGIN}?state=signup`}>
          <Button className="mt-4 w-full">✨ Create your first AI Model ✨</Button>
        </Link>
      </div>
      <div className='absolute top-0 w-full grid grid-cols-6 z-10'>
        <MarqueeComp reverse={false} duration="120s" />
        <MarqueeComp reverse={true} duration="120s" />
        <MarqueeComp reverse={false} duration="120s" />
        <MarqueeComp reverse={true} duration="120s" />
        <MarqueeComp reverse={true} duration="120s" />
        <MarqueeComp reverse={false} duration="120s" />
      </div>
    </section>
  )
}

export default HeroSection

"use client";
import Image from "next/image";
import React from "react";
import ImageDialog from "./ImageDialog";

const GalleryComp = ({ images }: GalleryProps) => {

    const [ selected, setSelected ] = React.useState<ImageProps | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        No Images Found
      </div>
    );
  }
  return(
    <div className="container mx-auto py-8">
        <div className="columns-4 gap-4 space-y-4">
            {images.map((image, index) => (
                <div key={index} className="relative group overflow-hidden cursor-pointer transition-transform" onClick={() => setSelected(image)}>
                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-70 rounded"><div className="flex items-center justify-center h-full"><p className="text-primary-foreground text-lg font-semibold">View Details</p></div></div>
                    <Image src={image.url!} alt={image.prompt!} width={image.width!} height={image.height!} className="object-cover rounded" />
                </div>
            ))}
        </div>
        {selected && (
            <ImageDialog image={selected} onClose={() => setSelected(null)} />
        )}
    </div>
    );
};

export default GalleryComp;

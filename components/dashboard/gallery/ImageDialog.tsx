"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Download } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import DeleteImage from "./DeleteImage";

const ImageDialog = ({
  image,
  onClose,
}: ImageProps & { onClose: () => void }) => {
  const [open, setOpen] = useState(!!image);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (image) setOpen(true);
  }, [image]);

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `generated-image-${Date.now()}.${image.output_format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    // trigger smooth exit
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      onClose();
      setIsClosing(false);
    }, 750); // match CSS animation duration
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        className={cn(
          "max-w-full sm:max-w-xl w-full transition-all duration-300 ease-in-out transform",
          isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        )}
      >
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl w-full my-5">Image Details</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex flex-col h-[100vh]">
          <div className="relative w-fit h-fit">
            <Image
              src={image.url}
              alt={image.prompt}
              width={image.width}
              height={image.height}
              className="w-full h-auto flex mb-3 rounded"
            />
            <div className="flex gap-4 absolute bottom-4 right-4">
              <Button className="w-fit" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <DeleteImage id={image.id.toString()} onDelete={onClose} imageName={image.image_name} />
            </div>
          </div>

          <Separator className="my-3" />

          <p className="text-primary/90 w-full flex flex-col">
            <span className="text-primary text-xl font-semibold">Prompt</span>
            {image.prompt}
          </p>

          <Separator className="my-3" />

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal max-w-[80%]">
              <span className="text-primary uppercase mr-2 font-semibold">Model ID:</span>
              {image.model.startsWith("pheonixcodder/") ? image.model.split("/")[1].split(":")[0] : image.model}
            </Badge>
            <Badge variant="secondary" className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
              <span className="text-primary uppercase mr-2 font-semibold">Aspect Ratio:</span>
              {image.aspect_ratio}
            </Badge>
            <Badge variant="secondary" className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
              <span className="text-primary uppercase mr-2 font-semibold">Dimensions:</span>
              {image.width}x{image.height}
            </Badge>
            <Badge variant="secondary" className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
              <span className="text-primary uppercase mr-2 font-semibold">Guidance:</span>
              {image.guidance}
            </Badge>
            <Badge variant="secondary" className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
              <span className="text-primary uppercase mr-2 font-semibold">Inference:</span>
              {image.num_inference_steps}
            </Badge>
            <Badge variant="secondary" className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
              <span className="text-primary uppercase mr-2 font-semibold">Output Format:</span>
              {image.output_format}
            </Badge>
            <Badge variant="secondary" className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
              <span className="text-primary uppercase mr-2 font-semibold">Created At:</span>
              {new Date(image.created_at).toLocaleDateString()}
            </Badge>
          </div>

          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ImageDialog;

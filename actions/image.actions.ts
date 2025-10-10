"use server";
import z from "zod";
import { ImageFormSchema } from "./../lib/validations";
import {Database} from "@/database.types";

import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";
import { imageMeta } from 'image-meta';
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

export type StoreImageInput = {
  url?: string;
} & Database["public"]["Tables"]["generated_images"]["Insert"];

export async function generateImageAction(
  input: z.infer<typeof ImageFormSchema>
): Promise<ImageResponse<string[]>> {

  if(!process.env.REPLICATE_API_TOKEN) return {
    error: "Replicate API token not found",
    success: false,
    data: null
  };

  const {
    prompt,
    guidance,
    num_outputs,
    aspect_ratio,
    output_format,
    output_quality,
    num_inference_steps,
    model,
  } = input;

  const modelInput = input.model.startsWith("pheonixcodder/") ? {
    model: "dev",
    prompt: prompt,
    lora_scale: 1,
    go_fast: true,
    guidance: guidance,
    megapixels: "1",
    num_outputs: num_outputs,
    aspect_ratio: aspect_ratio,
    output_format: output_format,
    output_quality: output_quality,
    prompt_strength: 0.8,
    num_inference_steps: num_inference_steps,
    extra_lora_scale : 0
  } : {
    prompt: prompt,
    go_fast: true,
    guidance: guidance,
    megapixels: "1",
    num_outputs: num_outputs,
    aspect_ratio: aspect_ratio,
    output_format: output_format,
    output_quality: output_quality,
    prompt_strength: 0.8,
    num_inference_steps: num_inference_steps,
  };

  try {
    const output = await replicate.run(model as ModelType, {
      input: modelInput,
    });

    return {
      error: null,
      success: true,
      data: output as string[],
    };
  } catch (e) {
    return {
      error: (e as Error).message || "Error generating image",
      success: true,
      data: null,
    };
  }
}

export async function imgUrlToBlob(url: string){
    const response = fetch(url);
    const blob = (await response).blob();
    return (await blob).arrayBuffer()
}

export async function storeImages(data: StoreImageInput){
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "User not found", success: false, data: null };
    
    const uploadResults = [];

    for(const img of data){
        const arrayBuffer = await imgUrlToBlob(img.url!);
        const { width, height, type } = imageMeta(new Uint8Array(arrayBuffer))

        const file_name = `image_${randomUUID()}.${type}`
        const file_path = `${user.id}/${file_name}`

        const { error: uploadError } = await supabase.storage.from("generated_images").upload(file_path, arrayBuffer, {
            contentType: `image/${type}`,
            cacheControl: "3600",
            upsert: false
        })

        if (uploadError) {
            uploadResults.push({
                error: uploadError.message,
                success: false,
                data: null
            })
            continue
        }

        const { data: dbData, error: dbError } = await supabase.from('generated_images').insert({
            user_id: user.id,
            model: img.model,
            prompt: img.prompt,
            guidance: img.guidance,
            num_inference_steps: img.num_inference_steps,
            output_format: img.output_format,
            width,
            height,
            aspect_ratio: img.aspect_ratio,
            image_name: file_name
        }).select()

        if (dbError) {
            uploadResults.push({
                file_name,
                error: dbError.message,
                success: !dbError,
                data: dbData || null
            })
            continue
        }

        return {
            file_name,
            error: null,
            success: true,
            data: {
                results: uploadResults
            }
        }
    }
}

export async function getImages(limit?: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "User not found", success: false, data: null };

  let query = supabase.from("generated_images").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) return { error: error.message || "Error getting images", success: false, data: null };

  const imageWithUrls = await Promise.all(
    data.map(async (image: Database["public"]["Tables"]["generated_images"]["Row"]) => {
      const { data } = await supabase.storage.from("generated_images").createSignedUrl(`${user.id}/${image.image_name}`, 3600)
      return { ...image, url: data?.signedUrl };
    })
  ).then((results) => results.filter(result => result !== null));

  return {
    error: null,
    success: true,
    data: imageWithUrls || null,
  }
}

export async function deleteImage(id: string, imageName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "User not found", success: false, data: null };

  const { data, error } = await supabase.from("generated_images").delete().eq("id", id);

  if (error) return { error: error.message, success: false, data: null };

  const { error: storageError } = await supabase.storage.from("generated_images").remove([`${user.id}/${imageName}`]);

  if (storageError) return { error: storageError.message, success: false, data: null };

              revalidatePath("/gallery");

  return {
    error: null,
    success: true,
    data,
  }
}

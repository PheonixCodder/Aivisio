import { generateImageAction, StoreImageInput, storeImages } from "@/actions/image.actions";
import { ImageFormSchema } from "@/lib/validations";
import { toast } from "sonner";
import z from "zod";
import { create } from "zustand";

const useGeneratedStore = create<GenerateState>((set) => ({
    loading: false,
    images: [],
    error: null,

    generateImage: async (input: z.infer<typeof ImageFormSchema>) => {
        set({loading: true, error: null});

        const toastId = toast.loading("Generating images...");
        console.log(1)
        try {
            const { error, success, data } = await generateImageAction(input);
            console.log(2)
            console.log(success)
            if (!success){
                set({loading: false, error: error});
            toast.success(error, {id: toastId});

                return
            }
            const dataWithUrl = data!.map(url => ({url: url as string, ...input}));

            set({images: dataWithUrl as { url: string; }[] | undefined, loading: false});

            toast.success("Images generated successfully", {id: toastId});
            
            await storeImages(dataWithUrl as StoreImageInput[])

            toast.success("Images stored successfully", {id: toastId});
        } catch (error) {
            set({loading: false, error: error as string});
            toast.error(error as string, {id: toastId});
        }
    }
}));

export default useGeneratedStore
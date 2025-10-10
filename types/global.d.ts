type AuthFormType = "login" | "reset" | "signup";

interface AuthResponse {
  error: string | undefined;
  success: boolean;
  data:
    | { user: User | null; session: Session | null }
    | { user: null; session: null };
}

interface ImageResponse<T> {
  error: string | null;
  success: boolean;
  data: T | null;
}

type ModelType = `${string}/${string}` | `${string}/${string}:${string}`;

interface GenerateState {
  loading: boolean;
  images: Array<{ url: string }>;
  error: string | null;
  generateImage: (input: z.infer<typeof ImageFormSchema>) => Promise<void>;
}

type ImageProps = {
    url: string | undefined
} & Tables<"generated_images">

type GalleryProps = {
  images: {url: string | undefined;
    aspect_ratio: string | null;
    created_at: string;
    guidance: number | null;
    height: number | null;
    id: number;
    image_name: string | null;
    model: string | null;
    num_inference_steps: number | null;
    output_format: string | null;
    prompt: string | null;
    user_id: string | null;
    width: number | null;
  }[]
}
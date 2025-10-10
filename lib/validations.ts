import { z } from "zod";

export const PasswordValidationRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/); // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character

export const LoginFormSchema = z.object({
    email : z.email({
        error : "Please enter a valid email address"
    }),
    password : z.string().min(8, {
        error : "Password must be at least 8 characters long"
    }),
});

export const SignupFormSchema = z.object({
    name : z.string().min(3, {
        error : "Name must be at least 3 characters long"
    }),
    email : z.email({
        message : "Please enter a valid email address"
    }),
    password : z.string({
        error: "Password is required"
    }).min(8, {
        error : "Password must be at least 8 characters long"
    }).regex(PasswordValidationRegex, {
        error : "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    }),
    confirmPassword : z.string().min(8, {
        error : "Password must be at least 8 characters long"
    }).regex(PasswordValidationRegex, {
        error : "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const ResetFormSchema = z.object({
    email : z.email({
        error : "Please enter a valid email address"
    }),
});

export const ImageFormSchema = z.object({
    model: z.string({
        error: "Model is required"
    }),
    prompt: z.string({
        error: "Prompt is required"
    }).min(1, {
        error: "Prompt is required"
    }),
    guidance: z.number({
        error: "Guidance scale is required"
    }),
    num_outputs: z.number({}).min(1,{
        error: "Number of outputs must be at least 1"
    }).max(4, {
        error: "Number of outputs must be at most 4"
    }),
    aspect_ratio: z.string({
        error: "Aspect ratio is required"
    }),
    output_format: z.string({
        error: "Output format is required"
    }),
    output_quality: z.number().min(1,{
        error: "Output quality must be at least 1"
    }).max(100, {
        error: "Output quality must be at most 100"
    }),
    num_inference_steps: z.number({}).min(1, {
        error: "Number of inference steps must be at least 1"
    }).max(50, {
        error: "Number of inference steps must be at most 50"
    }),
});

const ACCEPTED_ZIP_FILE = ["application/zip", "application/x-zip-compressed"];
const MAX_FILE_SIZE = 45 * 1024 * 1024; // 45MB

export const ModelTrainingFormSchema = z.object({
  modelName: z
    .string({
      error: "Model Name is required",
    })
    .min(1, "Model Name is required"),
  
  gender: z.enum(["man", "woman"], {
    error: "Gender is required",
  }),

  zipFile: z
    .instanceof(File, { message: "Please select a valid file" })
    .refine(
      (file) => ACCEPTED_ZIP_FILE.includes(file.type),
      "Only .zip files are allowed"
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 45MB"
    ),
});

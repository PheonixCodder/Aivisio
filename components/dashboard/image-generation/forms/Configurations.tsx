"use client";

import React, { useEffect, useMemo } from "react";
import { ImageFormSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { models as defaultModels } from "@/lib/utils";
import useGeneratedStore from "@/store/useGeneratedStore";
import { Tables } from "@/database.types";

interface ConfigurationProps {
  userModels: Tables<"models">[];
  model_id?: string;
}

const Configurations: React.FC<ConfigurationProps> = ({ userModels, model_id }) => {
  const generateImage = useGeneratedStore((state) => state.generateImage);

  // 🧩 Merge user models with default ones
  const combinedModels = useMemo(() => {
    const userModelOptions =
      userModels?.map((m) => ({
        name: `${m.model_name} (${m.gender || "custom"})`,
        value: `${m.model_id}:${m.version}`, // or `${m.id}` depending on your generation API
      })) || [];

    return [...defaultModels, ...userModelOptions];
  }, [userModels]);

  const form = useForm<z.infer<typeof ImageFormSchema>>({
    resolver: zodResolver(ImageFormSchema),
    defaultValues: {
      model: model_id ? `pheonixcodder/${model_id}` : combinedModels?.[0]?.value,
      prompt: "",
      guidance: 3.5,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "jpg",
      output_quality: 80,
      num_inference_steps: 28,
    },
  });

  // ✅ useEffect that adjusts inference steps based on selected model
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "model" && value.model) {
        const isSchnell = value.model === defaultModels?.[1]?.value;
        const minSteps = isSchnell ? 1 : 28;
        const maxSteps = isSchnell ? 4 : 50;
        const preferred = isSchnell ? 4 : 28;

        const current = form.getValues("num_inference_steps");
        if (current < minSteps || current > maxSteps) {
          form.setValue("num_inference_steps", preferred, { shouldDirty: true });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  async function onSubmit(inputData: z.infer<typeof ImageFormSchema>) {
    const newValues = {
      ...inputData,
      prompt: inputData.model.startsWith("pheonixcodder/") ? (()=>{
        const modelId = inputData.model.replace("pheonixcodder/", "").split(":")[0];
        const selectedModel = userModels?.find((m) => m.model_id === modelId);
        return `photo of a ${selectedModel?.trigger_word} ${selectedModel?.gender}` + inputData.prompt
      })() : inputData.prompt ,
    }
    await generateImage(newValues);
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="grid gap-6 p-4 bg-background rounded-lg border">
            <legend className="text-sm -ml-1 px-1 font-medium">Settings</legend>

            {/* 🧠 Updated Model Select */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Model{" "}
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Choose a default or custom trained model.
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <div className="px-2 py-1 text-xs text-muted-foreground">
                        Default Models
                      </div>
                      {defaultModels.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.name}
                        </SelectItem>
                      ))}
                      {userModels?.length > 0 && (
                        <>
                          <div className="px-2 py-1 text-xs text-muted-foreground border-t mt-2">
                            Your Trained Models
                          </div>
                          {userModels.map((m) => (
                            m.training_status === "completed" &&
                            <SelectItem
                              key={m.id}
                              value={`pheonixcodder/${m.model_id}:${m.version}`}
                            >
                              {m.model_name} ({m.gender || "custom"})
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aspect Ratio + Num Outputs */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Aspect Ratio{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Aspect ratio of the generated image.
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an Aspect Ratio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="9:16">9:16</SelectItem>
                        <SelectItem value="21:9">21:9</SelectItem>
                        <SelectItem value="9:21">9:21</SelectItem>
                        <SelectItem value="4:5">4:5</SelectItem>
                        <SelectItem value="5:4">5:4</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                        <SelectItem value="3:2">3:2</SelectItem>
                        <SelectItem value="2:3">2:3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Number of Outputs{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Number of outputs to generate (1–4).
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(Math.max(1, Math.min(4, Number(e.target.value || 1))))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guidance */}
            <FormField
              control={form.control}
              name="guidance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Guidance{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Prompt guidance of the generated image (1–10).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{Number(field.value).toFixed(1)}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={0.1}
                      value={[Number(field.value) || 3.5]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Inference Steps (animated) */}
            <FormField
              control={form.control}
              name="num_inference_steps"
              render={({ field }) => {
                const currentModel = form.watch("model");
                const isSchnell = currentModel === defaultModels?.[1]?.value;
                const minSteps = isSchnell ? 1 : 28;
                const maxSteps = isSchnell ? 4 : 50;
                const displayValue = Number(field.value) || minSteps;

                return (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentModel}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                    >
                      <FormItem>
                        <FormLabel className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            Number of Inference Steps{" "}
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Number of denoising steps. Recommended: {isSchnell ? "1–4 (schnell)" : "28–50 (dev)"}.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <span>{displayValue}</span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            min={minSteps}
                            max={maxSteps}
                            step={1}
                            value={[displayValue]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  </AnimatePresence>
                );
              }}
            />

            {/* Output Quality */}
            <FormField
              control={form.control}
              name="output_quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      Output Quality{" "}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Quality of the generated image (50–100).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={50}
                      max={100}
                      step={1}
                      value={[Number(field.value) || 80]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Output Format */}
            <FormField
              control={form.control}
              name="output_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Output Format{" "}
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Select the output format of the generated image.
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an Output Format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prompt */}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Prompt{" "}
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>The prompt to use to generate the image.</TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="font-medium w-full">
              Generate
            </Button>
          </fieldset>
        </form>
      </Form>
    </TooltipProvider>
  );
};

export default Configurations;

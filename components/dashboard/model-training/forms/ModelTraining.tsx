"use client";

import { ModelTrainingFormSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useId } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getPresignedStorageUrl } from "@/actions/models.actions";

const ModelTrainingForm = () => {
  const form = useForm<z.infer<typeof ModelTrainingFormSchema>>({
    resolver: zodResolver(ModelTrainingFormSchema),
    defaultValues: {
      modelName: "",
      gender: "man",
      zipFile: undefined,
    },
  });

  const toastId = useId();

  const onSubmit = async (values: z.infer<typeof ModelTrainingFormSchema>) => {
    toast.loading("Uploading zip file...", {
      id: toastId,
    });

    try {
      const data = await getPresignedStorageUrl(values.zipFile.name);

      const urlResponse = await fetch(data.signUrl, {
        method: "PUT",
        headers: {
          "Content-Type": values.zipFile.type,
        },
        body: values.zipFile,
      });

      if (!urlResponse.ok) {
        toast.error("Error uploading zip file", {
          id: toastId,
        });
        return;
      }

      const res = await urlResponse.json();

      toast.success("Zip file uploaded successfully", {
        id: toastId,
      });

      const formData = new FormData();
      formData.append("fileKey", res.Key);
      formData.append("modelName", values.modelName);
      formData.append("gender", values.gender);

      toast.loading("Initiating model training...", {
        id: toastId,
      });

      //Use the train Handler
      const response = await fetch("/api/train", {
        method: "POST",
        body: formData,
      });

      const results = await response.json();

      if (!response.ok || results.error) {
        toast.error("Failed to train the model", {
          id: toastId,
        });
        return;
      }

      toast.success(
        "Training started successfully! Please wait for the model to finish training",
        {
          id: toastId,
        }
      );

      if (data.error) {
        toast.error(data.error || "Error uploading zip file", {
          id: toastId,
        });
        return;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start Training";
      toast.error(errorMessage || "Error uploading zip file", {
        id: toastId,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-8"
      >
        <fieldset className="grid gap-6 bg-background border rounded-2xl shadow-md p-8 relative">
          {/* Model Name */}
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a model name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name your trained model will appear under.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col sm:flex-row gap-4 mt-2"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="man" />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="woman" />
                      <span>Female</span>
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Choose the gender the AI model represents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Zip File */}
          <FormField
            control={form.control}
            name="zipFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Training Data (ZIP File) |{" "}
                  <span className="text-destructive">
                    Read the requirements below
                  </span>
                </FormLabel>

                <div className="mb-4 rounded-lg border border-muted p-4 bg-card shadow-sm text-card-foreground">
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Provide 10, 12 or 15 images in total</li>
                    <li>Ideal breakdown for 12 images:</li>
                    <ul className="list-disc list-inside ml-4">
                      <li>6 face closeups</li>
                      <li>3/4 half body closeups (till stomach)</li>
                      <li>2/3 full body shots</li>
                    </ul>
                    <li>No accessories on face/head ideally</li>
                    <li>No other people in images</li>
                    <li>
                      Different expressions, clothing, backgrounds with good
                      lighting
                    </li>
                    <li>
                      Images to be in 1:1 resolution (1048x1048 or higher)
                    </li>
                    <li>
                      Use images of similar age group (ideally within past few
                      months)
                    </li>
                    <li>Provide only zip file (under 45MB size)</li>
                  </ul>
                </div>

                <FormControl>
                  <Input
                    type="file"
                    accept=".zip"
                    className="cursor-pointer"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>
                  Upload a .zip file containing your training images.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" className="font-medium px-6">
              Start Training
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};

export default ModelTrainingForm;

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_URL =
  process.env.SITE_URL || "https://6c5d302225fc.ngrok-free.app";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("Missing REPLICATE_API_TOKEN");
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized user",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const input = {
      fileKey: formData.get("fileKey") as string,
      modelName: formData.get("modelName") as string,
      gender: formData.get("gender") as string,
    };

    if (!input.fileKey || !input.modelName) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const fileName = input.fileKey.replace("training_data/", "");

    const { data: fileUrl } = await supabaseAdmin.storage
      .from("training_data")
      .createSignedUrl(fileName, 3600);

    if (!fileUrl?.signedUrl) {
      return NextResponse.json(
        {
          error: "File not found",
        },
        { status: 404 }
      );
    }

    const modelId = `${user.id}_${Date.now()}_${input.modelName
      .toLowerCase()
      .replaceAll(" ", "_")}`;

    // Create Model
    await replicate.models.create("pheonixcodder", modelId, {
      visibility: "private",
      hardware: "gpu-l40s",
    });

    replicate.trainings.create(
      "replicate",
      "fast-flux-trainer",
      "f463fbfc97389e10a2f443a8a84b6953b1058eafbf0c9af4d84457ff07cb04db",
      {
        // You need to create a model on Replicate that will be the destination for the trained version.
        destination: "pheonixcodder/aivisio",
        input: {
          input_images: "https://",
          trigger_word: "TOK",
          training_steps: 1000,
        },
      }
    );

    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "26dce37af90b9d997eeb970d92e47de3064d46c300504ae376c75bef6a9022d2",
      {
        // You need to create a model on Replicate that will be the destination for the trained version.
        destination: `pheonixcodder/${modelId}`,
        input: {
          steps: 1000,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "ohai",
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training?userId=${user.id}&modelName=${encodeURIComponent(input.modelName)}&fileName=${encodeURIComponent(fileName)}`,
        webhook_events_filter: ["completed"],
      }
    );
    //Add model values in the database

    await supabaseAdmin.from("models").insert({
      user_id: user.id,
      model_id: modelId,
      model_name: input.modelName,
      gender: input.gender,
      training_status: training.status,
      trigger_word: "ohai",
      training_steps: 1200,
      training_id: training.id,
    })
  } catch (error) {
    console.error("Training failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

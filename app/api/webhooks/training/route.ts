import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-templates/EmailTemplate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = new URL(req.url!);
    const userId = url.searchParams.get("user_id") ?? "";
    const modelName = url.searchParams.get("modelName") ?? "";
    const fileName = url.searchParams.get("fileName") ?? "";

    // To validate the webhook
    const id = req.headers.get("webhook-id") ?? "";
    const timeStamp = req.headers.get("webhook-timestamp") ?? "";
    const webhookSignatures = req.headers.get("webhook-signature") ?? "";

    const signedContent = `${id}.${timeStamp}.${JSON.stringify(body)}`;

    const secret = await replicate.webhooks.default.secret.get();

    const secretBytes = Buffer.from(secret.key.split("_")[1], "base64");
    const signature = crypto
      .createHmac("sha256", secretBytes)
      .update(signedContent)
      .digest("base64");

    const expectedSignatures = webhookSignatures
      .split(" ")
      .map((sig) => sig.split(",")[1]);
    const isValid = expectedSignatures.some(
      (expectedSignature) => expectedSignature === signature
    );

    if (!isValid) return new NextResponse("Invalid signature", { status: 401 });

    //get user data
    const { data: user, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (!user || userError) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 401 }
      );
    }

    const email = user.user.email ?? "";
    const userName = user.user.user_metadata.name ?? "";

    if (body.status === "succeeded") {
      //Send a successful status email
      await resend.emails.send({
        from: "Aivisio <onboarding@resend.dev>",
        to: [email],
        subject: "Model training Completed",
        react: EmailTemplate({
          userName,
          message: "Your model has been trained successfully",
        }),
      });
      //Update the supabase models table
      await supabaseAdmin
        .from("models")
        .update({
          training_status: body.status,
          training_time: body.metrics.total_time ?? null,
          version: body.output.version.split(":")[1] ?? null,
        })
        .eq("user_id", userId)
        .eq("model_name", modelName);
    } else {
      await Promise.all([]);
      //Handle the failed and cancelled status
      //Send a successful status email
      await resend.emails.send({
        from: "Aivisio <onboarding@resend.dev>",
        to: [email],
        subject: `Model training ${body.status}`,
        react: EmailTemplate({
          userName,
          message: `Your model has been ${body.status}`,
        }),
      });

      //Delete the training data from the supabase storage
      await supabaseAdmin.storage
        .from("training_data")
        .remove([`${userId}/${fileName}`]);

      //Update the supabase models table
      await supabaseAdmin
        .from("models")
        .update({ training_status: body.status })
        .eq("user_id", userId)
        .eq("model_id", modelName);

        const { data: oldCredits, error } = await supabaseAdmin
    .from("credits")
    .select("model_training_count")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error("Error fetching user credits");
  }
  await supabaseAdmin
    .from("credits")
    .update({
      model_training_count: oldCredits.model_training_count! + 1,
    })
    .eq("user_id", userId)
    .single();


    }
    //Delete the training data from the supabase storage
    await supabaseAdmin.storage.from("training_data").remove([`${fileName}`]);

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/database.types";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import React, { useId } from "react";
import { formatDistance } from "date-fns";
import {
    ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
  User2,
  XCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteModel } from "@/actions/models.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ModelType = {
  error: string | null;
  success: boolean;
  data: Database["public"]["Tables"]["models"]["Row"][] | null;
};

interface ModelsListProps {
  models: ModelType;
}

// const dummyData = [
//   {
//     id: 1,
//     created_at: new Date(),
//     user_id: "1",
//     model_id: "1",
//     model_name: "model1",
//     trigger_word: "trigger1",
//     version: "1",
//     training_status: "starting",
//     training_steps: 0,
//     training_time: "300",
//     gender: "man",
//   },
//   {
//     id: 2,
//     created_at: new Date(),
//     user_id: "1",
//     model_id: "2",
//     model_name: "model2",
//     trigger_word: "trigger2",
//     version: "1",
//     training_status: "completed",
//     training_steps: 0,
//     training_time: "600",
//     gender: "woman",
//   },
// ];

const ModelsList = ({ models }: ModelsListProps) => {
  const { data, success, error } = models;
//   const data = dummyData;

  const toastId = useId();

  const handleDeleteModel = async (
    id: number,
    model_id: string,
    model_version: string
  ) => {
    toast.loading("Deleting model...", { id: toastId });
    const { success, error } = await deleteModel(id, model_id, model_version);

    if (error) toast.error(error, { id: toastId });
    if (success) toast.success("Model deleted successfully", { id: toastId });
  };

  if (!data || data.length === 0) {
    return (
      <Card className="flex h-[450px] flex-col items-center justify-center text-center border-dashed border-muted">
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl font-semibold">No Models Found</CardTitle>
          <CardDescription className="max-w-sm mx-auto text-muted-foreground">
            You don&apos;t have any trained models yet. Click below to start training.
          </CardDescription>
          <Link href={ROUTES.MODEL_TRAINING} className="inline-block pt-4">
            <Button className="w-fit">Create Model</Button>
          </Link>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((model) => (
        <Card
          key={model.id}
          className="group relative flex flex-col border border-border/50 shadow-sm hover:shadow-md transition-all"
        >
          {/* Header */}
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold capitalize">
                {model.model_name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Created{" "}
                {formatDistance(new Date(model.created_at), new Date(), {
                  addSuffix: true,
                })}
              </CardDescription>
            </div>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Model</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this model? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleDeleteModel(model.id, model.model_id || "", model.version || "")
                    }
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Training Duration</span>
                </div>
                <p className="mt-1 text-sm font-medium">
                  {model.training_time
                    ? `${Math.round(Number(model.training_time) / 60)} mins`
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User2 className="h-4 w-4" />
                  <span>Gender</span>
                </div>
                <p className="mt-1 text-sm font-medium capitalize">
                  {model.gender || "N/A"}
                </p>
              </div>
            </div>

            {/* Training Status */}
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
                  model.training_status === "completed"
                    ? "bg-green-100 text-green-700"
                    : model.training_status === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {model.training_status === "completed" ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : model.training_status === "failed" ? (
                  <XCircle className="h-3.5 w-3.5" />
                ) : (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <span className="capitalize">{model.training_status}</span>
              </span>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="p-6 pt-0">
            <Link
              href={
                model.training_status === "completed"
                  ? `/image-generation?model_id=${model.id}:${model.version}`
                  : "#"
              }
              className={cn(
                "inline-flex w-full group",
                model.training_status !== "completed" &&
                  "pointer-events-none opacity-50"
              )}
            >
              <Button disabled={model.training_status !== "completed"} className="w-full group-hover:bg-primary/90">Generate Images<ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ModelsList;

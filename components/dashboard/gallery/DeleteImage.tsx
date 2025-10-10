import React, { useId } from "react";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteImage } from "@/actions/image.actions";
import { cn } from "@/lib/utils";

const DeleteImage = ({ id, onDelete, className, imageName }: { id: string; onDelete?: () => void; className?: string; imageName: string }) => {

    const toastId = useId();

    const handleDelete = async () => {
        toast.loading("Deleting image...", {id: toastId});

        const { success, error } = await deleteImage(id, imageName);

        if (error){
            toast.error(error, {id: toastId})
        }else if (success){
            toast.success("Image deleted successfully", {id: toastId});
            onDelete?.();
        }else{
            toast.dismiss(toastId); 
        }
    } 

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={cn('w-fit', className)} variant="destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your Image.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteImage;

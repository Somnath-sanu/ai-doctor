import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { ArrowRightIcon, PlusIcon } from "lucide-react";

export const AddNewSession = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="cursor-pointer">
          <PlusIcon />
          Start a consultation
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription>
            Share any symptoms, recent changes, or context that will help the
            doctor understand your concern.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="consultation-notes">Consultation details</Label>
          <Textarea
            id="consultation-notes"
            placeholder="Describe your symptoms, duration, and any relevant history..."
            className="min-h-[140px] max-h-64"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer" variant={"default"}>
              Cancel
            </Button>
          </DialogClose>
          <Button className="cursor-pointer" variant={"outline"}>
            Next <ArrowRightIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

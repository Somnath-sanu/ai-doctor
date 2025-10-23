import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
          <DialogDescription asChild>
            <div>
              <h2>Add Symptons or any other Details</h2>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Textarea placeholder="Add Detail here..." className="h-[200px]" />

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

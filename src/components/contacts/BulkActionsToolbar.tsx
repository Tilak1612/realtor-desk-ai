import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { X, Trash2, Mail, Tag } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
}

const BulkActionsToolbar = ({
  selectedCount,
  onClearSelection,
  onBulkDelete,
}: BulkActionsToolbarProps) => {
  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-background text-foreground">
          {selectedCount} selected
        </Badge>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Tag className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
          <Button variant="secondary" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {selectedCount} contacts?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the selected
                  contacts from your database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onBulkDelete} className="bg-destructive">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={onClearSelection}>
        <X className="h-4 w-4 mr-2" />
        Clear Selection
      </Button>
    </div>
  );
};

export default BulkActionsToolbar;

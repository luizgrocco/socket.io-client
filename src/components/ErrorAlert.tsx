import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type ErrorAlertProps = {
  errors: string[];
  onClose: () => void;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ errors, onClose }) => {
  return (
    <AlertDialog open={errors.length > 0}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-700">Error</AlertDialogTitle>
          <AlertDialogDescription>
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center">
          <AlertDialogAction onClick={onClose}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ErrorAlert;

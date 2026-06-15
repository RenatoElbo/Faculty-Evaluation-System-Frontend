import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface ToastProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  variant,
  title,
  message,
  onClose,
  duration = 7000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-6 left-6 z-[9999] w-96 transition-all duration-300`}
    >
      <Alert
        severity={variant}
        onClose={onClose}
        sx={{
          boxShadow: 4,
          borderRadius: 2,
          color: "#fff",
          fontWeight: 500,

          ...(variant === "success" && {
            backgroundColor: "#166534",
          }),

          ...(variant === "error" && {
            backgroundColor: "#991b1b",
          }),

          ...(variant === "warning" && {
            backgroundColor: "#92400e",
          }),

          ...(variant === "info" && {
            backgroundColor: "#1e3a8a",
          }),

          "& .MuiAlert-icon": {
            color: "#fff",
          },

          "& .MuiAlert-action": {
            color: "#fff",
          },
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </div>
  );
};

export default Toast;
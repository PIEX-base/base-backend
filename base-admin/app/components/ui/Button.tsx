import type { JSX } from "react";

interface ButtonProps {
  text: string | JSX.Element;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
  type?: "button" | "submit" | "reset";
}

const buttonVariants = {
  primary:
    "text-black bg-primary hover:bg-primary/50 focus:ring-4 focus:ring-primary/70",
  secondary:
    "bg-secondary text-white hover:bg-secondary/50 focus:ring-4 focus:ring-secondary/70",
  danger:
    "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300",
  success:
    "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300",
};

const buttonSizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = ({
  text,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        cursor-pointer font-medium rounded-lg me-2 mb-2
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {text}
    </button>
  );
};

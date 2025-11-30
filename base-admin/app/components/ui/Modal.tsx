import { useEffect } from "react";
import type { ModalProps } from "~/interfaces/modal";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showFooter = true,
  primaryButtonText = "I accept",
  secondaryButtonText = "Decline",
  onPrimaryAction,
  onSecondaryAction,
  size = "md",
  backgroundColor = "bg-white dark:bg-gray-800",
  textColor = "text-gray-900 dark:text-white",
}: ModalProps) => {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    fullscreen: "w-full h-screen",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrimaryClick = () => {
    onPrimaryAction?.();
    onClose();
  };

  const handleSecondaryClick = () => {
    onSecondaryAction?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/80 "
      onClick={handleBackdropClick}>
      <div className={`relative p-4 w-full ${sizeClasses[size]}`}>
        {/* Modal content */}
        <div
          className={`${backgroundColor} relative rounded-lg shadow-sm flex flex-col ${
            size === "fullscreen" ? "h-full" : "max-h-[90vh]"
          }`}>
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 shrink-0">
            <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors">
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4 overflow-y-auto">{children}</div>

          {/* Modal footer */}
          {showFooter && (
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 shrink-0">
              <button
                type="button"
                onClick={handlePrimaryClick}
                className="cursor-pointer text-black bg-primary hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-primary/30 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                {primaryButtonText}
              </button>
              <button
                type="button"
                onClick={handleSecondaryClick}
                className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-100 transition-colors">
                {secondaryButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

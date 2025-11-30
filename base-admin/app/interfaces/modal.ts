export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  backgroundColor?: string;
  textColor?: string;
}

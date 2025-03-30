import { ReactNode } from "react";

export type ModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export type ModalHeaderType = {
  title: string;
};

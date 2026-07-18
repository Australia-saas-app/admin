"use client";

import React, { useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable Modal component for displaying overlay dialogs
 *
 * @example
 * // Basic usage
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Item">
 *   <form>...</form>
 * </Modal>
 *
 * @example
 * // With custom size and footer
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Confirm Action"
 *   size="sm"
 *   showCloseButton={false}
 * >
 *   <p>Are you sure?</p>
 * </Modal>
 *
 * @example
 * // Large modal with no close on overlay
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Edit Details"
 *   size="lg"
 *   closeOnOverlayClick={false}
 * >
 *   <YourFormComponent />
 * </Modal>
 */

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Size of the modal - default is 'md' */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Whether clicking overlay closes modal - default is true */
  closeOnOverlayClick?: boolean;
  /** Whether to show close button - default is true */
  showCloseButton?: boolean;
  /** Additional CSS classes for modal content */
  className?: string;
  /** Additional CSS classes for modal container */
  containerClassName?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full mx-4",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = "",
  containerClassName = "",
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-card border border-border rounded-lg md:w-1/3 shadow-lg w-full ${sizeClasses[size]} ${containerClassName}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 ${className}`}>
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex justify-between items-center mb-6">
                  {title && <h2 className="text-xl font-bold">{title}</h2>}
                  {/* {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-gray-200 cursor-pointer rounded-full transition-colors ml-auto"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )} */}
                </div>
              )}

              {/* Content */}
              <div>{children}</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

"use client"

import { useEffect, useCallback, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

type ModalVariant = "default" | "success" | "danger" | "warning"
type ModalSize = "sm" | "md" | "lg" | "xl" | "full"

interface CyberModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  variant?: ModalVariant
  size?: ModalSize
  showCloseButton?: boolean
  closeOnEscape?: boolean
  closeOnOverlay?: boolean
  footer?: ReactNode
  hideHeader?: boolean
}

const variantStyles: Record<ModalVariant, { border: string; glow: string; text: string; bg: string }> = {
  default: {
    border: "#00ffff",
    glow: "0 0 20px rgba(0,255,255,0.5), inset 0 0 30px rgba(0,255,255,0.1)",
    text: "#00ffff",
    bg: "rgba(0,255,255,0.05)",
  },
  success: {
    border: "#00ff00",
    glow: "0 0 20px rgba(0,255,0,0.5), inset 0 0 30px rgba(0,255,0,0.1)",
    text: "#00ff00",
    bg: "rgba(0,255,0,0.05)",
  },
  danger: {
    border: "#ff0000",
    glow: "0 0 20px rgba(255,0,0,0.5), inset 0 0 30px rgba(255,0,0,0.1)",
    text: "#ff0000",
    bg: "rgba(255,0,0,0.05)",
  },
  warning: {
    border: "#ffcc00",
    glow: "0 0 20px rgba(255,204,0,0.5), inset 0 0 30px rgba(255,204,0,0.1)",
    text: "#ffcc00",
    bg: "rgba(255,204,0,0.05)",
  },
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
}

export function CyberModal({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
  size = "md",
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlay = true,
  footer,
  hideHeader = false,
}: CyberModalProps) {
  const styles = variantStyles[variant]

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape && isOpen) {
        onClose()
      }
    },
    [closeOnEscape, isOpen, onClose],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [handleEscape])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlay ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Scanline effect overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-[101]"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
            }}
          />

          {/* Modal container */}
          <motion.div
            className={`relative z-[102] w-full ${sizeStyles[size]}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "cyber-modal-title" : undefined}
          >
            {/* Corner decorations */}
            <div
              className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2"
              style={{ borderColor: styles.border }}
            />
            <div
              className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2"
              style={{ borderColor: styles.border }}
            />
            <div
              className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2"
              style={{ borderColor: styles.border }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2"
              style={{ borderColor: styles.border }}
            />

            {/* Main modal content */}
            <div
              className="bg-black/95 overflow-hidden"
              style={{
                border: `2px solid ${styles.border}`,
                boxShadow: styles.glow,
              }}
            >
              {/* Header */}
              {!hideHeader && (
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: styles.bg,
                    borderBottom: `1px solid ${styles.border}`,
                  }}
                >
                  {title && (
                    <h2
                      id="cyber-modal-title"
                      className="font-mono text-sm uppercase tracking-wider"
                      style={{
                        color: styles.text,
                        textShadow: `0 0 10px ${styles.text}`,
                      }}
                    >
                      {title}
                    </h2>
                  )}

                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 rounded"
                      style={{
                        color: styles.text,
                        borderColor: styles.border,
                      }}
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-4" style={{ background: styles.bg }}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div
                  className="px-4 py-3 flex justify-end gap-3"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    borderTop: `1px solid ${styles.border}`,
                  }}
                >
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Reusable button for modal actions
interface CyberButtonProps {
  onClick?: () => void
  children: ReactNode
  variant?: ModalVariant
  disabled?: boolean
  type?: "button" | "submit"
}

export function CyberButton({
  onClick,
  children,
  variant = "default",
  disabled = false,
  type = "button",
}: CyberButtonProps) {
  const styles = variantStyles[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 focus:outline-none focus:ring-2"
      style={{
        background: disabled ? "transparent" : styles.bg,
        border: `2px solid ${disabled ? "#333" : styles.border}`,
        color: disabled ? "#666" : styles.text,
        textShadow: disabled ? "none" : `0 0 10px ${styles.text}`,
        boxShadow: disabled ? "none" : `0 0 10px ${styles.border}40`,
      }}
    >
      {children}
    </button>
  )
}

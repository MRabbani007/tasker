"use client";
import {
  ReactNode,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  children?: ReactNode;
  isOpen: boolean;
  setShowForm?: Dispatch<SetStateAction<AdminFormType | UserFormType>>;
  onReset: () => void;
  onSubmit: (event: React.SubmitEvent) => void;
  loading?: boolean;
  type?: "add" | "edit";
  submitButton?: string;
  cancelButton?: string;
  disabled?: boolean;
  cornerButton?: ReactNode;
  deleteButton?: boolean;
  onDelete?: () => void;
  maxW?: "max-w-3xl" | "max-w-5xl" | "max-w-7xl";
  overflow?: "scroll" | "none";
}

export default function ModalForm({
  title,
  children,
  isOpen,
  setShowForm,
  onReset,
  onSubmit,
  loading = false,
  type = "add",
  submitButton,
  cancelButton = "Cancel",
  disabled = false,
  deleteButton,
  onDelete,
  maxW = "max-w-3xl",
}: Props) {
  // Custom scroll lock logic is good, but for production consider 'overflow-hidden' on html/body
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => setShowForm?.(""), [setShowForm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <form
              onSubmit={onSubmit}
              onReset={onReset}
              className={cn(
                "bg-white w-full shadow-2xl rounded-3xl relative pointer-events-auto flex flex-col overflow-hidden",
                maxW,
              )}
            >
              {/* Refined Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-slate-900">
                    {title || (type === "add" ? "New Entry" : "Edit Details")}
                  </h2>
                  <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
                    {type === "edit"
                      ? "Modifying existing record"
                      : "Creation Mode"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center gap-3">
                {deleteButton && (
                  <button
                    onClick={onDelete}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                )}

                <div className="flex-1" />

                <button
                  type="reset"
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {cancelButton}
                </button>

                <button
                  type="submit"
                  disabled={disabled || loading}
                  className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  {submitButton || (type === "add" ? "Create" : "Save Changes")}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

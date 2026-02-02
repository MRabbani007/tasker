"use client";
import {
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
  FormEvent,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  children?: ReactNode;
  isOpen: boolean;
  setShowForm?: Dispatch<SetStateAction<AdminFormType | UserFormType>>;
  onReset: () => void;
  onSubmit: (event: FormEvent) => void;
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
  cornerButton,
  deleteButton,
  onDelete,
  maxW = "max-w-7xl",
  overflow = "scroll",
}: Props) {
  // 🧩 Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

      return () => {
        // Restore scroll position
        document.body.style.overflow = "unset";
        const y = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(y || "0") * -1);
      };
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowForm?.("");
  }, [setShowForm]);

  // 🧩 Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Form Container */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <form
                onSubmit={onSubmit}
                onReset={onReset}
                className={cn(
                  "m-4 md:m-8 lg:m-10 flex flex-col gap-4 bg-white w-full max-w-7xl mx-auto rounded-2xl shadow-xl relative ",
                  maxW,
                )}
              >
                {/* Header */}
                <div className="flex items-center bg-gray-900 text-white rounded-t-2xl py-4 px-4 lg:px-8">
                  {title && <h2 className="text-xl font-medium">{title}</h2>}

                  {/* Close Button */}

                  <button
                    type="submit"
                    className="ml-auto py-1 px-2 rounded-md cursor-pointer hover:bg-gray-700 hover:text-white text-gray-400 transition-all duration-200"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    type="reset"
                    className="py-1 px-2 rounded-md cursor-pointer hover:bg-gray-700 hover:text-white text-gray-400 transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Body */}
                <div
                  className={
                    overflow === "scroll"
                      ? "h-full max-h-[70vh] overflow-y-auto"
                      : ""
                  }
                >
                  <div
                    className={"flex flex-col gap-4 md:gap-6 px-4 md:px-8 py-4"}
                  >
                    {children}
                  </div>
                </div>

                {/* Form Buttons */}
                {/* <div className="flex items-center justify-center gap-4 py-2 px-6 flex-wrap font-semibold">
                  {deleteButton === true && (
                    <button
                      onClick={onDelete}
                      type="button"
                      className="py-2 px-4 bg-zinc-200 hover:bg-zinc-100 rounded-md cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                  {cornerButton ?? null}
                  <button
                    type="reset"
                    className="ml-auto py-2 px-4 md:min-w-37.5 text-slate-800 font-semibold border-slate-800 borde rounded-lg shadow-sm shadow-zinc-300 hover:shadow-sm hover:shadow-zinc-500 transition-all duration-200 cursor-pointer"
                  >
                    {cancelButton}
                  </button>
                  <button
                    type="submit"
                    disabled={disabled}
                    className="py-2 px-4 mr-auto md:min-w-37.5 bg-slate-800 text-white font-semibold rounded-lg border border-slate-800 shadow-sm shadow-zinc-300 hover:shadow-sm hover:shadow-zinc-700 transition-all duration-200 cursor-pointer"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitButton?.trim()
                      ? submitButton
                      : type === "add"
                        ? "Create"
                        : "Save"}
                  </button>
                </div> */}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

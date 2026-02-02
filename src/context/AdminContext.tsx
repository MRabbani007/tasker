"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type SelectItemType = "WORD" | "SENTENCE" | "TEXTBLOCK" | "LIST";

export type SelectedItem = {
  id: string;
  type: SelectItemType;
};

type AdminContextType = {
  showForm: AdminFormType;
  setShowForm: Dispatch<SetStateAction<AdminFormType>>;
  showFilters: string;
  setShowFilters: Dispatch<SetStateAction<string>>;
  contentDisplay: string;
  setContentDisplay: Dispatch<SetStateAction<string>>;
  editItem: AdminEditItem;
  setEditItem: Dispatch<SetStateAction<AdminEditItem>>;
  toggleSelect: (item: SelectedItem) => void;
  clearSelection: () => void;
  isSelected: (type: SelectItemType, id: string) => boolean;
  selectedItems: SelectedItem[];
};

export const AdminContext = createContext<AdminContextType | null>(null);

export default function AdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showForm, setShowForm] = useState<AdminFormType>("");
  const [showFilters, setShowFilters] = useState<string>("");

  const [contentDisplay, setContentDisplay] = useState("list");

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const [editItem, setEditItem] = useState<AdminEditItem>(null);

  const toggleSelect = (item: SelectedItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === item.id && i.type === item.type);

      return exists
        ? prev.filter((i) => !(i.id === item.id && i.type === item.type))
        : [...prev, item];
    });
  };

  const clearSelection = () => setSelectedItems([]);

  function isSelected(type: SelectItemType, id: string) {
    return selectedItems.some((i) => i.id === id && i.type === type);
  }

  return (
    <AdminContext.Provider
      value={{
        showForm,
        setShowForm,
        showFilters,
        setShowFilters,
        contentDisplay,
        setContentDisplay,
        editItem,
        setEditItem,
        selectedItems,
        toggleSelect,
        clearSelection,
        isSelected,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

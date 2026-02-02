"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type UserContextType = {
  showSearchModal: boolean;
  setShowSearchModal: Dispatch<SetStateAction<boolean>>;
  showForm: UserFormType;
  setShowForm: Dispatch<SetStateAction<UserFormType>>;
  editItem: UserEditItem;
  setEditItem: Dispatch<SetStateAction<UserEditItem>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showForm, setShowForm] = useState<UserFormType>("");
  const [editItem, setEditItem] = useState<UserEditItem>(null);

  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <UserContext.Provider
      value={{
        showForm,
        setShowForm,
        editItem,
        setEditItem,
        showSearchModal,
        setShowSearchModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}

"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Note } from "../../generated/prisma/client";

type UserContextType = {
  showSearchModal: boolean;
  setShowSearchModal: Dispatch<SetStateAction<boolean>>;
  showForm: UserFormType;
  setShowForm: Dispatch<SetStateAction<UserFormType>>;
  showUserLists: boolean;
  setShowUserLists: Dispatch<SetStateAction<boolean>>;
  openUserLists: boolean;
  setOpenUserLists: Dispatch<SetStateAction<boolean>>;
  editItem: UserEditItem;
  setEditItem: Dispatch<SetStateAction<UserEditItem>>;
  openNote: Note | null;
  setOpenNote: Dispatch<SetStateAction<Note | null>>;
  profile: ProfileDto | null;
  setProfile: Dispatch<SetStateAction<ProfileDto | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showForm, setShowForm] = useState<UserFormType>("");
  const [editItem, setEditItem] = useState<UserEditItem>(null);
  const [profile, setProfile] = useState<ProfileDto | null>(null);

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUserLists, setShowUserLists] = useState(false);
  const [openUserLists, setOpenUserLists] = useState(false);

  const [openNote, setOpenNote] = useState<Note | null>(null);

  return (
    <UserContext.Provider
      value={{
        showForm,
        setShowForm,
        editItem,
        setEditItem,
        showSearchModal,
        setShowSearchModal,
        showUserLists,
        setShowUserLists,
        openUserLists,
        setOpenUserLists,
        openNote,
        setOpenNote,
        profile,
        setProfile,
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

import { useEffect, useState } from "react";

const STORAGE_KEY = "task_form_visibility";

export type TaskFormVisibility = {
  title: boolean;
  details: boolean;
  notes: boolean;
  due: boolean;
  priority: boolean;
  color: boolean;
};

const DEFAULT_VISIBILITY: TaskFormVisibility = {
  title: false,
  details: false,
  notes: false,
  due: false,
  priority: true,
  color: true,
};

export function useTaskFormVisibility() {
  const [visibility, setVisibility] =
    useState<TaskFormVisibility>(DEFAULT_VISIBILITY);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setVisibility({ ...DEFAULT_VISIBILITY, ...JSON.parse(stored) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
  }, [visibility]);

  const toggle = (key: keyof TaskFormVisibility) => {
    setVisibility((v) => ({ ...v, [key]: !v[key] }));
  };

  const hideAll = () => {
    setVisibility(DEFAULT_VISIBILITY);
  };

  const showAll = () => {
    setVisibility({
      title: true,
      details: true,
      notes: true,
      due: true,
      priority: true,
      color: true,
    });
  };

  return { visibility, toggle, showAll, hideAll };
}

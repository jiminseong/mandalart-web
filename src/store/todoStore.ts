"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { TodoItem, Category, TodoStatus } from "@/app/[locale]/todo/types";

interface TodoState {
  items: TodoItem[];
  categories: Category[];

  // Actions
  addItem: (title: string, categoryId: string, time?: string) => void;
  toggleStatus: (id: string) => void;
  deleteItem: (id: string) => void;

  addCategory: (name: string, colorClass: string) => void;
  deleteCategory: (id: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "daily",
    name: "일상",
    colorClass: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200",
  },
  {
    id: "finance",
    name: "자산",
    colorClass: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
  },
  {
    id: "workout",
    name: "운동",
    colorClass: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
  },
];

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      items: [],
      categories: DEFAULT_CATEGORIES,

      addItem: (title, categoryId, time) =>
        set((state) => ({
          items: [
            ...state.items, // Add to bottom (Stack likes bottom-up, but for array visualization, adding to end is standard, we render reversed or bottom-up)
            {
              id: uuidv4(),
              title,
              categoryId,
              status: "todo",
              createdAt: new Date().toISOString(),
              time,
            },
          ],
        })),

      toggleStatus: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          const newStatus: TodoStatus = item.status === "todo" ? "done" : "todo";
          const completedAt = newStatus === "done" ? newStatus : undefined;

          // When 'done', move to end (top of Done stack). When 'todo', move to end (top of Todo stack).
          // Actually user said: "bottom-up stack".
          // "Check -> Fly to Right Stack".

          const otherItems = state.items.filter((i) => i.id !== id);
          const updatedItem = { ...item, status: newStatus, completedAt: new Date().toISOString() };

          return {
            items: [...otherItems, updatedItem], // Move to end (Top of stack)
          };
        }),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      addCategory: (name, colorClass) =>
        set((state) => ({
          categories: [...state.categories, { id: uuidv4(), name, colorClass }],
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    {
      name: "todo-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

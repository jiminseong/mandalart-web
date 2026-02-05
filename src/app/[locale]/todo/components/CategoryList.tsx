"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Category } from "../types";
import { createCategory, updateCategory, deleteCategory } from "../actions";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface CategoryListProps {
  categories: Category[];
  locale: string;
}

// Blue-themed palette (26 colors) - focusing on blue, sky, indigo, cyan, slate, teal, and harmonious accents
const CATEGORY_COLORS = [
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-400",
  "bg-sky-500",
  "bg-sky-600",
  "bg-indigo-500",
  "bg-indigo-600",
  "bg-cyan-500",
  "bg-cyan-600",
  "bg-teal-500",
  "bg-slate-500",
  "bg-slate-600",
  "bg-zinc-500",
  "bg-neutral-500",
  "bg-stone-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-green-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-indigo-300",
  "bg-sky-300",
];

export default function CategoryList({ categories, locale }: CategoryListProps) {
  const t = useTranslations("todo.categoryManager");
  const [isPending, startTransition] = useTransition();

  // Create State
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    startTransition(async () => {
      await createCategory(newName, newColor, locale);
      setNewName("");
      setNewColor(CATEGORY_COLORS[0]); // Reset to default
    });
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    startTransition(async () => {
      // Use editColor if set, otherwise keep existing (though logic implies it's always set on edit start)
      await updateCategory(id, editName, editColor, locale);
      setEditingId(null);
      setEditName("");
      setEditColor("");
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;

    startTransition(async () => {
      await deleteCategory(id, locale);
    });
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.colorClass);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditColor("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Add New Category Section */}
      <div className="mb-6 space-y-3 bg-white dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <form onSubmit={handleCreate} className="relative">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="w-full h-12 pl-4 pr-12 rounded-xl bg-gray-100 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500/20 text-[15px] placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!newName.trim() || isPending}
            className="absolute right-2 top-2 w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
          >
            <Plus size={18} />
          </button>
        </form>

        {/* Color Picker for New Category */}
        <div className="flex flex-wrap gap-2  justify-center pt-2">
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setNewColor(color)}
              className={cn(
                "w-5 h-5 rounded-full transition-all duration-200",
                color,
                newColor === color
                  ? "ring-2 ring-offset-2 ring-slate-400 scale-110 dark:ring-offset-gray-900"
                  : "hover:scale-105 opacity-70 hover:opacity-100",
              )}
            />
          ))}
        </div>
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-20 no-scrollbar">
        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">{t("empty")}</div>
        )}

        {categories.map((category) => (
          <div
            key={category.id}
            className="group flex flex-col p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {editingId === category.id ? (
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 h-9 px-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(category.id)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                {/* Color Picker for Edit */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100 dark:border-gray-800 mt-2">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditColor(color)}
                      className={cn(
                        "w-5 h-5 rounded-full transition-all duration-200",
                        color,
                        editColor === color
                          ? "ring-2 ring-offset-2 ring-slate-400 scale-110 dark:ring-offset-gray-900"
                          : "hover:scale-105 opacity-70 hover:opacity-100",
                      )}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn("w-3 h-3 rounded-full", category.colorClass || "bg-gray-400")}
                  />
                  <span className="font-medium text-[15px]">{category.name}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEditing(category)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

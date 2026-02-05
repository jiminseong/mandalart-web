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

export default function CategoryList({ categories, locale }: CategoryListProps) {
  const t = useTranslations("todo.categoryManager");
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    startTransition(async () => {
      await createCategory(newName, "bg-gray-100 text-gray-800", locale);
      setNewName("");
    });
  };

  const handleUpdate = async (id: string, currentClass: string) => {
    if (!editName.trim()) return;

    startTransition(async () => {
      await updateCategory(id, editName, currentClass, locale);
      setEditingId(null);
      setEditName("");
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
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Add New Category Input */}
      <form onSubmit={handleCreate} className="mb-6 relative">
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

      {/* Category List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-20 no-scrollbar">
        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">{t("empty")}</div>
        )}

        {categories.map((category) => (
          <div
            key={category.id}
            className="group flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {editingId === category.id ? (
              <div className="flex items-center gap-2 flex-1 animate-in fade-in zoom-in-95 duration-200">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 h-9 px-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleUpdate(category.id, category.colorClass)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", "bg-blue-500")} />{" "}
                  {/* Use colorClass if dynamic later */}
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

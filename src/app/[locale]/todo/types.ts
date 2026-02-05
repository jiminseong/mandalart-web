export type TodoStatus = "todo" | "done";

export interface Category {
  id: string;
  name: string;
  colorClass: string; // Tailwind utility classes for background and text
}

export interface TodoItem {
  id: string;
  title: string;
  categoryId: string; // Relates to Category.id
  status: TodoStatus;
  createdAt: string;
  completedAt?: string;
  time?: string; // e.g., "14:00"
}

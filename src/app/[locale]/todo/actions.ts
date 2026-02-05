"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { TodoStatus } from "./types";

// DB Types (Snake Case)
interface DBTodo {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  status: string;
  created_at: string;
  completed_at?: string;
  time?: string;
}

interface DBCategory {
  id: string;
  user_id: string;
  name: string;
  color_class: string;
  created_at: string;
}

export async function getTodosAndCategories(locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { todos: [], categories: [] };

  const [todosResult, categoriesResult] = await Promise.all([
    supabase.from("todos").select("*").order("created_at", { ascending: true }),
    supabase.from("todo_categories").select("*").order("created_at", { ascending: true }),
  ]);

  const todos = (todosResult.data || []).map((t: DBTodo) => ({
    id: t.id,
    title: t.title,
    categoryId: t.category_id,
    status: t.status as TodoStatus,
    createdAt: t.created_at,
    completedAt: t.completed_at,
    time: t.time,
  }));

  const categories = (categoriesResult.data || []).map((c: DBCategory) => ({
    id: c.id,
    name: c.name,
    colorClass: c.color_class,
  }));

  return { todos, categories };
}

export async function createCategory(name: string, colorClass: string, locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("todo_categories")
    .insert({
      user_id: user.id,
      name,
      color_class: colorClass,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/${locale}/todo`);
  revalidatePath(`/${locale}/todo/category`);

  return {
    id: data.id,
    name: data.name,
    colorClass: data.color_class,
  };
}

export async function updateCategory(id: string, name: string, colorClass: string, locale: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("todo_categories")
    .update({ name, color_class: colorClass })
    .eq("id", id);

  if (error) throw error;
  revalidatePath(`/${locale}/todo`);
  revalidatePath(`/${locale}/todo/category`);
}

export async function createTodo(
  title: string,
  categoryId: string,
  time: string | undefined,
  locale: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("todos")
    .insert({
      user_id: user.id,
      title,
      category_id: categoryId,
      status: "todo",
      time,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath(`/${locale}/todo`);

  return {
    id: data.id,
    title: data.title,
    categoryId: data.category_id,
    status: data.status as TodoStatus,
    createdAt: data.created_at,
    completedAt: data.completed_at,
    time: data.time,
  };
}

export async function toggleTodoStatus(id: string, currentStatus: TodoStatus, locale: string) {
  const supabase = await createClient();
  const newStatus = currentStatus === "todo" ? "done" : "todo";
  const completedAt = newStatus === "done" ? new Date().toISOString() : null;

  const { error } = await supabase
    .from("todos")
    .update({ status: newStatus, completed_at: completedAt })
    .eq("id", id);

  if (error) throw error;
  revalidatePath(`/${locale}/todo`);
}

export async function deleteTodo(id: string, locale: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw error;
  revalidatePath(`/${locale}/todo`);
}

export async function deleteCategory(id: string, locale: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("todo_categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath(`/${locale}/todo`);
  revalidatePath(`/${locale}/todo/category`);
}

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

export interface DBRoutine {
  id: string;
  user_id: string;
  title: string;
  category_id: string;
  frequency: "daily" | "weekly";
  days?: string[];
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

// ------ Routine Actions ------

export async function getRoutines(locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("routines")
    .select("*")
    .order("created_at", { ascending: true });

  return (data || []) as DBRoutine[];
}

export async function createRoutine(
  title: string,
  categoryId: string,
  frequency: "daily" | "weekly",
  days: string[] | null,
  locale: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("routines").insert({
    user_id: user.id,
    title,
    category_id: categoryId,
    frequency,
    days,
  });

  if (error) throw error;
  revalidatePath(`/${locale}/todo/routine`);
}

export async function deleteRoutine(id: string, locale: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("routines").delete().eq("id", id);
  if (error) throw error;
  revalidatePath(`/${locale}/todo/routine`);
}

export async function checkAndGenerateDailyTodos(locale: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Get All Routines
  const { data: routines } = await supabase.from("routines").select("*").eq("user_id", user.id);
  if (!routines || routines.length === 0) return;

  // 2. Define Today (KST)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kstGap = 9 * 60 * 60 * 1000;
  const todayKst = new Date(utc + kstGap);
  const todayDateString = todayKst.toISOString().split("T")[0]; // YYYY-MM-DD
  const todayDayName = todayKst.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...

  // 3. Filter Routines to run
  const routinesToRun = routines.filter((r: DBRoutine) => {
    if (r.frequency === "daily") return true;
    if (r.frequency === "weekly" && r.days?.includes(todayDayName)) return true;
    return false;
  });

  if (routinesToRun.length === 0) return;

  // 4. Check existing instances
  const routineIds = routinesToRun.map((r) => r.id);
  const { data: existingTodos } = await supabase
    .from("todos")
    .select("routine_id")
    .eq("user_id", user.id)
    .eq("routine_date", todayDateString)
    .in("routine_id", routineIds);

  const existingRoutineIds = new Set(existingTodos?.map((t) => t.routine_id));

  // 5. Insert new todos
  const newTodos = routinesToRun
    .filter((r) => !existingRoutineIds.has(r.id))
    .map((r) => ({
      user_id: user.id,
      title: r.title,
      category_id: r.category_id,
      status: "todo",
      routine_id: r.id,
      routine_date: todayDateString,
      // created_at will use default now()
    }));

  if (newTodos.length > 0) {
    await supabase.from("todos").insert(newTodos);
    revalidatePath(`/${locale}/todo`);
  }
}

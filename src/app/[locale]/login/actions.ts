"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect, routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  const localeFromForm = formData.get("locale") as string | null;
  const locale = localeFromForm || (await getLocale()) || routing.defaultLocale;
  redirect({ href: "/editor", locale });
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  const localeFromForm = formData.get("locale") as string | null;
  const locale = localeFromForm || (await getLocale()) || routing.defaultLocale;
  redirect({ href: "/editor", locale });
}

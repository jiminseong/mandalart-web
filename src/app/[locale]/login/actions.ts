"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect, routing } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";

function getKoreanErrorMessage(error: string) {
  if (error.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다. (혹은 이메일 인증이 완료되지 않았습니다.)";
  }
  if (error.includes("email rate limit exceeded")) {
    return "이메일 발송 한도를 초과했습니다. 잠시 후 시도하거나 수신함을 확인해주세요.";
  }
  if (error.includes("User already registered")) {
    return "이미 가입된 이메일입니다. 로그인해주세요.";
  }
  return "오류가 발생했습니다: " + error;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: getKoreanErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");

  const localeFromForm = formData.get("locale") as string | null;
  const nextFromForm = formData.get("next") as string | null;

  const locale = localeFromForm || (await getLocale()) || routing.defaultLocale;
  const destination = nextFromForm && nextFromForm.startsWith("/") ? nextFromForm : "/editor";

  redirect({ href: destination, locale });
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

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: getKoreanErrorMessage(error.message) };
  }

  if (signUpData.user && !signUpData.session) {
    return {
      success: false,
      message: "가입 확인 메일을 발송했습니다. 이메일을 확인해주세요.",
    };
  }

  revalidatePath("/", "layout");

  const localeFromForm = formData.get("locale") as string | null;
  const nextFromForm = formData.get("next") as string | null;

  const locale = localeFromForm || (await getLocale()) || routing.defaultLocale;
  const destination = nextFromForm && nextFromForm.startsWith("/") ? nextFromForm : "/editor";

  redirect({ href: destination, locale });
}

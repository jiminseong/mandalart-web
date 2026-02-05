"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthErrorHandler() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check once
    if (hasChecked) return;

    // Check for auth errors in hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const errorCode = params.get("error_code");
      const errorDescription = params.get("error_description");

      if (errorCode === "otp_expired") {
        setError("비밀번호 리셋 링크가 만료되었습니다. 새로운 링크를 요청해주세요.");

        // Clear the hash from URL
        window.history.replaceState(null, "", window.location.pathname);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/ko/login");
        }, 3000);
      } else if (errorCode) {
        setError(errorDescription || "인증 오류가 발생했습니다.");

        // Clear the hash from URL
        window.history.replaceState(null, "", window.location.pathname);

        setTimeout(() => {
          router.push("/ko/login");
        }, 3000);
      }
    }

    setHasChecked(true);
  }, [router, hasChecked]);

  if (!error) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="shrink-0 text-2xl">⚠️</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">인증 오류</h3>
            <p className="text-sm text-red-800 dark:text-red-200 wrap-break-word">{error}</p>
            <p className="text-xs text-red-600 dark:text-red-300 mt-2">
              로그인 페이지로 이동합니다...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

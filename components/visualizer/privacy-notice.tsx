"use client";

import { ShieldCheck } from "lucide-react";

interface PrivacyNoticeProps {
  mode: "local" | "server";
}

export function PrivacyNotice({ mode }: PrivacyNoticeProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-bg-light px-4 py-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
      <p className="text-sm leading-relaxed text-text-light">
        {mode === "local" ? (
          <>
            <strong className="font-semibold text-text-dark">
              100% processed on your device
            </strong>{" "}
            - your photo never leaves your browser unless you explicitly choose server
            processing on unsupported hardware.
          </>
        ) : (
          <>
            Server processing is active for segmentation only. Your composed preview is still
            rendered locally, and uploaded photos are deleted immediately after processing.
          </>
        )}
      </p>
    </div>
  );
}

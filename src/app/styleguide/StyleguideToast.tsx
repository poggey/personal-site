"use client";

import { Button } from "@/components/Button/Button";
import { showToast } from "@/components/Toast/toast";
import { Toaster } from "@/components/Toast/Toaster";

export function StyleguideToast({ label, message }: { label: string; message: string }) {
  return (
    <>
      <Button onClick={() => showToast(message)}>{label}</Button>
      <Toaster />
    </>
  );
}

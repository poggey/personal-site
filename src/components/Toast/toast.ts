// A page-wide toast without context providers: anything can announce, the Toaster listens.
export const TOAST_EVENT = "toast";

export function showToast(message: string): void {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

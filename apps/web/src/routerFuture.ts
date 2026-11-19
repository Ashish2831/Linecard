/** Opt into React Router v7 behavior early to silence migration warnings. */
export const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

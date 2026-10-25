import { ViewTransition } from "react";

/**
 * Page changes have weight: the old page steps back quickly and the new one
 * rises into place (styles in globals.css). A template, not the layout, so
 * each navigation mounts a new one and the enter/exit animations fire.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>
    <html>
      <body>
        {children}
      </body>
    </html>
  </>;
}

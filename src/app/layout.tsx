import type { Metadata } from "next";
import { FC, ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Monkey",
  description: "Realtime Chat Application",
};

interface Root {
  children: ReactNode;
}

const RootLayout: FC<Root> = ({ children }) => {
  return (
    <html lang="en">
      <body className={``}> {children} </body>
    </html>
  );
};

export default RootLayout;

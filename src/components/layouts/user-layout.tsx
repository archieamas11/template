"use client";
import type { ReactNode } from 'react';
import Component from '@/components/comp-585';

interface UserLayoutProps { children: ReactNode }

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Component />
      <main className="w-screen px-4 pb-8 pt-6 sm:px-8 border">{children}</main>
    </div>
  );
}

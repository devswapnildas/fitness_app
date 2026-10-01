'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Dumbbell, Apple, Sparkles, UserCheck } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/ai-coach', label: 'AI Coach', icon: Sparkles },
    { href: '/nutrition', label: 'Nutrition', icon: Apple },
    { href: '/progress', label: 'Progress', icon: UserCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#080c14]/95 border-t border-slate-800/80 backdrop-blur-lg px-2 py-1">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-all ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

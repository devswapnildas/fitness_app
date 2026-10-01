'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Dumbbell,
  BookOpen,
  Apple,
  TrendingUp,
  Sparkles,
  Camera,
  Trophy,
  Users,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Flame,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch {
      // ignore
    }
  };

  const handleDemoSwitch = async (role: string) => {
    setSwitchingRole(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        if (role === 'trainer') router.push('/trainer');
        else if (role === 'admin') router.push('/admin');
        else router.push('/dashboard');
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/exercises', label: 'Exercises', icon: BookOpen },
    { href: '/nutrition', label: 'Nutrition', icon: Apple },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
    { href: '/form-analysis', label: 'CV Form AI', icon: Camera, badge: 'Live CV' },
    { href: '/ai-coach', label: 'AI Coach', icon: Sparkles, badge: 'AI' },
    { href: '/habits', label: 'Habits', icon: CheckCircle2 },
    { href: '/challenges', label: 'Community', icon: Trophy },
  ];

  if (currentUser?.role === 'trainer' || currentUser?.role === 'admin') {
    navLinks.push({ href: '/trainer', label: 'Trainer Hub', icon: Users });
  }

  if (currentUser?.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  FitAI
                </span>
                <span className="text-[10px] -mt-1 uppercase tracking-wider text-cyan-400 font-semibold">
                  Intelligence Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold ml-1">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Demo Role Switcher & User Status */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
              <span className="text-slate-400 px-2 text-[11px] font-medium hidden lg:inline">
                Role:
              </span>
              <button
                onClick={() => handleDemoSwitch('user')}
                disabled={switchingRole}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentUser?.role === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                User (Alex)
              </button>
              <button
                onClick={() => handleDemoSwitch('trainer')}
                disabled={switchingRole}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentUser?.role === 'trainer'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Trainer (Marcus)
              </button>
              <button
                onClick={() => handleDemoSwitch('admin')}
                disabled={switchingRole}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-purple-500 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Profile Avatar / Quick Link */}
            {currentUser && (
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-cyan-400/40">
                    {currentUser.name ? currentUser.name.charAt(0) : 'A'}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center space-x-2 xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a0f1d] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {/* Role switcher inside mobile */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 mb-3">
            <p className="text-[11px] text-slate-400 font-semibold mb-2">Switch Active Persona:</p>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  handleDemoSwitch('user');
                  setMobileMenuOpen(false);
                }}
                className={`py-1 text-xs rounded text-center font-medium ${
                  currentUser?.role === 'user' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Alex (User)
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('trainer');
                  setMobileMenuOpen(false);
                }}
                className={`py-1 text-xs rounded text-center font-medium ${
                  currentUser?.role === 'trainer' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Marcus (Coach)
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-1 text-xs rounded text-center font-medium ${
                  currentUser?.role === 'admin' ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

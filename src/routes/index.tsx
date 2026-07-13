import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import {
  Sunrise, MoonStar, Dumbbell, ShowerHead, BookOpen, Laptop, Globe, Edit3, Moon, Droplet, Salad, Target, Utensils, Building, Coffee, Smartphone, Tv, Flame, Trophy, Ban, ShieldCheck, CheckCircle, Zap, Activity, BarChart2, CheckSquare, LineChart, Award, FileText, Calendar as CalendarIcon, Settings as SettingsIcon, Menu, LayoutDashboard, AlertTriangle, Check, Lock, Frown, Meh, Smile, Download, Upload, Trash2, Pencil,
  Sun, MonitorSmartphone
} from 'lucide-react';

const renderIcon = (iconStr: string, size = 16, className = "") => {
  const M: Record<string, any> = {
    '🌅': Sunrise, '🕌': MoonStar, '💪': Dumbbell, '🚿': ShowerHead, '📚': BookOpen,
    '💻': Laptop, '🌐': Globe, '✍️': Edit3, '😴': Moon, '💧': Droplet, '🥗': Salad,
    '🎯': Target, '🍳': Utensils, '🍱': Utensils, '🍽️': Utensils, '🏢': Building,
    '😌': Coffee, '📱': Smartphone, '📺': Tv, '🌙': Moon, '🔥': Flame, '🏆': Trophy,
    '🚫': Ban, '🛡️': ShieldCheck, '✅': CheckCircle, '⚡': Zap, '⚠️': AlertTriangle, '📊': BarChart2
  };
  const Icon = M[iconStr] || Activity;
  return <Icon size={size} className={className} />;
};

Chart.register(...registerables);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeOS - Personal OS" },
      { name: "description", content: "Track habits, XP, and daily growth." },
    ],
  }),
  component: LifeOS,
});

type Cat = "good" | "bad" | "natural";
interface Habit { id: number; title: string; cat: Cat; xp: number; icon: string; done: boolean }

const DEFAULT_HABITS: Habit[] = [
  { id: 1, title: 'Bangun sebelum 05:30', cat: 'good', xp: 25, icon: '🌅', done: false },
  { id: 2, title: 'Sholat Subuh tepat waktu', cat: 'good', xp: 20, icon: '🕌', done: false },
  { id: 3, title: 'Workout 30 menit', cat: 'good', xp: 30, icon: '💪', done: false },
  { id: 4, title: 'Mandi pagi sebelum 08:00', cat: 'good', xp: 10, icon: '🚿', done: false },
  { id: 5, title: 'Membaca buku 30 menit', cat: 'good', xp: 30, icon: '📚', done: false },
  { id: 6, title: 'Coding 120 menit', cat: 'good', xp: 50, icon: '💻', done: false },
  { id: 7, title: 'Belajar Bahasa Inggris 20 menit', cat: 'good', xp: 20, icon: '🌐', done: false },
  { id: 8, title: 'Menulis jurnal harian', cat: 'good', xp: 15, icon: '✍️', done: false },
  { id: 9, title: 'Tidur sebelum jam 23:00', cat: 'good', xp: 25, icon: '😴', done: false },
  { id: 10, title: 'Minum air minimal 2 Liter', cat: 'good', xp: 15, icon: '💧', done: false },
  { id: 11, title: 'Makan makanan sehat', cat: 'good', xp: 20, icon: '🥗', done: false },
  { id: 12, title: 'Tidak menunda pekerjaan', cat: 'good', xp: 20, icon: '🎯', done: false },
  { id: 13, title: 'Sarapan', cat: 'natural', xp: 5, icon: '🍳', done: false },
  { id: 14, title: 'Makan siang', cat: 'natural', xp: 5, icon: '🍱', done: false },
  { id: 15, title: 'Makan malam', cat: 'natural', xp: 5, icon: '🍽️', done: false },
  { id: 16, title: 'Pergi bekerja', cat: 'natural', xp: 10, icon: '🏢', done: false },
  { id: 17, title: 'Istirahat siang', cat: 'natural', xp: 5, icon: '😌', done: false },
  { id: 18, title: 'Scroll media sosial >60 menit', cat: 'bad', xp: -40, icon: '📱', done: false },
  { id: 19, title: 'Menonton YouTube tanpa tujuan >1 jam', cat: 'bad', xp: -20, icon: '📺', done: false },
  { id: 20, title: 'Begadang', cat: 'bad', xp: -30, icon: '🌙', done: false },
];

const ACHS = [
  { id: 1, title: 'Streak 7 Hari', icon: '🔥', desc: '7 hari berturut-turut', unlocked: false, xp: 75 },
  { id: 2, title: 'Workout 7 Hari', icon: '💪', desc: 'Workout 7 hari berturut-turut', unlocked: false, xp: 50 },
  { id: 3, title: 'Coding 10 Jam', icon: '💻', desc: 'Total coding 10 jam', unlocked: false, xp: 100 },
  { id: 4, title: 'Membaca 100 Halaman', icon: '📚', desc: 'Baca 100 halaman total', unlocked: false, xp: 80 },
  { id: 5, title: 'Perfect Week', icon: '🏆', desc: 'Semua hari rank B+', unlocked: false, xp: 200 },
  { id: 6, title: 'No Social Media 7 Hari', icon: '🚫', desc: '7 hari tanpa medsos', unlocked: false, xp: 100 },
  { id: 7, title: 'No Porn 30 Hari', icon: '🛡️', desc: '30 hari clean', unlocked: false, xp: 300 },
  { id: 8, title: 'Menyelesaikan 100 Checklist', icon: '✅', desc: '100 checklist selesai', unlocked: false, xp: 150 },
  { id: 9, title: 'Streak 30 Hari', icon: '⚡', desc: '30 hari berturut-turut', unlocked: false, xp: 250 },
];

const STORAGE_KEY = "lifeos_v3";
const LEVELS = [0, 200, 450, 750, 1100, 1500, 2000, 2600, 3300, 4100];

function getRank(s: number) {
  if (s >= 250) return 'S'; if (s >= 200) return 'A'; if (s >= 150) return 'B';
  if (s >= 100) return 'C'; if (s >= 50) return 'D'; return 'E';
}
function getLevel(xp: number) {
  let lv = 1; for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i]) lv = i + 1;
  return Math.min(lv, 10);
}
function getLevelProgress(xp: number) {
  const lv = getLevel(xp) - 1;
  const cur = LEVELS[lv] || 0; const next = LEVELS[lv + 1] || 4100;
  return { pct: Math.round((xp - cur) / (next - cur) * 100), toNext: next - xp, next };
}

type Theme = 'system' | 'light' | 'dark';
type Page = 'dashboard' | 'checklist' | 'analytics' | 'achievements' | 'reflection' | 'calendar' | 'settings';

function LifeOS() {
  const today = new Date().toISOString().split('T')[0];

  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s.habits) {
            if (s.lastDate === today) return s.habits;
            return s.habits.map((h: Habit) => ({ ...h, done: false }));
          }
        }
      } catch { }
    }
    return DEFAULT_HABITS.map(h => ({ ...h }));
  });

  const [totalXP, setTotalXP] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try { const raw = localStorage.getItem(STORAGE_KEY); if (raw && JSON.parse(raw).totalXP !== undefined) return JSON.parse(raw).totalXP; } catch { }
    }
    return 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try { const raw = localStorage.getItem(STORAGE_KEY); if (raw && JSON.parse(raw).streak !== undefined) return JSON.parse(raw).streak; } catch { }
    }
    return 0;
  });

  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Theme ──────────────────────────────────────────────────
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lifeos_theme') as Theme) || 'system';
    }
    return 'system';
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_theme', t);
    }
  };

  useEffect(() => {
    const apply = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.classList.toggle('light', !isDark);
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
  // ──────────────────────────────────────────────────────────

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, totalXP, streak, lastDate: today }));
  }, [habits, totalXP, streak, today]);

  const score = useMemo(() => habits.reduce((a, h) => h.done ? a + h.xp : a, 0), [habits]);
  const rank = getRank(score);
  const lv = getLevel(totalXP);
  const lvp = getLevelProgress(totalXP);
  const doneCount = habits.filter(h => h.done).length;
  const goodDone = habits.filter(h => h.done && h.cat === 'good').length;
  const badDone = habits.filter(h => h.done && h.cat === 'bad').length;
  const naturalDone = habits.filter(h => h.done && h.cat === 'natural').length;
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;

  const toggle = (id: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const done = !h.done;
      setTotalXP(x => Math.max(0, x + (done ? h.xp : -h.xp)));
      return { ...h, done };
    }));
  };

  const addHabit = (title: string, cat: Cat, xp: number, icon: string) => {
    const newId = habits.length ? Math.max(...habits.map(h => h.id)) + 1 : 1;
    setHabits([...habits, { id: newId, title, cat, xp, icon, done: false }]);
  };

  const deleteHabit = (id: number) => {
    setHabits(prev => {
      const target = prev.find(h => h.id === id);
      if (target?.done) setTotalXP(x => Math.max(0, x - target.xp));
      return prev.filter(h => h.id !== id);
    });
  };

  const updateHabit = (id: number, title: string, cat: Cat, xp: number, icon: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      if (h.done) setTotalXP(x => Math.max(0, x - h.xp + xp));
      return { ...h, title, cat, xp, icon };
    }));
  };

  const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const doneSorted = [...habits.filter(h => h.done)].sort((a, b) => Math.abs(b.xp) - Math.abs(a.xp));
  const topGood = doneSorted.find(h => h.cat === 'good');
  const topBad = doneSorted.find(h => h.cat === 'bad');

  const winning = badDone <= 2 && pct >= 70;

  return (
    <div className="app">
      <div className="mobile-topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
        <div className="logo" style={{ margin: 0, padding: 0 }}>
          <div style={{ width: 44, height: 44, padding: 2, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <img src="/icon.png" alt="LifeOS Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="logo-text" style={{ fontSize: 18 }}>LifeOS</div>
        </div>
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <div style={{ width: 54, height: 54, padding: 2, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <img src="/icon.png" alt="LifeOS Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div className="logo-text">LifeOS</div>
            <div className="logo-sub">Personal OS</div>
          </div>
        </div>
        <div className="nav-section">Main</div>
        <NavBtn icon={<LayoutDashboard size={18} />} label="Dashboard" active={page === 'dashboard'} onClick={() => { setPage('dashboard'); setSidebarOpen(false); }} />
        <NavBtn icon={<CheckSquare size={18} />} label="Today's Match" active={page === 'checklist'} onClick={() => { setPage('checklist'); setSidebarOpen(false); }} />
        <NavBtn icon={<LineChart size={18} />} label="Analytics" active={page === 'analytics'} onClick={() => { setPage('analytics'); setSidebarOpen(false); }} />
        <div className="nav-section">Personal</div>
        <NavBtn icon={<Award size={18} />} label="Achievements" active={page === 'achievements'} onClick={() => { setPage('achievements'); setSidebarOpen(false); }} />
        <NavBtn icon={<FileText size={18} />} label="Reflection" active={page === 'reflection'} onClick={() => { setPage('reflection'); setSidebarOpen(false); }} />
        <NavBtn icon={<CalendarIcon size={18} />} label="Calendar" active={page === 'calendar'} onClick={() => { setPage('calendar'); setSidebarOpen(false); }} />
        <div className="nav-section">System</div>
        <NavBtn icon={<SettingsIcon size={18} />} label="Settings" active={page === 'settings'} onClick={() => { setPage('settings'); setSidebarOpen(false); }} />
        <div className="sidebar-bottom">
          <div className="level-card">
            <div className="level-label">Current Level</div>
            <div className="level-num">Lv.{lv}</div>
            <div className="xp-bar-bg"><div className="xp-bar-fill" style={{ width: `${lvp.pct}%` }} /></div>
            <div className="xp-text">{totalXP} / {lvp.next} XP</div>
          </div>
          {/* Theme quick-toggle */}
          <div className="sidebar-theme-toggle">
            <button title="System" className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}><MonitorSmartphone size={15} /></button>
            <button title="Light" className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}><Sun size={15} /></button>
            <button title="Dark" className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}><Moon size={15} /></button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', padding: 4 }}>v1.0.0 · LifeOS</div>
        </div>
      </aside>

      <main className="main">
        {page === 'dashboard' && (
          <Dashboard {...{ dateStr, streak, score, rank, goodDone, badDone, naturalDone, lv, lvp, totalXP, doneCount, pct, habits, toggle, topGood, topBad, winning, setPage }} />
        )}
        {page === 'checklist' && (
          <Checklist {...{ score, rank, doneCount, pct, goodDone, badDone, naturalDone, habits, toggle, addHabit, deleteHabit, updateHabit }} />
        )}
        {page === 'analytics' && <Analytics {...{ score, goodDone, badDone, habits, dateStr }} />}
        {page === 'achievements' && <Achievements />}
        {page === 'reflection' && <Reflection onSave={() => setTotalXP(x => x + 15)} />}
        {page === 'calendar' && <Calendar score={score} />}
        {page === 'settings' && <Settings theme={theme} setTheme={setTheme} />}
      </main>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={`nav-item${active ? ' active' : ''}`} onClick={onClick}><span className="ni" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span> {label}</button>;
}

const ICONS = ['🌅', '🕌', '💪', '🚿', '📚', '💻', '🌐', '✍️', '😴', '💧', '🥗', '🎯', '🍳', '🍱', '🍽️', '🏢', '😌', '📱', '📺', '🌙', '🔥', '🏆', '🚫', '🛡️', '✅', '⚡', '⚠️', '📊'];

const REVEAL_WIDTH = 88;

function HabitItem({ h, onToggle, onDelete, onUpdate }: {
  h: Habit;
  onToggle: (id: number) => void;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, title: string, cat: Cat, xp: number, icon: string) => void;
}) {
  const catLabel = h.cat === 'good' ? 'cat-good' : h.cat === 'bad' ? 'cat-bad' : 'cat-natural';
  const catText = h.cat === 'good' ? 'Good' : h.cat === 'bad' ? 'Bad' : 'Natural';
  const xpSign = h.xp > 0 ? '+' : '';

  // ── Edit state ────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(h.title);
  const [editCat, setEditCat] = useState<Cat>(h.cat);
  const [editXp, setEditXp] = useState(h.xp);
  const [editIcon, setEditIcon] = useState(h.icon);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!editTitle.trim()) return;
    onUpdate?.(h.id, editTitle.trim(), editCat, editXp, editIcon);
    setEditing(false);
  };
  const handleCancel = (e: React.MouseEvent) => { e.stopPropagation(); setEditing(false); };

  // ── Swipe state ───────────────────────────────────────────
  const [swipeX, setSwipeX] = useState(0);
  const [swipeOpen, setSwipeOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDragging = useRef(false);
  const axisLocked = useRef<'h' | 'v' | null>(null);
  const swipeGuard = useRef(false);   // suppresses accidental click after a swipe

  const closeSwipe = () => { setTransitioning(true); setSwipeX(0); setSwipeOpen(false); };

  const onTouchStart = (e: React.TouchEvent) => {
    if (editing) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDragging.current = false;
    axisLocked.current = null;
    setTransitioning(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (editing) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!axisLocked.current && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      axisLocked.current = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
    }
    if (axisLocked.current !== 'h') return;   // let vertical scroll through
    e.preventDefault();
    touchDragging.current = true;
    const base = swipeOpen ? -REVEAL_WIDTH : 0;
    setSwipeX(Math.max(-REVEAL_WIDTH, Math.min(0, base + dx)));
  };

  const onTouchEnd = () => {
    if (!touchDragging.current) return;
    swipeGuard.current = true;
    setTransitioning(true);
    const shouldOpen = swipeX < -(REVEAL_WIDTH * 0.4);
    setSwipeX(shouldOpen ? -REVEAL_WIDTH : 0);
    setSwipeOpen(shouldOpen);
    touchDragging.current = false;
    requestAnimationFrame(() => { swipeGuard.current = false; });
  };

  // Swipe-action helpers
  const swipeEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeSwipe();
    setTimeout(() => { setEditTitle(h.title); setEditCat(h.cat); setEditXp(h.xp); setEditIcon(h.icon); setEditing(true); }, 180);
  };
  const swipeDelete = (e: React.MouseEvent) => { e.stopPropagation(); closeSwipe(); onDelete?.(h.id); };

  const canSwipe = !!(onDelete || onUpdate);

  return (
    <div
      className={`habit-swipe-container${swipeOpen ? ' swiped' : ''}`}
      onTouchStart={canSwipe ? onTouchStart : undefined}
      onTouchMove={canSwipe ? onTouchMove : undefined}
      onTouchEnd={canSwipe ? onTouchEnd : undefined}
    >
      {/* Sliding habit card */}
      <div
        className={`habit-item${h.done ? ' done' : ''}${editing ? ' editing' : ''}`}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: transitioning ? 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        }}
        onClick={() => {
          if (swipeGuard.current) return;
          if (swipeOpen) { closeSwipe(); return; }
          if (!editing) onToggle(h.id);
        }}
      >
        <div className="habit-main-content" style={{ flexWrap: editing ? 'wrap' : 'nowrap' }}>
          <div className={`checkbox${h.done ? ' checked ' + h.cat : ''}`}>{h.done ? <Check size={12} strokeWidth={3} /> : ''}</div>
          <div className="habit-info">
            <div className="habit-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{renderIcon(h.icon, 14)} {h.title}</div>
            <div className={`habit-xp ${h.cat}`}>{xpSign}{h.xp} XP</div>
          </div>
          <div className={`cat-badge ${catLabel}`}>{catText}</div>

          {/* Inline edit panel */}
          {editing && (
            <form className="habit-edit-panel" onSubmit={handleSave} onClick={e => e.stopPropagation()}>
              <input id={`habit-edit-title-${h.id}`} className="habit-edit-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Habit title..." autoFocus />
              <select id={`habit-edit-cat-${h.id}`} className="habit-edit-select" value={editCat} onChange={e => setEditCat(e.target.value as Cat)}>
                <option value="good">Good (+)</option><option value="natural">Natural</option><option value="bad">Bad (−)</option>
              </select>
              <input id={`habit-edit-xp-${h.id}`} className="habit-edit-input xp" value={editXp} onChange={e => setEditXp(Number(e.target.value))} type="number" title="XP value" />
              <select id={`habit-edit-icon-${h.id}`} className="habit-edit-select icon" value={editIcon} onChange={e => setEditIcon(e.target.value)} title="Icon">
                {ICONS.map(ico => <option key={ico} value={ico}>{ico}</option>)}
              </select>
              <div className="habit-edit-btns">
                <button type="submit" className="habit-edit-save">Save</button>
                <button type="button" className="habit-edit-cancel" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Inline action buttons — revealed horizontally inside the swipe container */}
        {canSwipe && (
          <div className="swipe-reveal-actions-inline" onClick={e => e.stopPropagation()}>
            <button id={`swipe-edit-${h.id}`} className="swipe-btn-inline edit" onClick={swipeEdit} aria-label="Edit habit">
              <Pencil size={13} />
            </button>
            <button id={`swipe-delete-${h.id}`} className="swipe-btn-inline delete" onClick={swipeDelete} aria-label="Delete habit">
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function Dashboard(p: any) {
  const { dateStr, streak, score, rank, goodDone, badDone, naturalDone, lv, lvp, totalXP, doneCount, pct, habits, toggle, topGood, topBad, winning, setPage } = p;
  const ringOffset = 138.2 * (1 - lvp.pct / 100);
  const heatmap = useMemo(() => {
    const arr: number[] = new Array(97).fill(0);
    arr.push(score > 150 ? 4 : score > 100 ? 3 : score > 50 ? 2 : score > 0 ? 1 : 0);
    return arr;
  }, [score]);
  const xpRef = useRef<HTMLCanvasElement>(null);
  const splitRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const scores = [0, 0, 0, 0, 0, 0, score];
    const c1 = xpRef.current && new Chart(xpRef.current, { type: 'line', data: { labels: days, datasets: [{ data: scores, borderColor: '#10b981', backgroundColor: '#10b98115', borderWidth: 2, pointBackgroundColor: '#10b981', pointRadius: 3, tension: .4, fill: true }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#ffffff08' }, ticks: { color: '#5a5a6e', font: { size: 10 } } }, y: { grid: { color: '#ffffff08' }, ticks: { color: '#5a5a6e', font: { size: 10 } }, min: 0 } } } });
    const c2 = splitRef.current && new Chart(splitRef.current, { type: 'doughnut', data: { labels: ['Good', 'Natural', 'Bad'], datasets: [{ data: [goodDone, naturalDone, badDone], backgroundColor: ['#10b981', '#3b82f6', '#ef4444'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '65%' } });
    return () => { c1?.destroy(); c2?.destroy(); };
  }, []);
  return (
    <div>
      <div className="header">
        <div>
          <div className="greeting">Good Morning, La Awe 👋</div>
          <div className="header-sub">{dateStr}</div>
        </div>
        <div className="header-right">
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'var(--emerald)' }}>
            🔥 {streak} day streak
          </div>
        </div>
      </div>

      <div className="hero-grid">
        <div className="hero-card match-card">
          <div className="match-header">
            <div className="match-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Award size={14} /> Today's Match</div>
            <div className={`rank-badge rank-${rank}`}>Rank {rank}</div>
          </div>
          <div className="match-score">{score} <span>XP</span></div>
          <div className="match-meta">Win condition: Rank ≥ B · Bad Habits ≤ 2 · 70% checklist</div>
          <div className="mini-stats">
            <div className="mini-stat"><span className="dot dot-green" /><span className="stat-val">{goodDone}</span><span className="stat-lbl">&nbsp;good</span></div>
            <div className="mini-stat"><span className="dot dot-red" /><span className="stat-val">{badDone}</span><span className="stat-lbl">&nbsp;bad</span></div>
            <div className="mini-stat"><span className="dot dot-blue" /><span className="stat-val">{naturalDone}</span><span className="stat-lbl">&nbsp;natural</span></div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Award size={14} /> Level & XP</div>
          <div className="card-value" style={{ color: 'var(--emerald)' }}>Level {lv}</div>
          <div className="card-sub">{totalXP} XP · {lvp.toNext} to Level {lv + 1}</div>
          <div className="ring-wrap">
            <svg className="ring-svg" width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#1c1c28" strokeWidth="6" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="138.2" strokeDashoffset={ringOffset} strokeLinecap="round" />
            </svg>
            <div className="ring-center"><div className="ring-pct">{lvp.pct}%</div><div className="ring-lbl">to Level {lv + 1}</div></div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Flame size={14} /> Streak</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div className="card-value" style={{ color: 'var(--orange)' }}>{streak}</div>
            <div className="card-sub">days</div>
          </div>
          <div className="card-sub">Best: 14 days · Keep going!</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < streak % 7 ? 'var(--orange)' : 'var(--bg4)' }} />
            ))}
          </div>
        </div>

        <div className="hero-card">
          <div className="card-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckSquare size={14} /> Progress</div>
          <div className="card-value">{doneCount}/{habits.length}</div>
          <div className="card-sub">tasks completed today</div>
          <div style={{ marginTop: 12 }}>
            <div className="xp-bar-bg" style={{ height: 6 }}><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{pct}% complete</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Today's Checklist</div>
          <button className="section-action" onClick={() => setPage('checklist')}>View all →</button>
        </div>
        <div className="checklist-grid">
          {habits.slice(0, 6).map((h: Habit) => <HabitItem key={h.id} h={h} onToggle={toggle} />)}
        </div>
      </div>

      <div className="section">
        <div className="section-header"><div className="section-title">This Week</div></div>
        <div className="analytics-grid">
          <div className="chart-card" style={{ gridColumn: 'span 2' }}>
            <div className="chart-title">XP Trend</div>
            <div className="chart-sub">Daily score over the last 7 days</div>
            <div style={{ position: 'relative', height: 120 }}><canvas ref={xpRef} /></div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Habit Split</div>
            <div className="chart-sub">Good vs Bad this week</div>
            <div style={{ position: 'relative', height: 120 }}><canvas ref={splitRef} /></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Consistency Heatmap</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Last 98 days</div>
        </div>
        <div className="chart-card">
          <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
            <div className="heatmap-grid" style={{ minWidth: 500 }}>
              {heatmap.map((lvl, i) => <div key={i} className={`hm-cell hm-${lvl}`} />)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>Less</span>
            {[0, 1, 2, 3, 4].map(n => <div key={n} style={{ width: 10, height: 10, borderRadius: 2 }} className={`hm-${n}`} />)}
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>More</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header"><div className="section-title">Daily Insights</div></div>
        <div className="reflection-card">
          <div className="refl-row">
            <div className="refl-item">
              <div className="refl-icon" style={{ background: '#064e3b', color: '#6ee7b7' }}><Activity size={18} /></div>
              <div className="refl-info">
                <div className="refl-label">Top Habit</div>
                <div className="refl-val" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>{topGood ? <>{renderIcon(topGood.icon, 14)} <span style={{ fontWeight: 500 }}>{topGood.title}</span></> : <span style={{ color: 'var(--text3)' }}>Not started</span>}</div>
                <div className="refl-xp">+{topGood?.xp ?? 0} XP earned</div>
              </div>
            </div>
            <div className="refl-item">
              <div className="refl-icon" style={{ background: '#4c1d1d', color: '#fca5a5' }}><AlertTriangle size={18} /></div>
              <div className="refl-info">
                <div className="refl-label">Needs Attention</div>
                <div className="refl-val" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>{topBad ? <>{renderIcon(topBad.icon, 14)} <span style={{ fontWeight: 500 }}>{topBad.title}</span></> : <span style={{ color: 'var(--text3)' }}>Clean sheet!</span>}</div>
                <div className="refl-xp" style={{ color: topBad ? 'var(--red)' : 'var(--text3)' }}>{topBad ? `−${Math.abs(topBad.xp)} XP lost` : 'No bad habits yet'}</div>
              </div>
            </div>
            <div className="refl-item">
              <div className="refl-icon" style={{ background: '#1e3a5f', color: '#93c5fd' }}><Target size={18} /></div>
              <div className="refl-info">
                <div className="refl-label">Daily Target</div>
                <div className="refl-val" style={{ color: winning ? 'var(--emerald)' : 'var(--text)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {winning ? <><CheckCircle size={14} /> On track</> : 'In progress'}
                </div>
                <div className="refl-xp">Goal: Rank B & max 2 bad habits</div>
              </div>
            </div>
            <div className="refl-item">
              <div className="refl-icon" style={{ background: '#3b0764', color: '#d8b4fe' }}><Zap size={18} /></div>
              <div className="refl-info">
                <div className="refl-label">Bonus Opportunity</div>
                <div className="refl-val" style={{ marginTop: 2 }}>+50 XP reward</div>
                <div className="refl-xp">Complete all tasks today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Recent Achievements</div>
          <button className="section-action" onClick={() => setPage('achievements')}>View all →</button>
        </div>
        <div className="achievement-list">
          {ACHS.filter(a => a.unlocked).map(a => <div key={a.id} className="ach-pill unlocked">{renderIcon(a.icon, 14)} {a.title}</div>)}
          {ACHS.filter(a => !a.unlocked).slice(0, 2).map(a => <div key={a.id} className="ach-pill locked"><Lock size={14} /> {a.title}</div>)}
        </div>
      </div>
    </div>
  );
}

function Checklist({ score, rank, doneCount, pct, goodDone, badDone, naturalDone, habits, toggle, addHabit, deleteHabit, updateHabit }: any) {
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<Cat>('good');
  const [newXp, setNewXp] = useState(10);
  const [newIcon, setNewIcon] = useState('🌅');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit(newTitle, newCat, newXp, newIcon);
    setNewTitle('');
  };

  const good = habits.filter((h: Habit) => h.cat === 'good');
  const bad = habits.filter((h: Habit) => h.cat === 'bad');
  const nat = habits.filter((h: Habit) => h.cat === 'natural');
  return (
    <div>
      <div className="header">
        <div>
          <div className="greeting">Today's Match</div>
          <div className="header-sub">Complete habits to increase your daily score</div>
        </div>
        <div className="header-right">
          <div className={`rank-badge rank-${rank}`}>Rank {rank}</div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 16px', fontSize: 15, fontWeight: 700, color: 'var(--emerald)' }}>{score} XP</div>
        </div>
      </div>
      <div className="chart-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Daily Progress</span>
          <span style={{ fontSize: 13, color: 'var(--emerald)', fontWeight: 600 }}>{doneCount}/{habits.length} completed</span>
        </div>
        <div className="xp-bar-bg" style={{ height: 8, borderRadius: 4 }}>
          <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          <div className="mini-stat"><span className="dot dot-green" /><span className="stat-val">{goodDone}</span><span className="stat-lbl">&nbsp;Good Habit</span></div>
          <div className="mini-stat"><span className="dot dot-red" /><span className="stat-val">{badDone}</span><span className="stat-lbl">&nbsp;Bad Habit</span></div>
          <div className="mini-stat"><span className="dot dot-blue" /><span className="stat-val">{naturalDone}</span><span className="stat-lbl">&nbsp;Natural</span></div>
        </div>
      </div>
      <ChecklistSection title={<><CheckCircle size={16} /> Good Habits</>} color="var(--emerald)" items={good} toggle={toggle} onDelete={deleteHabit} onUpdate={updateHabit} />
      <ChecklistSection title={<><Activity size={16} /> Natural Activities</>} color="var(--blue)" items={nat} toggle={toggle} onDelete={deleteHabit} onUpdate={updateHabit} />
      <ChecklistSection title={<><AlertTriangle size={16} /> Bad Habits (tracked)</>} color="var(--red)" items={bad} toggle={toggle} onDelete={deleteHabit} onUpdate={updateHabit} />

      <div className="section" style={{ marginTop: 30 }}>
        <div className="section-header"><div className="section-title">Add New Habit</div></div>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', background: 'var(--bg2)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <input placeholder="Habit title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ flex: 1, minWidth: 200, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }} />
          <select value={newCat} onChange={e => setNewCat(e.target.value as Cat)} style={{ padding: '8px 12px' }}>
            <option value="good">Good Habit (+)</option>
            <option value="natural">Natural (Neutral)</option>
            <option value="bad">Bad Habit (-)</option>
          </select>
          <input type="number" value={newXp} onChange={e => setNewXp(Number(e.target.value))} style={{ width: 80, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }} title="XP Reward" />
          <select value={newIcon} onChange={e => setNewIcon(e.target.value)} style={{ width: 80, padding: '8px 12px' }} title="Select Icon">
            {ICONS.map(ico => <option key={ico} value={ico}>{ico}</option>)}
          </select>
          <button type="submit" style={{ background: 'var(--emerald)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>Add Habit</button>
        </form>
      </div>
    </div>
  );
}

function ChecklistSection({ title, color, items, toggle, onDelete, onUpdate }: {
  title: React.ReactNode;
  color: string;
  items: Habit[];
  toggle: (id: number) => void;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, title: string, cat: Cat, xp: number, icon: string) => void;
}) {
  return (
    <div className="section">
      <div className="section-header"><div className="section-title" style={{ color, display: 'flex', alignItems: 'center', gap: 6 }}>{title}</div></div>
      <div className="checklist-grid">{items.map(h => <HabitItem key={h.id} h={h} onToggle={toggle} onDelete={onDelete} onUpdate={onUpdate} />)}</div>
    </div>
  );
}

function Analytics(p: any) {
  const { score, goodDone, badDone, habits, dateStr } = p;
  const [tab, setTab] = useState('weekly');
  const xpRef = useRef<HTMLCanvasElement>(null);
  const habitRef = useRef<HTMLCanvasElement>(null);
  const radarRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const scores = [0, 0, 0, 0, 0, 0, score || 0];
    const goodH = [0, 0, 0, 0, 0, 0, goodDone || 0];
    const badH = [0, 0, 0, 0, 0, 0, badDone || 0];
    const c1 = xpRef.current && new Chart(xpRef.current, { type: 'bar', data: { labels: days, datasets: [{ data: scores, backgroundColor: scores.map(s => s >= 200 ? '#10b981' : s >= 150 ? '#3b82f6' : '#f97316'), borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#ffffff08' }, ticks: { color: '#5a5a6e', font: { size: 11 } } }, y: { grid: { color: '#ffffff08' }, ticks: { color: '#5a5a6e', font: { size: 11 } }, min: 0 } } } });
    const c2 = habitRef.current && new Chart(habitRef.current, { type: 'bar', data: { labels: days, datasets: [{ label: 'Good', data: goodH, backgroundColor: '#10b98188', borderRadius: 4 }, { label: 'Bad', data: badH, backgroundColor: '#ef444488', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#9898a8', font: { size: 11 }, boxWidth: 10 } } }, scales: { x: { grid: { color: '#ffffff08' }, ticks: { color: '#5a5a6e', font: { size: 11 } } }, y: { grid: { color: '#ffffff08' }, ticks: { color: '#5a5a6e', font: { size: 11 } }, min: 0 } } } });
    const c3 = radarRef.current && new Chart(radarRef.current, { type: 'radar', data: { labels: ['Health', 'Discipline', 'Learning', 'Mind', 'Career', 'Social'], datasets: [{ data: [0, 0, 0, 0, 0, 0], borderColor: '#a855f7', backgroundColor: '#a855f720', borderWidth: 2, pointBackgroundColor: '#a855f7', pointRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { grid: { color: '#ffffff15' }, ticks: { color: '#5a5a6e', font: { size: 10 }, backdropColor: 'transparent' }, pointLabels: { color: '#9898a8', font: { size: 11 } }, min: 0, max: 100 } } } });
    return () => { c1?.destroy(); c2?.destroy(); c3?.destroy(); };
  }, []);
  return (
    <div>
      <div className="header"><div><div className="greeting">Analytics</div><div className="header-sub">Your personal growth data</div></div></div>
      <div className="tabs">
        {['weekly', 'monthly', 'lifetime'].map(t => (
          <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</div>
        ))}
      </div>
      <div className="analytics-grid analytics-grid-2">
        <div className="chart-card">
          <div className="chart-title">XP Trend — This Week</div>
          <div className="chart-sub">Daily XP score per day</div>
          <div style={{ position: 'relative', height: 160 }}><canvas ref={xpRef} /></div>
        </div>
        <div className="chart-card">
          <div className="chart-title">Good vs Bad Habits</div>
          <div className="chart-sub">Ratio this week</div>
          <div style={{ position: 'relative', height: 160 }}><canvas ref={habitRef} /></div>
        </div>
      </div>
      <div className="stats-grid">
        <div className="hero-card"><div className="card-label">Avg Score</div><div className="card-value" style={{ color: 'var(--blue)' }}>{score || 0}</div><div className="card-sub">This week</div></div>
        <div className="hero-card"><div className="card-label">Best Day</div><div className="card-value" style={{ color: 'var(--emerald)' }}>{score > 0 ? (dateStr?.split(',')[0] || 'Today') : '-'}</div><div className="card-sub">{score || 0} XP</div></div>
        <div className="hero-card"><div className="card-label">Good Habits</div><div className="card-value" style={{ color: 'var(--emerald)' }}>{habits?.length ? Math.round((goodDone / habits.length) * 100) : 0}%</div><div className="card-sub">of checklist</div></div>
        <div className="hero-card"><div className="card-label">Bad Habits</div><div className="card-value" style={{ color: 'var(--red)' }}>{habits?.length ? Math.round((badDone / habits.length) * 100) : 0}%</div><div className="card-sub">need reduction</div></div>
      </div>
      <div className="chart-card">
        <div className="chart-title">Character Stats</div>
        <div className="chart-sub">Your personal attributes based on habits</div>
        <div style={{ position: 'relative', height: 200 }}><canvas ref={radarRef} /></div>
      </div>
    </div>
  );
}

function Achievements() {
  return (
    <div>
      <div className="header"><div><div className="greeting">Achievements</div><div className="header-sub">Unlock badges by building habits</div></div></div>
      <div className="achievements-grid">
        {ACHS.map(a => (
          <div key={a.id} style={{ background: 'var(--bg2)', border: `1px solid ${a.unlocked ? '#eab30844' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: 20, opacity: a.unlocked ? 1 : .6 }}>
            <div style={{ color: a.unlocked ? 'var(--yellow)' : 'var(--text3)', marginBottom: 10 }}>{renderIcon(a.icon, 32)}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: a.unlocked ? 'var(--yellow)' : 'var(--text)' }}>{a.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>{a.desc}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: a.unlocked ? 'var(--yellow)' : 'var(--text3)' }}>+{a.xp} XP {a.unlocked ? '· UNLOCKED ✓' : '· LOCKED'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reflection({ onSave }: { onSave: () => void }) {
  const [mood, setMood] = useState<number | null>(null);
  const [good, setGood] = useState('');
  const [bad, setBad] = useState('');
  const [tom, setTom] = useState('');
  const taStyle: React.CSSProperties = { width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12, color: 'var(--text)', fontSize: 13, resize: 'vertical', minHeight: 80, fontFamily: 'inherit' };
  return (
    <div>
      <div className="header"><div><div className="greeting">Daily Reflection</div><div className="header-sub">Evaluate and plan for tomorrow</div></div></div>
      <div className="reflection-card" style={{ maxWidth: 640 }}>
        <Field label="Apa yang berjalan baik hari ini?"><textarea value={good} onChange={e => setGood(e.target.value)} style={taStyle} placeholder="Ceritakan pencapaian hari ini..." /></Field>
        <Field label="Apa yang menghambat?"><textarea value={bad} onChange={e => setBad(e.target.value)} style={taStyle} placeholder="Hambatan hari ini..." /></Field>
        <Field label="Target besok?"><textarea value={tom} onChange={e => setTom(e.target.value)} style={taStyle} placeholder="Rencana untuk besok..." /></Field>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>Mood hari ini?</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[<Frown size={20} />, <Meh size={20} />, <Smile size={20} />, <Smile size={20} color="var(--emerald)" />, <Zap size={20} color="var(--yellow)" />].map((e, i) => (
              <div key={i} onClick={() => setMood(i + 1)} style={{ padding: '8px 16px', borderRadius: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: `1px solid ${mood === i + 1 ? 'var(--emerald)' : 'var(--border)'}` }}>{e}</div>
            ))}
          </div>
        </div>
        <button onClick={() => { onSave(); alert('Reflection saved! +15 XP'); }} style={{ background: 'var(--emerald)', color: '#000', border: 'none', borderRadius: 'var(--radius-sm)', padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Save Reflection +15 XP</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text2)' }}>{label}</div>
      {children}
    </div>
  );
}

function Calendar({ score }: { score?: number }) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const start = new Date(); start.setDate(1);
  const offset = start.getDay();
  const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const todayD = new Date().getDate();
  const scores = useMemo(() => cells.map(d => d === todayD ? (score || 0) : 0), [cells, todayD, score]);
  return (
    <div>
      <div className="header"><div><div className="greeting">Calendar</div><div className="header-sub">Your activity history</div></div></div>
      <div className="chart-card">
        <div className="calendar-grid">
          {dayNames.map(d => <div key={d} className="calendar-header-day" style={{ textAlign: 'center', padding: '4px 0' }}>{d}</div>)}
          {cells.map((d, i) => {
            if (d === null) return <div key={i} />;
            const isToday = d === todayD;
            const score = scores[i];
            return <div key={i} title={`Day ${d}: ${score} XP`} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, background: isToday ? '#10b98122' : score > 200 ? 'var(--emerald-d)' : score > 100 ? 'var(--blue-d)' : 'var(--bg3)', color: isToday ? 'var(--emerald)' : 'var(--text2)', fontWeight: isToday ? 700 : 400, border: isToday ? '1px solid var(--emerald)' : '1px solid transparent' }}>{d}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

function Settings({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const exp = () => {
    const data = localStorage.getItem(STORAGE_KEY) || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lifeos-backup.json'; a.click();
  };
  const reset = () => { if (confirm('Delete ALL LifeOS data?')) { localStorage.removeItem(STORAGE_KEY); location.reload(); } };

  const rowBtn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '12px 16px',
    color: 'var(--text)', cursor: 'pointer',
    fontSize: 13, fontWeight: 500, textAlign: 'left', width: '100%',
    transition: 'background 0.15s',
  };

  const themeOptions: { key: Theme; icon: React.ReactNode; label: string }[] = [
    { key: 'system', icon: <MonitorSmartphone size={18} />, label: 'System' },
    { key: 'light', icon: <Sun size={18} />, label: 'Light' },
    { key: 'dark', icon: <Moon size={18} />, label: 'Dark' },
  ];

  return (
    <div>
      <div className="header">
        <div>
          <div className="greeting">Settings</div>
          <div className="header-sub">Appearance &amp; data management</div>
        </div>
      </div>

      {/* ── Appearance ── */}
      <div className="settings-section" style={{ maxWidth: 520, marginBottom: 16 }}>
        <div className="settings-section-title">Appearance</div>
        <div style={{ marginBottom: 10, fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Theme</div>
        <div className="appearance-toggle">
          {themeOptions.map(({ key, icon, label }) => (
            <button
              key={key}
              className={theme === key ? 'active' : ''}
              onClick={() => setTheme(key)}
              title={label}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text3)' }}>
          {theme === 'system' ? '🖥 Follows your device preference automatically.' :
            theme === 'light' ? '☀️ Always light — iOS 26 bright glass.' :
              '🌙 Always dark — deep space glass.'}
        </div>
      </div>

      {/* ── Data ── */}
      <div className="settings-section" style={{ maxWidth: 520 }}>
        <div className="settings-section-title">Data &amp; Storage</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>All data is stored locally in your browser. Nothing is sent to any server.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={exp} style={rowBtn}>
            <Upload size={16} style={{ color: 'var(--blue)' }} />
            <div>
              <div style={{ fontWeight: 600 }}>Export Backup</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Download your data as JSON</div>
            </div>
          </button>
          <button onClick={() => alert('Select a LifeOS JSON backup file to import.')} style={rowBtn}>
            <Download size={16} style={{ color: 'var(--emerald)' }} />
            <div>
              <div style={{ fontWeight: 600 }}>Import Backup</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Restore from a JSON file</div>
            </div>
          </button>
          <div className="divider" style={{ margin: '4px 0' }} />
          <button
            onClick={reset}
            style={{ ...rowBtn, border: '1px solid rgba(248,113,113,0.25)', background: 'var(--red-d)' }}
          >
            <Trash2 size={16} style={{ color: 'var(--red)' }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--red)' }}>Factory Reset</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>Delete all LifeOS data permanently</div>
            </div>
          </button>
        </div>
        <div style={{ marginTop: 20, fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>LifeOS v1.0.0 · No server · No tracking</div>
      </div>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

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
  {id:1,title:'Bangun sebelum 05:30',cat:'good',xp:25,icon:'🌅',done:false},
  {id:2,title:'Sholat Subuh tepat waktu',cat:'good',xp:20,icon:'🕌',done:false},
  {id:3,title:'Workout 30 menit',cat:'good',xp:30,icon:'💪',done:true},
  {id:4,title:'Mandi pagi sebelum 08:00',cat:'good',xp:10,icon:'🚿',done:true},
  {id:5,title:'Membaca buku 30 menit',cat:'good',xp:30,icon:'📚',done:true},
  {id:6,title:'Coding 120 menit',cat:'good',xp:50,icon:'💻',done:true},
  {id:7,title:'Belajar Bahasa Inggris 20 menit',cat:'good',xp:20,icon:'🌐',done:false},
  {id:8,title:'Menulis jurnal harian',cat:'good',xp:15,icon:'✍️',done:true},
  {id:9,title:'Tidur sebelum jam 23:00',cat:'good',xp:25,icon:'😴',done:false},
  {id:10,title:'Minum air minimal 2 Liter',cat:'good',xp:15,icon:'💧',done:true},
  {id:11,title:'Makan makanan sehat',cat:'good',xp:20,icon:'🥗',done:true},
  {id:12,title:'Tidak menunda pekerjaan',cat:'good',xp:20,icon:'🎯',done:false},
  {id:13,title:'Sarapan',cat:'natural',xp:5,icon:'🍳',done:true},
  {id:14,title:'Makan siang',cat:'natural',xp:5,icon:'🍱',done:true},
  {id:15,title:'Makan malam',cat:'natural',xp:5,icon:'🍽️',done:true},
  {id:16,title:'Pergi bekerja',cat:'natural',xp:10,icon:'🏢',done:true},
  {id:17,title:'Istirahat siang',cat:'natural',xp:5,icon:'😌',done:true},
  {id:18,title:'Scroll media sosial >60 menit',cat:'bad',xp:-40,icon:'📱',done:true},
  {id:19,title:'Menonton YouTube tanpa tujuan >1 jam',cat:'bad',xp:-20,icon:'📺',done:false},
  {id:20,title:'Begadang',cat:'bad',xp:-30,icon:'🌙',done:false},
];

const ACHS = [
  {id:1,title:'Streak 7 Hari',icon:'🔥',desc:'7 hari berturut-turut',unlocked:true,xp:75},
  {id:2,title:'Workout 7 Hari',icon:'💪',desc:'Workout 7 hari berturut-turut',unlocked:false,xp:50},
  {id:3,title:'Coding 10 Jam',icon:'💻',desc:'Total coding 10 jam',unlocked:true,xp:100},
  {id:4,title:'Membaca 100 Halaman',icon:'📚',desc:'Baca 100 halaman total',unlocked:false,xp:80},
  {id:5,title:'Perfect Week',icon:'🏆',desc:'Semua hari rank B+',unlocked:false,xp:200},
  {id:6,title:'No Social Media 7 Hari',icon:'🚫',desc:'7 hari tanpa medsos',unlocked:false,xp:100},
  {id:7,title:'No Porn 30 Hari',icon:'🛡️',desc:'30 hari clean',unlocked:false,xp:300},
  {id:8,title:'Menyelesaikan 100 Checklist',icon:'✅',desc:'100 checklist selesai',unlocked:true,xp:150},
  {id:9,title:'Streak 30 Hari',icon:'⚡',desc:'30 hari berturut-turut',unlocked:false,xp:250},
];

const STORAGE_KEY = "lifeos_v1";
const LEVELS = [0,200,450,750,1100,1500,2000,2600,3300,4100];

function getRank(s: number) {
  if (s>=250) return 'S'; if (s>=200) return 'A'; if (s>=150) return 'B';
  if (s>=100) return 'C'; if (s>=50) return 'D'; return 'E';
}
function getLevel(xp: number) {
  let lv=1; for(let i=0;i<LEVELS.length;i++) if(xp>=LEVELS[i]) lv=i+1;
  return Math.min(lv,10);
}
function getLevelProgress(xp: number) {
  const lv = getLevel(xp)-1;
  const cur = LEVELS[lv]||0; const next = LEVELS[lv+1]||4100;
  return {pct: Math.round((xp-cur)/(next-cur)*100), toNext: next-xp, next};
}

type Page = 'dashboard'|'checklist'|'analytics'|'achievements'|'reflection'|'calendar'|'settings';

function LifeOS() {
  const today = new Date().toISOString().split('T')[0];
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const s = JSON.parse(raw); if (s.lastDate===today && s.habits) return s.habits; }
    } catch {}
    return DEFAULT_HABITS.map(h=>({...h}));
  });
  const [totalXP, setTotalXP] = useState<number>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw).totalXP ?? 580; } catch {}
    return 580;
  });
  const [streak] = useState(7);
  const [page, setPage] = useState<Page>('dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({habits, totalXP, streak, lastDate: today}));
  }, [habits, totalXP, streak, today]);

  const score = useMemo(() => habits.reduce((a,h)=>h.done?a+h.xp:a,0), [habits]);
  const rank = getRank(score);
  const lv = getLevel(totalXP);
  const lvp = getLevelProgress(totalXP);
  const doneCount = habits.filter(h=>h.done).length;
  const goodDone = habits.filter(h=>h.done&&h.cat==='good').length;
  const badDone = habits.filter(h=>h.done&&h.cat==='bad').length;
  const naturalDone = habits.filter(h=>h.done&&h.cat==='natural').length;
  const pct = Math.round(doneCount/habits.length*100);

  const toggle = (id:number) => {
    setHabits(prev => prev.map(h => {
      if (h.id!==id) return h;
      const done = !h.done;
      setTotalXP(x => Math.max(0, x + (done ? h.xp : -h.xp)));
      return {...h, done};
    }));
  };

  const dateStr = new Date().toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

  const doneSorted = [...habits.filter(h=>h.done)].sort((a,b)=>Math.abs(b.xp)-Math.abs(a.xp));
  const topGood = doneSorted.find(h=>h.cat==='good');
  const topBad = doneSorted.find(h=>h.cat==='bad');

  const winning = badDone<=2 && pct>=70;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-text">LifeOS</div>
            <div className="logo-sub">Personal OS</div>
          </div>
        </div>
        <div className="nav-section">Main</div>
        <NavBtn icon="📊" label="Dashboard" active={page==='dashboard'} onClick={()=>setPage('dashboard')}/>
        <NavBtn icon="✅" label="Today's Match" active={page==='checklist'} onClick={()=>setPage('checklist')}/>
        <NavBtn icon="📈" label="Analytics" active={page==='analytics'} onClick={()=>setPage('analytics')}/>
        <div className="nav-section">Personal</div>
        <NavBtn icon="🏆" label="Achievements" active={page==='achievements'} onClick={()=>setPage('achievements')}/>
        <NavBtn icon="📝" label="Reflection" active={page==='reflection'} onClick={()=>setPage('reflection')}/>
        <NavBtn icon="📅" label="Calendar" active={page==='calendar'} onClick={()=>setPage('calendar')}/>
        <div className="nav-section">System</div>
        <NavBtn icon="⚙️" label="Settings" active={page==='settings'} onClick={()=>setPage('settings')}/>
        <div className="sidebar-bottom">
          <div className="level-card">
            <div className="level-label">Current Level</div>
            <div className="level-num">Lv.{lv}</div>
            <div className="xp-bar-bg"><div className="xp-bar-fill" style={{width:`${lvp.pct}%`}}/></div>
            <div className="xp-text">{totalXP} / {lvp.next} XP</div>
          </div>
          <div style={{fontSize:11,color:'var(--text3)',textAlign:'center',padding:4}}>v1.0.0 · LifeOS</div>
        </div>
      </aside>

      <main className="main">
        {page==='dashboard' && (
          <Dashboard {...{dateStr, streak, score, rank, goodDone, badDone, naturalDone, lv, lvp, totalXP, doneCount, pct, habits, toggle, topGood, topBad, winning, setPage}}/>
        )}
        {page==='checklist' && (
          <Checklist {...{score, rank, doneCount, pct, goodDone, badDone, naturalDone, habits, toggle}}/>
        )}
        {page==='analytics' && <Analytics/>}
        {page==='achievements' && <Achievements/>}
        {page==='reflection' && <Reflection onSave={()=>setTotalXP(x=>x+15)}/>}
        {page==='calendar' && <Calendar/>}
        {page==='settings' && <Settings/>}
      </main>
    </div>
  );
}

function NavBtn({icon,label,active,onClick}:{icon:string;label:string;active:boolean;onClick:()=>void}) {
  return <button className={`nav-item${active?' active':''}`} onClick={onClick}><span className="ni">{icon}</span> {label}</button>;
}

function HabitItem({h, onToggle}:{h:Habit;onToggle:(id:number)=>void}) {
  const catLabel = h.cat==='good'?'cat-good':h.cat==='bad'?'cat-bad':'cat-natural';
  const catText = h.cat==='good'?'Good':h.cat==='bad'?'Bad':'Natural';
  const xpSign = h.xp>0?'+':'';
  return (
    <div className={`habit-item${h.done?' done':''}`} onClick={()=>onToggle(h.id)}>
      <div className={`checkbox${h.done?' checked '+h.cat:''}`}>{h.done?'✓':''}</div>
      <div className="habit-info">
        <div className="habit-title">{h.icon} {h.title}</div>
        <div className={`habit-xp ${h.cat}`}>{xpSign}{h.xp} XP</div>
      </div>
      <div className={`cat-badge ${catLabel}`}>{catText}</div>
    </div>
  );
}

function Dashboard(p: any) {
  const {dateStr, streak, score, rank, goodDone, badDone, naturalDone, lv, lvp, totalXP, doneCount, pct, habits, toggle, topGood, topBad, winning, setPage} = p;
  const ringOffset = 138.2 * (1 - lvp.pct/100);
  const heatmap = useMemo(() => {
    const arr: number[] = [];
    for (let i=97;i>=0;i--) arr.push(Math.random()>0.3?Math.floor(Math.random()*5):0);
    return arr;
  }, []);
  const xpRef = useRef<HTMLCanvasElement>(null);
  const splitRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const days=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
    const scores=[120,245,180,160,90,200,185];
    const c1 = xpRef.current && new Chart(xpRef.current, {type:'line',data:{labels:days,datasets:[{data:scores,borderColor:'#10b981',backgroundColor:'#10b98115',borderWidth:2,pointBackgroundColor:'#10b981',pointRadius:3,tension:.4,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'#ffffff08'},ticks:{color:'#5a5a6e',font:{size:10}}},y:{grid:{color:'#ffffff08'},ticks:{color:'#5a5a6e',font:{size:10}},min:0}}}});
    const c2 = splitRef.current && new Chart(splitRef.current, {type:'doughnut',data:{labels:['Good','Natural','Bad'],datasets:[{data:[78,14,18],backgroundColor:['#10b981','#3b82f6','#ef4444'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:'65%'}});
    return () => { c1?.destroy(); c2?.destroy(); };
  }, []);
  return (
    <div>
      <div className="header">
        <div>
          <div className="greeting">Good morning, La Awe 👋</div>
          <div className="header-sub">{dateStr}</div>
        </div>
        <div className="header-right">
          <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'10px 16px',fontSize:13,fontWeight:600,color:'var(--emerald)'}}>
            🔥 {streak} day streak
          </div>
        </div>
      </div>

      <div className="hero-grid">
        <div className="hero-card match-card">
          <div className="match-header">
            <div className="match-label">⚔️ Today's Match</div>
            <div className={`rank-badge rank-${rank}`}>Rank {rank}</div>
          </div>
          <div className="match-score">{score} <span>XP</span></div>
          <div className="match-meta">Win condition: Rank ≥ B · Bad Habits ≤ 2 · 70% checklist</div>
          <div className="mini-stats">
            <div className="mini-stat"><span className="dot dot-green"/><span className="stat-val">{goodDone}</span><span className="stat-lbl">&nbsp;good</span></div>
            <div className="mini-stat"><span className="dot dot-red"/><span className="stat-val">{badDone}</span><span className="stat-lbl">&nbsp;bad</span></div>
            <div className="mini-stat"><span className="dot dot-blue"/><span className="stat-val">{naturalDone}</span><span className="stat-lbl">&nbsp;natural</span></div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-label">⭐ Level & XP</div>
          <div className="card-value" style={{color:'var(--emerald)'}}>Level {lv}</div>
          <div className="card-sub">{totalXP} XP · {lvp.toNext} to Level {lv+1}</div>
          <div className="ring-wrap">
            <svg className="ring-svg" width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#1c1c28" strokeWidth="6"/>
              <circle cx="28" cy="28" r="22" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="138.2" strokeDashoffset={ringOffset} strokeLinecap="round"/>
            </svg>
            <div className="ring-center"><div className="ring-pct">{lvp.pct}%</div><div className="ring-lbl">to Level {lv+1}</div></div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-label">🔥 Streak</div>
          <div style={{display:'flex',alignItems:'baseline',gap:6}}>
            <div className="card-value" style={{color:'var(--orange)'}}>{streak}</div>
            <div className="card-sub">days</div>
          </div>
          <div className="card-sub">Best: 14 days · Keep going!</div>
          <div style={{display:'flex',gap:4,marginTop:12}}>
            {Array.from({length:7}).map((_,i)=>(
              <div key={i} style={{width:8,height:8,borderRadius:'50%',background:i<streak%7?'var(--orange)':'var(--bg4)'}}/>
            ))}
          </div>
        </div>

        <div className="hero-card">
          <div className="card-label">📋 Progress</div>
          <div className="card-value">{doneCount}/{habits.length}</div>
          <div className="card-sub">tasks completed today</div>
          <div style={{marginTop:12}}>
            <div className="xp-bar-bg" style={{height:6}}><div className="xp-bar-fill" style={{width:`${pct}%`}}/></div>
            <div style={{fontSize:11,color:'var(--text3)',marginTop:4}}>{pct}% complete</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Today's Checklist</div>
          <button className="section-action" onClick={()=>setPage('checklist')}>View all →</button>
        </div>
        <div className="checklist-grid">
          {habits.slice(0,6).map((h:Habit)=><HabitItem key={h.id} h={h} onToggle={toggle}/>)}
        </div>
      </div>

      <div className="section">
        <div className="section-header"><div className="section-title">This Week</div></div>
        <div className="analytics-grid">
          <div className="chart-card" style={{gridColumn:'span 2'}}>
            <div className="chart-title">XP Trend</div>
            <div className="chart-sub">Daily score over the last 7 days</div>
            <div style={{position:'relative',height:120}}><canvas ref={xpRef}/></div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Habit Split</div>
            <div className="chart-sub">Good vs Bad this week</div>
            <div style={{position:'relative',height:120}}><canvas ref={splitRef}/></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Consistency Heatmap</div>
          <div style={{fontSize:11,color:'var(--text3)'}}>Last 98 days</div>
        </div>
        <div className="chart-card">
          <div className="heatmap-grid">
            {heatmap.map((lvl,i)=><div key={i} className={`hm-cell hm-${lvl}`}/>)}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:10}}>
            <span style={{fontSize:11,color:'var(--text3)'}}>Less</span>
            {[0,1,2,3,4].map(n=><div key={n} style={{width:10,height:10,borderRadius:2}} className={`hm-${n}`}/>)}
            <span style={{fontSize:11,color:'var(--text3)'}}>More</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header"><div className="section-title">Daily Report</div></div>
        <div className="reflection-card">
          <div className="refl-row">
            <div className="refl-item">
              <div className="refl-icon" style={{background:'#064e3b'}}>💪</div>
              <div className="refl-info">
                <div className="refl-label">Today's MVP</div>
                <div className="refl-val">{topGood ? `${topGood.icon} ${topGood.title}` : '—'}</div>
                <div className="refl-xp">+{topGood?.xp ?? 0} XP contribution</div>
              </div>
            </div>
            <div className="refl-item">
              <div className="refl-icon" style={{background:'#4c1d1d'}}>⚠️</div>
              <div className="refl-info">
                <div className="refl-label">Biggest Enemy</div>
                <div className="refl-val">{topBad ? `${topBad.icon} ${topBad.title}` : '—'}</div>
                <div className="refl-xp" style={{color:'var(--red)'}}>−{Math.abs(topBad?.xp ?? 0)} XP drain</div>
              </div>
            </div>
            <div className="refl-item">
              <div className="refl-icon" style={{background:'#1e3a5f'}}>🎯</div>
              <div className="refl-info">
                <div className="refl-label">Win Condition</div>
                <div className="refl-val" style={{color: winning?'var(--emerald)':'var(--orange)'}}>{winning?'🏆 Winning!':'⚡ In Progress'}</div>
                <div className="refl-xp">Need: Rank B, ≤2 bad habits</div>
              </div>
            </div>
            <div className="refl-item">
              <div className="refl-icon" style={{background:'#3b0764'}}>📊</div>
              <div className="refl-info">
                <div className="refl-label">Bonus XP Available</div>
                <div className="refl-val">+50 XP</div>
                <div className="refl-xp">Complete all checklist!</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div className="section-title">Recent Achievements</div>
          <button className="section-action" onClick={()=>setPage('achievements')}>View all →</button>
        </div>
        <div className="achievement-list">
          {ACHS.filter(a=>a.unlocked).map(a=><div key={a.id} className="ach-pill unlocked">{a.icon} {a.title}</div>)}
          {ACHS.filter(a=>!a.unlocked).slice(0,2).map(a=><div key={a.id} className="ach-pill locked">🔒 {a.title}</div>)}
        </div>
      </div>
    </div>
  );
}

function Checklist({score, rank, doneCount, pct, goodDone, badDone, naturalDone, habits, toggle}: any) {
  const good = habits.filter((h:Habit)=>h.cat==='good');
  const bad = habits.filter((h:Habit)=>h.cat==='bad');
  const nat = habits.filter((h:Habit)=>h.cat==='natural');
  return (
    <div>
      <div className="header">
        <div>
          <div className="greeting">Today's Match ⚔️</div>
          <div className="header-sub">Complete habits to increase your daily score</div>
        </div>
        <div className="header-right">
          <div className={`rank-badge rank-${rank}`}>Rank {rank}</div>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'10px 16px',fontSize:15,fontWeight:700,color:'var(--emerald)'}}>{score} XP</div>
        </div>
      </div>
      <div className="chart-card" style={{marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:600}}>Daily Progress</span>
          <span style={{fontSize:13,color:'var(--emerald)',fontWeight:600}}>{doneCount}/{habits.length} completed</span>
        </div>
        <div className="xp-bar-bg" style={{height:8,borderRadius:4}}>
          <div className="xp-bar-fill" style={{width:`${pct}%`}}/>
        </div>
        <div style={{display:'flex',gap:20,marginTop:12}}>
          <div className="mini-stat"><span className="dot dot-green"/><span className="stat-val">{goodDone}</span><span className="stat-lbl">&nbsp;Good Habit</span></div>
          <div className="mini-stat"><span className="dot dot-red"/><span className="stat-val">{badDone}</span><span className="stat-lbl">&nbsp;Bad Habit</span></div>
          <div className="mini-stat"><span className="dot dot-blue"/><span className="stat-val">{naturalDone}</span><span className="stat-lbl">&nbsp;Natural</span></div>
        </div>
      </div>
      <ChecklistSection title="🟢 Good Habits" color="var(--emerald)" items={good} toggle={toggle}/>
      <ChecklistSection title="⚪ Natural Activities" color="var(--blue)" items={nat} toggle={toggle}/>
      <ChecklistSection title="🔴 Bad Habits (tracked)" color="var(--red)" items={bad} toggle={toggle}/>
    </div>
  );
}

function ChecklistSection({title,color,items,toggle}:{title:string;color:string;items:Habit[];toggle:(id:number)=>void}) {
  return (
    <div className="section">
      <div className="section-header"><div className="section-title" style={{color}}>{title}</div></div>
      <div className="checklist-grid">{items.map(h=><HabitItem key={h.id} h={h} onToggle={toggle}/>)}</div>
    </div>
  );
}

function Analytics() {
  const [tab, setTab] = useState('weekly');
  const xpRef = useRef<HTMLCanvasElement>(null);
  const habitRef = useRef<HTMLCanvasElement>(null);
  const radarRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const days=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
    const scores=[120,245,180,160,90,200,185];
    const goodH=[6,12,9,8,5,10,8];
    const badH=[2,0,1,2,3,1,2];
    const c1 = xpRef.current && new Chart(xpRef.current, {type:'bar',data:{labels:days,datasets:[{data:scores,backgroundColor:scores.map(s=>s>=200?'#10b981':s>=150?'#3b82f6':'#f97316'),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'#ffffff08'},ticks:{color:'#5a5a6e',font:{size:11}}},y:{grid:{color:'#ffffff08'},ticks:{color:'#5a5a6e',font:{size:11}},min:0}}}});
    const c2 = habitRef.current && new Chart(habitRef.current, {type:'bar',data:{labels:days,datasets:[{label:'Good',data:goodH,backgroundColor:'#10b98188',borderRadius:4},{label:'Bad',data:badH,backgroundColor:'#ef444488',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{color:'#9898a8',font:{size:11},boxWidth:10}}},scales:{x:{grid:{color:'#ffffff08'},ticks:{color:'#5a5a6e',font:{size:11}}},y:{grid:{color:'#ffffff08'},ticks:{color:'#5a5a6e',font:{size:11}},min:0}}}});
    const c3 = radarRef.current && new Chart(radarRef.current, {type:'radar',data:{labels:['Health','Discipline','Learning','Mind','Career','Social'],datasets:[{data:[72,65,58,80,70,45],borderColor:'#a855f7',backgroundColor:'#a855f720',borderWidth:2,pointBackgroundColor:'#a855f7',pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{grid:{color:'#ffffff15'},ticks:{color:'#5a5a6e',font:{size:10},backdropColor:'transparent'},pointLabels:{color:'#9898a8',font:{size:11}},min:0,max:100}}}});
    return () => { c1?.destroy(); c2?.destroy(); c3?.destroy(); };
  }, []);
  return (
    <div>
      <div className="header"><div><div className="greeting">Analytics 📈</div><div className="header-sub">Your personal growth data</div></div></div>
      <div className="tabs">
        {['weekly','monthly','lifetime'].map(t=>(
          <div key={t} className={`tab${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</div>
        ))}
      </div>
      <div className="analytics-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div className="chart-card">
          <div className="chart-title">XP Trend — This Week</div>
          <div className="chart-sub">Daily XP score per day</div>
          <div style={{position:'relative',height:160}}><canvas ref={xpRef}/></div>
        </div>
        <div className="chart-card">
          <div className="chart-title">Good vs Bad Habits</div>
          <div className="chart-sub">Ratio this week</div>
          <div style={{position:'relative',height:160}}><canvas ref={habitRef}/></div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12,marginBottom:20}}>
        <div className="hero-card"><div className="card-label">Avg Score</div><div className="card-value" style={{color:'var(--blue)'}}>178</div><div className="card-sub">This week</div></div>
        <div className="hero-card"><div className="card-label">Best Day</div><div className="card-value" style={{color:'var(--emerald)'}}>Tue</div><div className="card-sub">245 XP</div></div>
        <div className="hero-card"><div className="card-label">Good Habits</div><div className="card-value" style={{color:'var(--emerald)'}}>78%</div><div className="card-sub">of checklist</div></div>
        <div className="hero-card"><div className="card-label">Bad Habits</div><div className="card-value" style={{color:'var(--red)'}}>18%</div><div className="card-sub">need reduction</div></div>
      </div>
      <div className="chart-card">
        <div className="chart-title">Character Stats</div>
        <div className="chart-sub">Your personal attributes based on habits</div>
        <div style={{position:'relative',height:200}}><canvas ref={radarRef}/></div>
      </div>
    </div>
  );
}

function Achievements() {
  return (
    <div>
      <div className="header"><div><div className="greeting">Achievements 🏆</div><div className="header-sub">Unlock badges by building habits</div></div></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        {ACHS.map(a=>(
          <div key={a.id} style={{background:'var(--bg2)',border:`1px solid ${a.unlocked?'#eab30844':'var(--border)'}`,borderRadius:'var(--radius-lg)',padding:20,opacity:a.unlocked?1:.6}}>
            <div style={{fontSize:32,marginBottom:10}}>{a.icon}</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:4,color:a.unlocked?'var(--yellow)':'var(--text)'}}>{a.title}</div>
            <div style={{fontSize:12,color:'var(--text3)',marginBottom:8}}>{a.desc}</div>
            <div style={{fontSize:11,fontWeight:600,color:a.unlocked?'var(--yellow)':'var(--text3)'}}>+{a.xp} XP {a.unlocked?'· UNLOCKED ✓':'· LOCKED'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reflection({onSave}:{onSave:()=>void}) {
  const [mood, setMood] = useState<number|null>(null);
  const [good, setGood] = useState('');
  const [bad, setBad] = useState('');
  const [tom, setTom] = useState('');
  const taStyle: React.CSSProperties = {width:'100%',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:12,color:'var(--text)',fontSize:13,resize:'vertical',minHeight:80,fontFamily:'inherit'};
  return (
    <div>
      <div className="header"><div><div className="greeting">Daily Reflection 📝</div><div className="header-sub">Evaluate and plan for tomorrow</div></div></div>
      <div className="reflection-card" style={{maxWidth:640}}>
        <Field label="Apa yang berjalan baik hari ini?"><textarea value={good} onChange={e=>setGood(e.target.value)} style={taStyle} placeholder="Ceritakan pencapaian hari ini..."/></Field>
        <Field label="Apa yang menghambat?"><textarea value={bad} onChange={e=>setBad(e.target.value)} style={taStyle} placeholder="Hambatan hari ini..."/></Field>
        <Field label="Target besok?"><textarea value={tom} onChange={e=>setTom(e.target.value)} style={taStyle} placeholder="Rencana untuk besok..."/></Field>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:12,color:'var(--text2)'}}>Mood hari ini?</div>
          <div style={{display:'flex',gap:12}}>
            {['😴','😐','🙂','😊','🤩'].map((e,i)=>(
              <div key={i} onClick={()=>setMood(i+1)} style={{padding:'8px 16px',borderRadius:20,cursor:'pointer',fontSize:18,background:'var(--bg3)',border:`1px solid ${mood===i+1?'var(--emerald)':'var(--border)'}`}}>{e}</div>
            ))}
          </div>
        </div>
        <button onClick={()=>{onSave();alert('Reflection saved! +15 XP');}} style={{background:'var(--emerald)',color:'#000',border:'none',borderRadius:'var(--radius-sm)',padding:'12px 24px',fontSize:13,fontWeight:600,cursor:'pointer',width:'100%'}}>Save Reflection +15 XP</button>
      </div>
    </div>
  );
}

function Field({label, children}:{label:string;children:React.ReactNode}) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:8,color:'var(--text2)'}}>{label}</div>
      {children}
    </div>
  );
}

function Calendar() {
  const dayNames=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const start=new Date(); start.setDate(1);
  const offset = start.getDay();
  const daysInMonth=new Date(start.getFullYear(),start.getMonth()+1,0).getDate();
  const cells: (number|null)[] = [...Array(offset).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
  const todayD = new Date().getDate();
  const scores = useMemo(()=>cells.map(()=>[0,80,140,185,245][Math.floor(Math.random()*5)]),[]);
  return (
    <div>
      <div className="header"><div><div className="greeting">Calendar 📅</div><div className="header-sub">Your activity history</div></div></div>
      <div className="chart-card">
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
          {dayNames.map(d=><div key={d} style={{fontSize:11,color:'var(--text3)',fontWeight:600,textAlign:'center',padding:'4px 0'}}>{d}</div>)}
          {cells.map((d,i)=>{
            if (d===null) return <div key={i}/>;
            const isToday = d===todayD;
            const score = scores[i];
            return <div key={i} title={`Day ${d}: ${score} XP`} style={{textAlign:'center',padding:'8px 4px',borderRadius:'var(--radius-sm)',cursor:'pointer',fontSize:13,background:isToday?'#10b98122':score>200?'var(--emerald-d)':score>100?'var(--blue-d)':'var(--bg3)',color:isToday?'var(--emerald)':'var(--text2)',fontWeight:isToday?700:400,border:isToday?'1px solid var(--emerald)':'1px solid transparent'}}>{d}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const exp = () => {
    const data = localStorage.getItem(STORAGE_KEY) || '{}';
    const blob = new Blob([data],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='lifeos-backup.json'; a.click();
  };
  const reset = () => { if(confirm('Delete ALL LifeOS data?')) { localStorage.removeItem(STORAGE_KEY); location.reload(); } };
  const btn: React.CSSProperties = {background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:12,color:'var(--text)',cursor:'pointer',fontSize:13,fontWeight:500,textAlign:'left'};
  return (
    <div>
      <div className="header"><div><div className="greeting">Settings ⚙️</div><div className="header-sub">Manage your LifeOS data</div></div></div>
      <div className="reflection-card" style={{maxWidth:480}}>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Storage</div>
          <div style={{fontSize:12,color:'var(--text3)'}}>Using local browser storage</div>
        </div>
        <div className="divider" style={{marginBottom:16}}/>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <button onClick={exp} style={btn}>📤 Export JSON Backup</button>
          <button onClick={()=>alert('Select a LifeOS JSON backup file to import.')} style={btn}>📥 Import JSON Backup</button>
          <div className="divider"/>
          <button onClick={reset} style={{...btn,border:'1px solid #ef444444',color:'var(--red-l)',background:'var(--red-d)'}}>⚠️ Factory Reset</button>
        </div>
        <div style={{marginTop:20,fontSize:11,color:'var(--text3)',textAlign:'center'}}>LifeOS v1.0.0 · All data stored locally · No server, no tracking</div>
      </div>
    </div>
  );
}

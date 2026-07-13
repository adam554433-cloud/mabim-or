"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Star = {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  gold: boolean;
};

type Sparkle = {
  x: number;
  delay: number;
  duration: number;
  size: number;
};

type Portal = {
  key: string;
  name: string;
  tag: string;
  accent: string;
  href?: string;
  live: boolean;
  delay: number;
};

const PORTALS: Portal[] = [
  {
    key: "puzzle",
    name: "הפאזל",
    tag: "ניצוצות בפעולה",
    accent: "#fbbf24",
    href: "/puzzle",
    live: true,
    delay: 0.14,
  },
  {
    key: "tzofen",
    name: "הצופן",
    tag: "מדריך לחיים משמעותיים",
    accent: "#a78bfa",
    href: "/portal",
    live: true,
    delay: 0.2,
  },
  {
    key: "orokomo",
    name: "אורוקומו",
    tag: "בואו, שווה פה",
    accent: "#2dd4bf",
    live: false,
    delay: 0.26,
  },
  {
    key: "tachles",
    name: "ת'כלס",
    tag: "0 סובלנות לפשע",
    accent: "#fb7185",
    live: false,
    delay: 0.32,
  },
];

function SparkMark({ size, id }: { size: number; id: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="1" stopColor="#CAA928" />
        </linearGradient>
      </defs>
      <path
        d="M0,-44 C6,-14 14,-6 44,0 C14,6 6,14 0,44 C-6,14 -14,6 -44,0 C-14,-6 -6,-14 0,-44 Z"
        fill={`url(#${id})`}
      />
      <path
        className="hub-logo-inner"
        d="M0,-44 C6,-14 14,-6 44,0 C14,6 6,14 0,44 C-6,14 -14,6 -44,0 C-14,-6 -6,-14 0,-44 Z"
        fill="#FFD345"
        opacity=".5"
        transform="rotate(45) scale(.55)"
      />
    </svg>
  );
}

export default function PortalHub() {
  const [user, setUser] = useState<User | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 520px)").matches;
    const n = mobile ? 70 : 130;
    // Random star positions must be generated client-side only, otherwise the
    // server and client render different markup and hydration fails.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(
      Array.from({ length: n }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
        gold: Math.random() < 0.34,
      })),
    );
    if (!reduce) {
      setSparkles(
        Array.from({ length: 14 }, () => ({
          x: Math.random() * 100,
          delay: Math.random() * 9,
          duration: 8 + Math.random() * 8,
          size: 8 + Math.random() * 11,
        })),
      );
    }
  }, []);

  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";

  return (
    <div className="hub-root">
      <style dangerouslySetInnerHTML={{ __html: HUB_CSS }} />

      <div className="hub-stars" aria-hidden="true">
        {stars.map((s, i) => (
          <i
            key={i}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              ...(s.gold
                ? { background: "#FFD345", boxShadow: "0 0 6px #FFD345" }
                : {}),
            }}
          />
        ))}
      </div>
      <div className="hub-sparkles" aria-hidden="true">
        {sparkles.map((s, i) => (
          <b
            key={i}
            style={{
              left: `${s.x}%`,
              fontSize: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          >
            ✦
          </b>
        ))}
      </div>

      <div className="hub-wrap">
        <header className="hub-topbar">
          <div className="hub-brand">
            <SparkMark size={24} id="hub-bm" />
            קוד26 <small>Cod26</small>
          </div>
          {user ? (
            <Link className="hub-auth" href="/profile">
              <span aria-hidden>💛</span>
              {displayName || "האור שלי"}
            </Link>
          ) : (
            <Link className="hub-auth" href="/login">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="8" r="3.4" />
                <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
              </svg>
              התחברות / הרשמה
            </Link>
          )}
        </header>

        <main className="hub-hero">
          <div className="hub-logo">
            <SparkMark size={84} id="hub-lg" />
          </div>
          <h1 className="hub-title">
            קוד26 <span>Cod26</span>
          </h1>
          <p className="hub-subtitle">דיבור חדש / עדכון גרסא לדור הבא</p>
        </main>

        <section className="hub-portals" aria-label="בחירת פורטל">
          {PORTALS.map((p) =>
            p.live && p.href ? (
              <Link
                key={p.key}
                href={p.href}
                className="hub-portal live"
                style={
                  {
                    "--accent": p.accent,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties
                }
              >
                <span className="hub-pbadge">חי</span>
                <span className="hub-orb" />
                <span className="hub-pname">{p.name}</span>
                <span className="hub-ptag">{p.tag}</span>
                <span className="hub-pcta">להיכנס ←</span>
              </Link>
            ) : (
              <div
                key={p.key}
                className="hub-portal soon"
                style={
                  {
                    "--accent": p.accent,
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties
                }
                aria-disabled="true"
              >
                <span className="hub-pbadge">בקרוב</span>
                <span className="hub-orb" />
                <span className="hub-pname">{p.name}</span>
                <span className="hub-ptag">{p.tag}</span>
              </div>
            ),
          )}
        </section>

        <footer className="hub-footer">
          קוד26 · כל הפורטלים תחת קורת גג אחת — חשבון אחד, גישה לכולם ✦
        </footer>
      </div>
    </div>
  );
}

const HUB_CSS = `
.hub-root{
  position:relative; min-height:100vh; overflow-x:hidden; color:#fff;
  background:radial-gradient(120% 80% at 50% -10%, #3a2a07 0%, #1c1403 34%, #0a0700 64%, #000 100%);
}
.hub-root::before{ content:""; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(40% 30% at 22% 70%, rgba(124,58,237,.16), transparent 70%),
    radial-gradient(42% 32% at 80% 64%, rgba(45,212,191,.12), transparent 70%),
    radial-gradient(50% 40% at 50% 4%, rgba(251,191,36,.20), transparent 70%);
  filter:blur(8px); }
.hub-stars,.hub-sparkles{ position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
.hub-stars i{ position:absolute; border-radius:50%; background:#fff; opacity:.5; animation:hubTwinkle linear infinite; }
.hub-sparkles b{ position:absolute; bottom:-24px; color:#FFD345; opacity:0; font-weight:400;
  text-shadow:0 0 12px rgba(255,211,69,.8); animation:hubFloatUp linear infinite; }
.hub-wrap{ position:relative; z-index:2; display:flex; flex-direction:column; min-height:100vh; }

.hub-topbar{ display:flex; align-items:center; justify-content:space-between; padding:18px clamp(18px,4vw,42px); }
.hub-brand{ display:flex; align-items:center; gap:8px; font-weight:800; font-size:17px; color:#FDE494; }
.hub-brand small{ color:rgba(253,228,148,.5); font-weight:700; font-size:13px; }
.hub-auth{ display:inline-flex; align-items:center; gap:7px; font-size:14px; font-weight:700; color:#FDE494;
  background:rgba(255,255,255,.04); border:1px solid rgba(251,191,36,.35); border-radius:999px; padding:8px 16px;
  cursor:pointer; text-decoration:none; transition:.18s ease; backdrop-filter:blur(6px); }
.hub-auth:hover{ border-color:#fbbf24; color:#fff; box-shadow:0 0 22px -4px rgba(251,191,36,.6); transform:translateY(-1px); }

.hub-hero{ text-align:center; padding:26px 20px 8px; }
.hub-logo{ animation:hubRise .8s ease both; }
.hub-logo svg{ filter:drop-shadow(0 0 22px rgba(255,211,69,.55)); animation:hubGlowPulse 3.4s ease-in-out infinite; }
.hub-logo-inner{ transform-origin:center; animation:hubSpinSlow 26s linear infinite; }
.hub-title{ font-size:clamp(46px,8.5vw,82px); font-weight:900; letter-spacing:-1.5px; line-height:1; margin-top:10px;
  background:linear-gradient(180deg,#FFEFC0 0%,#fbbf24 55%,#CAA928 100%); -webkit-background-clip:text; background-clip:text; color:transparent;
  filter:drop-shadow(0 3px 26px rgba(251,191,36,.4)); animation:hubRise .8s .05s ease both; }
.hub-title span{ -webkit-text-fill-color:rgba(253,228,148,.45); color:rgba(253,228,148,.45); font-weight:700; font-size:.5em; margin-inline-start:.28em; letter-spacing:0; }
.hub-subtitle{ font-size:clamp(16px,2.4vw,21px); color:rgba(253,228,148,.78); margin-top:14px; font-weight:400; animation:hubRise .8s .1s ease both; }

.hub-portals{ max-width:1080px; width:100%; margin:0 auto; padding:42px clamp(18px,4vw,42px) 24px;
  display:grid; gap:20px; grid-template-columns:repeat(4,1fr); }
.hub-portal{ position:relative; display:flex; flex-direction:column; align-items:center; text-align:center;
  background:rgba(255,255,255,.035); border:1px solid rgba(251,191,36,.16); border-radius:20px;
  padding:30px 18px 26px; text-decoration:none; color:inherit; backdrop-filter:blur(8px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.05); transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  animation:hubRise .7s ease both; overflow:hidden; }
.hub-portal::after{ content:""; position:absolute; inset:0; border-radius:20px; pointer-events:none;
  background:radial-gradient(80% 60% at 50% 0%, color-mix(in srgb,var(--accent) 22%, transparent), transparent 70%); opacity:0; transition:opacity .22s ease; }
.hub-portal.live:hover{ transform:translateY(-8px); border-color:var(--accent);
  box-shadow:0 22px 52px rgba(0,0,0,.55), 0 0 34px -8px var(--accent); }
.hub-portal.live:hover::after{ opacity:1; }
.hub-orb{ width:56px; height:56px; border-radius:50%; margin-bottom:16px; position:relative;
  background:radial-gradient(circle at 38% 33%, #fff, var(--accent) 55%, color-mix(in srgb,var(--accent) 30%, #000) 100%);
  box-shadow:0 0 26px -3px var(--accent), inset 0 0 10px -3px rgba(255,255,255,.7); transition:transform .2s ease, box-shadow .2s ease; }
.hub-portal.live:hover .hub-orb{ transform:scale(1.08); box-shadow:0 0 38px -2px var(--accent), inset 0 0 12px -3px rgba(255,255,255,.8); }
.hub-pname{ font-size:26px; font-weight:800; letter-spacing:-.3px; color:#fff; }
.hub-ptag{ font-size:13.5px; color:rgba(253,228,148,.6); margin-top:8px; line-height:1.45; min-height:38px; }
.hub-pcta{ margin-top:16px; font-size:13px; font-weight:800; color:var(--accent); opacity:0; transform:translateY(5px); transition:.2s ease; }
.hub-portal.live:hover .hub-pcta{ opacity:1; transform:translateY(0); }
.hub-pbadge{ position:absolute; top:13px; inset-inline-start:13px; font-size:10.5px; font-weight:800; padding:3px 10px; border-radius:999px; letter-spacing:.3px; }
.hub-portal.live .hub-pbadge{ background:rgba(34,197,94,.16); color:#86efac; border:1px solid rgba(134,239,172,.3); }
.hub-portal.soon{ opacity:.62; }
.hub-portal.soon .hub-pbadge{ background:rgba(255,255,255,.06); color:rgba(255,255,255,.55); border:1px dashed rgba(255,255,255,.25); }
.hub-portal.soon .hub-pname{ color:rgba(255,255,255,.72); }
.hub-portal.soon .hub-orb{ filter:saturate(.6) brightness(.8); }

.hub-footer{ margin-top:auto; text-align:center; padding:28px 20px 32px; color:rgba(253,228,148,.4); font-size:12.5px; }

@keyframes hubRise{ from{ opacity:0; transform:translateY(16px);} to{ opacity:1; transform:translateY(0);} }
@keyframes hubTwinkle{ 0%,100%{ opacity:.2; transform:scale(.7);} 50%{ opacity:1; transform:scale(1.25);} }
@keyframes hubFloatUp{ 0%{ transform:translateY(0) rotate(0); opacity:0; } 12%{ opacity:.9; } 88%{ opacity:.7; } 100%{ transform:translateY(-104vh) rotate(40deg); opacity:0; } }
@keyframes hubGlowPulse{ 0%,100%{ filter:drop-shadow(0 0 18px rgba(255,211,69,.4)); } 50%{ filter:drop-shadow(0 0 30px rgba(255,211,69,.75)); } }
@keyframes hubSpinSlow{ to{ transform:rotate(360deg); } }

@media (max-width:880px){ .hub-portals{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:520px){
  .hub-portals{ grid-template-columns:1fr; gap:14px; padding-top:28px; }
  .hub-portal{ flex-direction:row; align-items:center; text-align:right; gap:15px; padding:18px 16px; padding-inline-end:64px; }
  .hub-orb{ margin-bottom:0; flex:0 0 auto; width:46px; height:46px; }
  .hub-ptag{ min-height:0; margin-top:3px; }
  .hub-pcta{ display:none; }
  .hub-pbadge{ inset-inline-start:auto; inset-inline-end:13px; top:50%; transform:translateY(-50%); }
}
@media (prefers-reduced-motion:reduce){
  .hub-root *{ animation:none !important; transition:none !important; }
}
`;

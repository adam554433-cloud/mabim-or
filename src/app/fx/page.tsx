"use client";

import { useState, useEffect, useRef } from "react";
import SiteNav from "@/components/SiteNav";
import Sparkle from "@/components/fx/Sparkle";
import SparkleIcon from "@/components/fx/SparkleIcon";
import SparkField from "@/components/fx/SparkField";
import PulseDot from "@/components/fx/PulseDot";
import OnePulse from "@/components/fx/OnePulse";
import FlySpark from "@/components/fx/FlySpark";
import AssemblingText from "@/components/fx/AssemblingText";
import ProgressConstellation, {
  ConstellationStep,
} from "@/components/fx/ProgressConstellation";
import CoreOrb from "@/components/fx/CoreOrb";
import LightSphere from "@/components/fx/LightSphere";

type CardProps = {
  title: string;
  filename: string;
  description: string;
  usedIn?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  bg?: string;
  minHeight?: number;
};

function Card({
  title,
  filename,
  description,
  usedIn,
  children,
  controls,
  bg = "linear-gradient(180deg,#080500,#050300)",
  minHeight = 280,
}: CardProps) {
  return (
    <section
      className="rounded-2xl border border-yellow-400/15 overflow-hidden"
      style={{
        background: "rgba(20,12,0,0.5)",
        contentVisibility: "auto",
        containIntrinsicSize: `0 ${minHeight + 120}px`,
      }}
    >
      <header className="px-5 py-3 border-b border-yellow-400/10 flex items-baseline justify-between flex-wrap gap-2">
        <div className="text-right">
          <h2 className="text-yellow-400 font-bold text-lg">{title}</h2>
          <p className="text-amber-400/60 text-xs mt-0.5">{description}</p>
        </div>
        <div className="text-left">
          <code className="text-[10px] text-amber-300/40 font-mono">
            {filename}
          </code>
          {usedIn && (
            <div className="text-[10px] text-amber-400/40 mt-0.5">
              בשימוש: {usedIn}
            </div>
          )}
        </div>
      </header>

      <div
        className="relative flex items-center justify-center px-4 py-8"
        style={{ background: bg, minHeight }}
      >
        {children}
      </div>

      {controls && (
        <div className="px-5 py-3 border-t border-yellow-400/10 flex flex-wrap gap-3 items-center justify-end">
          {controls}
        </div>
      )}
    </section>
  );
}

function Btn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-yellow-400 text-black font-bold px-4 py-1.5 rounded-full text-sm hover:scale-105 transition-all"
      style={{ boxShadow: "0 0 16px rgba(251,191,36,0.3)" }}
    >
      {children}
    </button>
  );
}

const DEMO_STEPS: ConstellationStep[] = [
  { label: "הצטרפת לקהילה", sub: "נקודה ראשונה הוצתה", done: true },
  { label: "אתגר ראשון", sub: "חלקת מעשה טוב", done: true },
  { label: "5 הגשות", sub: "בדרך לחמש", done: false, active: true },
  { label: "10 הגשות", sub: "עוד 5 לסיום", done: false },
  { label: "מנטור קהילה", sub: "פתוח אחרי 25", done: false },
];

export default function FxShowcase() {
  const [pulse1, setPulse1] = useState<number | null>(null);
  const [pulse2, setPulse2] = useState<number | null>(null);
  const [fly, setFly] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(0.4);
  const [orbPulse, setOrbPulse] = useState<number | null>(null);
  const [assembleKey, setAssembleKey] = useState(0);

  return (
    <main className="min-h-screen pb-20">
      <SiteNav />

      <header className="text-center px-5 py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 mb-2">
          ספריית אנימציות
        </h1>
        <p className="text-amber-400/70 max-w-xl mx-auto">
          כל האפקטים הוויזואליים של "מביאים אור" במקום אחד. רובם בשימוש בעמודים
          חיים, חלקם מחכים להיכנס.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Sparkle (the big hero one) */}
        <Card
          title="Sparkle — ניצוץ ראשי"
          filename="src/components/fx/Sparkle.tsx"
          description="הניצוץ הגדול של ה־Hero — סובב, נושם, עם 4 ניצוצות קטנים סביבו."
          usedIn="HeroSection"
        >
          <Sparkle size={96} />
        </Card>

        {/* SparkleIcon */}
        <Card
          title="SparkleIcon — אייקון ניצוץ"
          filename="src/components/fx/SparkleIcon.tsx"
          description="SVG קטן עם זוהר עדין. שימוש בכפתורים, ניווט, רשימות."
          usedIn="SiteNav, MenuDrawer, WeeklyChallenge"
        >
          <div className="flex items-end gap-6">
            <SparkleIcon size={18} />
            <SparkleIcon size={28} />
            <SparkleIcon size={42} />
            <SparkleIcon size={56} />
          </div>
        </Card>

        {/* LightSphere — 3D particle sphere */}
        <Card
          title="LightSphere — כדור ניצוצות תלת־מימדי (זהב)"
          filename="src/components/fx/LightSphere.tsx"
          description="כדור 3D שבכל פריים מתווספים אליו 8 ניצוצות חדשים, נצמדים לרגע, ואז מתפזרים החוצה. הכדור מסתובב לאט סביב ציר אנכי."
          minHeight={400}
          bg="#000000"
        >
          <LightSphere size={360} />
        </Card>

        {/* LightSphere — purple variant */}
        <Card
          title="LightSphere — וריאציה סגולה"
          filename="src/components/fx/LightSphere.tsx"
          description="אותה אנימציה עם פלטת brand-purple (#8A26ED) מה־Cod26."
          minHeight={400}
          bg="#000000"
        >
          <LightSphere
            size={360}
            primaryColor={{ r: 138, g: 38, b: 237 }}
            palette={[
              { r: 182, g: 139, b: 255 }, // lavender highlight
              { r: 211, g: 246, b: 19 },  // brand-lime accent
              { r: 88, g: 152, b: 255 },  // brand-blue accent
            ]}
            coreColor={{ r: 245, g: 230, b: 255 }} // soft white-violet
          />
        </Card>

        {/* CoreOrb */}
        <Card
          title="CoreOrb — גוף האור המרכזי"
          filename="src/components/fx/CoreOrb.tsx"
          description="כדור אור נושם שגדל עם intensity, עם ניצוצות במסלולים מסביבו. pulseTrigger יורה גל חד־פעמי."
          usedIn="page.tsx (מעל הפאזל)"
          minHeight={340}
          controls={
            <>
              <label className="text-amber-400/70 text-xs flex items-center gap-2">
                intensity
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="accent-yellow-400"
                />
                <span className="font-mono text-amber-300/80 w-10 text-right">
                  {intensity.toFixed(2)}
                </span>
              </label>
              <Btn onClick={() => setOrbPulse(Date.now())}>פעימה</Btn>
            </>
          }
        >
          <CoreOrb intensity={intensity} pulseTrigger={orbPulse} size={140} />
        </Card>

        {/* SparkField */}
        <Card
          title="SparkField — שדה ניצוצות מחוברים"
          filename="src/components/fx/SparkField.tsx"
          description="Canvas של 40-140 ניצוצות שמרחפים, מתחברים בקווים, ונמשכים לעכבר. רעש רקע אטמוספרי."
          usedIn="HeroSection, portal/page.tsx"
          minHeight={300}
          bg="#050300"
        >
          <div className="absolute inset-0">
            <SparkField
              density={0.1}
              maxDistance={120}
              speed={0.22}
              fade={false}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="relative text-amber-400/70 text-sm">
            הזז את העכבר מעל
          </div>
        </Card>

        {/* PulseDot */}
        <Card
          title="PulseDot — נקודה פועמת"
          filename="src/components/fx/PulseDot.tsx"
          description="נקודה זוהרת עם טבעות שמתפשטות אינסופית. שימושית כסטטוס חי."
          usedIn="profile/page.tsx"
        >
          <div className="flex items-center gap-12">
            <PulseDot size={14} rings={3} speed={2.2} />
            <PulseDot size={28} rings={3} speed={2.6} />
            <PulseDot size={48} rings={2} speed={3.0} />
          </div>
        </Card>

        {/* OnePulse */}
        <Card
          title="OnePulse — פעימה חד־פעמית"
          filename="src/components/fx/OnePulse.tsx"
          description="גל פעימה שנורה רק כשה־trigger משתנה. שימוש לפידבק על פעולה."
          usedIn="HeroSection (על מספר המונה)"
          controls={<Btn onClick={() => setPulse1(Date.now())}>פעמיה</Btn>}
        >
          <div className="flex items-center gap-12">
            <span className="relative inline-flex items-center justify-center w-20 h-20">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  background: "#fbbf24",
                  boxShadow: "0 0 12px #fbbf24",
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <OnePulse trigger={pulse1} size={20} rings={2} duration={1.3} />
              </span>
            </span>
            <span className="relative inline-flex items-center justify-center w-32 h-32">
              <span className="text-5xl font-extrabold text-yellow-400 tabular-nums">
                42
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <OnePulse trigger={pulse1} size={42} rings={3} duration={1.7} />
              </span>
            </span>
          </div>
        </Card>

        {/* FlySpark */}
        <Card
          title="FlySpark — ניצוץ עף ליעד"
          filename="src/components/fx/FlySpark.tsx"
          description="ניצוץ זוהר שעף מתחתית המסך אל קואורדינטה (אחוז) על ההורה ומתפוצץ."
          usedIn="page.tsx (אחרי הגשה — עף אל הנקודה בפאזל)"
          minHeight={300}
          controls={
            <>
              <Btn onClick={() => setFly(Math.random())}>ירה ניצוץ</Btn>
              <span className="text-amber-400/50 text-xs">
                ייעף לנקודה אקראית בכל פעם
              </span>
            </>
          }
        >
          <div className="absolute inset-0">
            <FlySpark
              trigger={fly}
              targetXPct={20 + Math.random() * 60}
              targetYPct={20 + Math.random() * 50}
            />
          </div>
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 gap-1 p-4 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  background: "rgba(251,191,36,0.08)",
                  width: 4,
                  height: 4,
                  alignSelf: "center",
                  justifySelf: "center",
                }}
              />
            ))}
          </div>
        </Card>

        {/* AssemblingText */}
        <Card
          title="AssemblingText — מילה מורכבת מניצוצות"
          filename="src/components/fx/AssemblingText.tsx"
          description="חלקיקים מתפזרים סביב הטקסט ומתכנסים אליו ככיתוב, ואז ממשיכים לנצנץ עדין."
          usedIn="WelcomeModal"
          minHeight={220}
          controls={<Btn onClick={() => setAssembleKey((k) => k + 1)}>הרכב מחדש</Btn>}
        >
          <div key={assembleKey}>
            <AssemblingText
              text="ניצוצות"
              fontSize={88}
              fontWeight={800}
              color="#fbbf24"
              density={3}
              duration={1800}
            />
          </div>
        </Card>

        {/* OnePulse — combined demo with both */}
        <Card
          title="OnePulse + מספר — כמו בתצוגה האמיתית"
          filename="src/components/fx/OnePulse.tsx"
          description="הסיטואציה המדויקת מ־HeroSection — מספר שגדל בכל לחיצה ופועם סביבו."
          controls={<Btn onClick={() => setPulse2(Date.now())}>הוסף +1</Btn>}
        >
          <CounterDemo bumpTrigger={pulse2} />
        </Card>

        {/* ProgressConstellation */}
        <Card
          title="ProgressConstellation — מסע ככוכבים"
          filename="src/components/fx/ProgressConstellation.tsx"
          description="רשימת אבני־דרך אנכית. כל שלב: כוכב הושלם (זוהר), פעיל (טבעת פועמת), או עתידי (קווי מתאר)."
          usedIn="profile/page.tsx"
          minHeight={360}
        >
          <ProgressConstellation steps={DEMO_STEPS} title="המסע שלך" />
        </Card>
      </div>

      <footer className="text-center text-amber-400/40 text-xs mt-12 px-4">
        כל הרכיבים תחת{" "}
        <code className="font-mono text-amber-300/60">src/components/fx/</code>
      </footer>
    </main>
  );
}

function CounterDemo({ bumpTrigger }: { bumpTrigger: number | null }) {
  const [n, setN] = useState(1247);
  const lastTriggerRef = useRef<number | null>(null);

  useEffect(() => {
    if (bumpTrigger !== null && bumpTrigger !== lastTriggerRef.current) {
      lastTriggerRef.current = bumpTrigger;
      setN((v) => v + 1);
    }
  }, [bumpTrigger]);

  return (
    <span className="relative inline-block">
      <span
        className="block text-5xl sm:text-6xl font-extrabold text-yellow-400 tabular-nums"
        style={{ textShadow: "0 0 30px rgba(251,191,36,.8)" }}
      >
        {n.toLocaleString("he-IL")}
      </span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <OnePulse trigger={bumpTrigger} size={36} rings={3} duration={1.6} />
      </span>
    </span>
  );
}

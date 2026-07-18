import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "./supabase.js";

// ── Íconos (SVG en línea, estilo lucide) ───────────────────────────────
const PATHS = {
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
  play:'<polygon points="6 3 20 12 6 21 6 3"/>',
  chevronLeft:'<path d="m15 18-6-6 6-6"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  sparkles:'<path d="M12 3l1.9 4.8L18.7 9.7l-4.8 1.9L12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9z"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  book:'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  sprout:'<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  settings:'<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  calendar:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  chart:'<path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect x="7" y="10" width="3" height="7" rx="1"/><rect x="12" y="6" width="3" height="11" rx="1"/><rect x="17" y="13" width="3" height="4" rx="1"/>',
  layers:'<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',
  volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  folder:'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  arrowUp:'<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  arrowDown:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
};
function Icon({ name, size = 18, color = "currentColor", fill = "none", style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" style={style} dangerouslySetInnerHTML={{ __html: PATHS[name] }} />;
}
const mk_ = (n) => (p) => <Icon name={n} {...p} />;
const Plus=mk_('plus'), Play=mk_('play'), ChevronLeft=mk_('chevronLeft'), Trash2=mk_('trash'),
  Pencil=mk_('pencil'), X=mk_('x'), Check=mk_('check'), Sparkles=mk_('sparkles'), Flame=mk_('flame'),
  BookOpen=mk_('book'), Sprout=mk_('sprout'), Settings2=mk_('settings'), Info=mk_('info'),
  CalendarDays=mk_('calendar'), Trophy=mk_('trophy'), Upload=mk_('upload'), BarChart=mk_('chart'), Layers=mk_('layers'),
  Volume2=mk_('volume'), Folder=mk_('folder'), ArrowUp=mk_('arrowUp'), ArrowDown=mk_('arrowDown'), Search=mk_('search'), Download=mk_('download'), Target=mk_('target');

// ── Sincronización con la nube (Supabase) ──────────────────────────────
const chunk = (arr, n) => { const out=[]; for(let i=0;i<arr.length;i+=n) out.push(arr.slice(i,i+n)); return out; };

// Instantánea del estado para poder calcular qué cambió
const deckJson = (d, pos) => JSON.stringify({ name:d.name, emoji:d.emoji, color:d.color, settings:{...d.settings, daily:d.daily}, pos });
const cardData = (c, pos) => { const { id, ...rest } = c; return { ...rest, pos }; };
function snapshotOf(decks) {
  const m = new Map();
  decks.forEach((d, di) => {
    const cards = new Map();
    d.cards.forEach((c, ci) => cards.set(c.id, JSON.stringify(cardData(c, ci))));
    m.set(d.id, { d: deckJson(d, di), c: cards });
  });
  return m;
}
// Escribe en Supabase solo lo que cambió respecto a la última instantánea
async function syncToCloud(decks, snap) {
  const now_ = new Date().toISOString();
  const deckUps = [], cardUps = [], cardDels = [], deckDels = [];
  const allCardIds = new Set();
  decks.forEach((d) => d.cards.forEach((c) => allCardIds.add(c.id)));
  const seen = new Set();
  decks.forEach((d, di) => {
    seen.add(d.id);
    const prev = snap.get(d.id);
    const dj = deckJson(d, di);
    if (!prev || prev.d !== dj)
      deckUps.push({ id:d.id, name:d.name, emoji:d.emoji, color:d.color, settings:{...d.settings, daily:d.daily, pos:di}, updated_at:now_ });
    const prevCards = prev ? prev.c : new Map();
    d.cards.forEach((c, ci) => {
      const data = cardData(c, ci);
      if (prevCards.get(c.id) !== JSON.stringify(data))
        cardUps.push({ id:c.id, deck_id:d.id, data, updated_at:now_ });
    });
    for (const id of prevCards.keys()) if (!allCardIds.has(id)) cardDels.push(id);
  });
  for (const id of snap.keys()) if (!seen.has(id)) deckDels.push(id);

  if (deckUps.length) for (const g of chunk(deckUps, 20)) { const { error } = await supabase.from("decks").upsert(g); if (error) throw error; }
  if (cardUps.length) for (const g of chunk(cardUps, 20)) { const { error } = await supabase.from("cards").upsert(g); if (error) throw error; }
  if (cardDels.length) for (const g of chunk(cardDels, 100)) { const { error } = await supabase.from("cards").delete().in("id", g); if (error) throw error; }
  if (deckDels.length) { const { error } = await supabase.from("decks").delete().in("id", deckDels); if (error) throw error; }
  return deckUps.length + cardUps.length + cardDels.length + deckDels.length;
}
// Al restaurar un respaldo, los identificadores viejos se cambian por otros válidos
function remapBackup(data) {
  const dMap = new Map(), cMap = new Map(), nMap = new Map();
  const decks = (data.decks || []).map((d) => {
    const nid = uid(); dMap.set(d.id, nid);
    const cards = (d.cards || []).map((c) => {
      const cid = uid(); cMap.set(c.id, cid);
      let noteId = c.noteId || null;
      if (noteId) { if (!nMap.has(noteId)) nMap.set(noteId, uid()); noteId = nMap.get(noteId); }
      return { ...c, id:cid, noteId };
    });
    return { ...d, id:nid, cards };
  });
  const log = (Array.isArray(data.log) ? data.log : []).map((e) => ({
    ...e, deck: dMap.get(e.deck) || e.deck, card: cMap.get(e.card) || e.card }));
  return { decks, log };
}

// ── Paleta ─────────────────────────────────────────────────────────────
const C = { bg:"#EEF6F2", bgDeep:"#E3F0EA", surface:"#FFFFFF", ink:"#22322C", muted:"#6B8078",
  line:"#DCEAE3", teal:"#14B8A6", tealDeep:"#0D9488", rose:"#FB7185", amber:"#F5A623", green:"#34C77B", cream:"#FFFDF8" };
const HEAT = ["#E6F1EC","#A7E8DC","#5FD3C0","#1FBFA8","#0D9488"];
const DECK_COLORS = ["#14B8A6","#6366F1","#F5A623","#FB7185","#34C77B","#38BDF8","#A78BFA","#F472B6"];
const EMOJIS = ["🌿","🧠","🔬","🌍","📚","🧬","💊","🎯","⭐","🩺","🧪","🗣️"];
const uid = () => (crypto.randomUUID ? crypto.randomUUID()
  : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random()*16)|0, v = c === "x" ? r : (r & 0x3) | 0x8; return v.toString(16); }));
const now = () => Date.now();
const DAY = 86400000;
const dayKey = (ms) => new Date(ms).toISOString().slice(0,10);
const todayKey = () => dayKey(now());

// ── Motor FSRS-5 ───────────────────────────────────────────────────────
const W = [0.40255,1.18385,3.173,15.69105,7.1949,0.5345,1.4604,0.0046,1.54575,0.1192,1.01925,1.9395,0.11,0.29605,2.2698,0.2315,2.9898,0.51655,0.6621];
const DECAY = -0.5, FACTOR = Math.pow(0.9,1/DECAY)-1;
const clampD = (d) => Math.min(10,Math.max(1,d));
const clampS = (s) => Math.max(0.01,s);
const initStability = (g) => W[g-1];
const initDifficulty = (g) => clampD(W[4]-Math.exp(W[5]*(g-1))+1);
const retrievability = (t,S) => Math.pow(1+FACTOR*t/S,DECAY);
const nextInterval = (S,r) => Math.max(1,Math.round((S/FACTOR)*(Math.pow(r,1/DECAY)-1)));
const nextDifficulty = (D,g) => clampD(W[7]*initDifficulty(4)+(1-W[7])*(D+(-W[6]*(g-3))*(10-D)/9));
const stabilityRecall = (D,S,R,g) => clampS(S*(1+Math.exp(W[8])*(11-D)*Math.pow(S,-W[9])*(Math.exp(W[10]*(1-R))-1)*(g===4?W[16]:1)));
const stabilityForget = (D,S,R) => clampS(Math.min(W[11]*Math.pow(D,-W[12])*(Math.pow(S+1,W[13])-1)*Math.exp(W[14]*(1-R)),S));
const stabilityShortTerm = (S,g) => clampS(S*Math.exp(W[17]*(g-3+W[18])));

function fsrs(card, g, retention) {
  const t = now();
  const isNew = card.state === "new" || card.stability == null;
  let S, D;
  if (isNew) { S = initStability(g); D = initDifficulty(g); }
  else {
    const elapsed = Math.max(0,(t-(card.lastReview||t))/DAY);
    const R = retrievability(elapsed, card.stability);
    D = nextDifficulty(card.difficulty, g);
    if (elapsed < 1) S = stabilityShortTerm(card.stability, g);
    else if (g === 1) S = stabilityForget(D, card.stability, R);
    else S = stabilityRecall(D, card.stability, R);
  }
  const due = g === 1 ? t : t + nextInterval(S, retention)*DAY;
  return { ...card, stability:S, difficulty:D, lastReview:t, state:"review", reps:(card.reps||0)+1, lapses:(card.lapses||0)+(g===1?1:0), due };
}
const projectDays = (card,g,retention) => g===1 ? 0 : Math.max(1,Math.round((fsrs(card,g,retention).due-now())/DAY));
function fmtIvl(d) {
  if (d<=0) return "pronto";
  if (d===1) return "1 día";
  if (d<30) return d+" días";
  if (d<365){ const m=Math.round(d/30); return m+(m===1?" mes":" meses"); }
  const y=Math.round(d/365); return y+(y===1?" año":" años");
}
function maturity(c) {
  const S = c.stability||0;
  if (!c.reps) return { label:"Nueva", pct:0, icon:"🌱" };
  if (S<7) return { label:"Brotando", pct:25, icon:"🌱" };
  if (S<30) return { label:"Creciendo", pct:55, icon:"🌿" };
  if (S<90) return { label:"Firme", pct:80, icon:"🪴" };
  return { label:"Dominada", pct:100, icon:"🌳" };
}

const dueReviews = (deck) => deck.cards.filter((c)=>c.state==="review" && (c.due||0)<=now());
const newCardsOf = (deck) => deck.cards.filter((c)=>c.state==="new" || !c.state);
function newAllowed(deck) {
  const per = deck.settings?.newPerDay ?? 20;
  const done = deck.daily?.date===todayKey() ? deck.daily.newDone : 0;
  return Math.max(0, per-done);
}
const studyCount = (deck) => dueReviews(deck).length + Math.min(newCardsOf(deck).length, newAllowed(deck));

function mkCard(data={}){ return { id:uid(), front:"", back:"", extra:"", hint:"", tags:[], type:"text", image:null, masks:null, maskIndex:null, clozeText:null, clozeNum:null, noteId:null, ...data, state:"new", stability:null, difficulty:null, due:now(), reps:0, lapses:0 }; }
const cardFromData = (x) => mkCard(x);
function newDeck(name,emoji,color){ return { id:uid(), name, emoji, color, settings:{retention:0.9,newPerDay:20,includeNew:true,minutes:0,goal:null}, daily:{date:todayKey(),newDone:0}, cards:[] }; }
const mkFrom = (c) => mkCard({ front:c.front, back:c.back });
function normalize(decks){
  return decks.map((d)=>({ ...d,
    settings:{ retention:0.9, newPerDay:20, includeNew:true, minutes:0, goal:null, ...(d.settings||{}) },
    daily: d.daily?.date ? d.daily : {date:todayKey(),newDone:0},
    cards:(d.cards||[]).map((c)=>c.state?{type:"text",extra:"",hint:"",tags:[],image:null,masks:null,maskIndex:null,clozeText:null,clozeNum:null,noteId:null,...c}:mkFrom(c)) }));
}
// ── Cloze (rellenar huecos, estilo Anki) ───────────────────────────────
function clozeNums(text){ const set=new Set(); const re=/\{\{c(\d+)::/g; let m; while((m=re.exec(text||""))) set.add(+m[1]); return [...set].sort((a,b)=>a-b); }
function renderCloze(text, activeNum, revealed){
  let s=(text||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  s=s.replace(/\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/g,(m,num,ans,hint)=>{
    if(+num===activeNum) return revealed
      ? `<span style="color:#0D9488;font-weight:800">${ans}</span>`
      : `<span style="color:#0D9488;font-weight:800">[${hint?hint:"..."}]</span>`;
    return ans;
  });
  return s.replace(/\n/g,"<br>");
}
function seed(){
  const a = newDeck("Neurociencia — ejemplo","🧠","#6366F1");
  a.cards = [
    mkCard({front:"¿Qué neurotransmisor se pierde en la enfermedad de Parkinson?",back:"Dopamina (por la degeneración de la sustancia negra)."}),
    mkCard({front:"¿Qué es la proteína tau?",back:"Proteína asociada a microtúbulos; su hiperfosforilación forma ovillos neurofibrilares."}),
    mkCard({front:"¿Para qué sirve REDCap?",back:"Plataforma para capturar y gestionar datos de investigación clínica de forma segura."})];
  const b = newDeck("Inglés · vocabulario","🗣️","#14B8A6");
  b.cards = [mkCard({front:"insight",back:"percepción / comprensión profunda"}), mkCard({front:"to leverage",back:"aprovechar / apalancar"}), mkCard({front:"outreach",back:"difusión / alcance comunitario"})];
  return [a,b];
}

// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [auth, setAuth] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setAuth(data.session); setChecking(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuth(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (checking) return <Splash>Cargando…</Splash>;
  if (!auth) return <Login />;
  return <Main auth={auth} key={auth.user.id} />;
}

function Splash({ children }) {
  return <div style={{minHeight:"100vh",background:C.bg,display:"grid",placeItems:"center",fontFamily:"'Nunito',ui-rounded,system-ui,sans-serif",color:C.muted}}>{children}</div>;
}

function Login() {
  const [err, setErr] = useState("");
  const go = async () => { setErr("");
    const { error } = await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } });
    if (error) setErr(error.message); };
  return <div style={{minHeight:"100vh",background:C.bg,display:"grid",placeItems:"center",padding:20,fontFamily:"'Nunito',ui-rounded,system-ui,sans-serif",color:C.ink}}>
    <div style={{background:C.surface,borderRadius:22,padding:34,maxWidth:390,width:"100%",textAlign:"center",boxShadow:"0 6px 24px rgba(34,50,44,.08)"}}>
      <div style={{width:56,height:56,borderRadius:18,background:C.teal,display:"grid",placeItems:"center",margin:"0 auto 12px",boxShadow:"0 6px 16px rgba(20,184,166,.3)"}}><Sprout size={32} color="#fff" /></div>
      <h1 style={{...display,fontSize:30,fontWeight:700,margin:"0 0 4px"}}>Repaso</h1>
      <p style={{color:C.muted,margin:"0 0 22px",fontSize:15}}>Tu jardín de memoria, en todos tus dispositivos.</p>
      <button onClick={go} style={{...primaryBtn,width:"100%"}}>Entrar con Google</button>
      {err && <p style={{color:C.rose,fontSize:13,marginTop:12}}>{err}</p>}
    </div>
  </div>;
}

function Main({ auth }) {
  const [decks, setDecks] = useState(null);
  const [log, setLog] = useState([]);
  const [view, setView] = useState("home");
  const [activeId, setActiveId] = useState(null);
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("");
  const [loadErr, setLoadErr] = useState("");
  const snap = useRef(new Map());
  const pending = useRef(false);

  // ── Cargar todo desde la nube ──
  useEffect(() => { (async () => {
    try {
      const [dRes, cRes, rRes] = await Promise.all([
        supabase.from("decks").select("*"),
        supabase.from("cards").select("*"),
        supabase.from("reviews").select("entry, created_at").order("created_at", { ascending:true }).limit(20000),
      ]);
      if (dRes.error) throw dRes.error;
      if (cRes.error) throw cRes.error;
      if (rRes.error) throw rRes.error;
      const byDeck = {};
      for (const c of cRes.data || []) (byDeck[c.deck_id] = byDeck[c.deck_id] || []).push(c);
      const cloud = (dRes.data || [])
        .sort((a,b) => ((a.settings&&a.settings.pos)||0) - ((b.settings&&b.settings.pos)||0))
        .map((d) => ({ id:d.id, name:d.name, emoji:d.emoji, color:d.color,
          settings: d.settings || {}, daily: (d.settings && d.settings.daily) || { date:todayKey(), newDone:0 },
          cards: (byDeck[d.id] || []).sort((a,b) => ((a.data&&a.data.pos)||0) - ((b.data&&b.data.pos)||0))
            .map((c) => ({ ...c.data, id:c.id })) }));
      setLog((rRes.data || []).map((r) => r.entry));
      const norm = cloud.length ? normalize(cloud) : seed();
      // Si venía de la nube, la instantánea es el estado ya normalizado (así no se reescribe sin motivo).
      // Si estaba vacía, la instantánea va vacía para que se suban los mazos de ejemplo.
      snap.current = cloud.length ? snapshotOf(norm) : new Map();
      setDecks(norm);
    } catch (e) { setLoadErr(e.message || String(e)); setDecks([]); }
  })(); }, []);

  // ── Guardar cambios en la nube (con retardo, solo lo que cambió) ──
  useEffect(() => {
    if (!decks) return;
    const t = setTimeout(async () => {
      if (pending.current) return;
      pending.current = true;
      try {
        const n = await syncToCloud(decks, snap.current);
        snap.current = snapshotOf(decks);
        if (n) { setStatus("Guardado"); setTimeout(() => setStatus(""), 1200); }
      } catch (e) { setStatus("Error al guardar"); console.error(e); }
      finally { pending.current = false; }
    }, 1000);
    return () => clearTimeout(t);
  }, [decks]);

  // Aviso al cerrar si queda algo por guardar
  useEffect(() => {
    const h = (e) => { if (pending.current) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  const meta = useMemo(() => {
    const days = new Set(log.map((e) => dayKey(e.t)));
    const t = todayKey(), y = dayKey(now() - DAY);
    let streak = 0;
    let cur = days.has(t) ? t : days.has(y) ? y : null;
    if (cur) { let ms = new Date(cur + "T00:00:00").getTime();
      while (days.has(dayKey(ms))) { streak++; ms -= DAY; } }
    return { streak, last: days.has(t) ? t : null, total: log.length };
  }, [log]);

  const recordReview = useCallback((entry) => {
    setLog((l) => [...l, entry]);
    supabase.from("reviews").insert({ card_id: entry.card, deck_id: entry.deck, entry })
      .then(({ error }) => { if (error) console.error(error); });
  }, []);

  const activeDeck = decks ? decks.find((d) => d.id === activeId) || null : null;
  const updateDeck = (id, fn) => setDecks((ds) => ds.map((d) => d.id === id ? fn(d) : d));
  const startDeck = (id) => { const d = decks.find((x) => x.id === id); if (!d) return;
    setSession({ deckIds:[id], includeNew: d.settings.includeNew !== false, minutes: d.settings.minutes || 0, title: d.name }); setView("study"); };
  const startSelected = (ids) => { const list = ids.filter((id) => decks.some((d) => d.id === id)); if (!list.length) return;
    setSession({ deckIds:list, includeNew:true, minutes:0,
      title: list.length === decks.length ? "Todos los mazos" : list.length === 1 ? decks.find((d) => d.id === list[0]).name : "Mazos elegidos" }); setView("study"); };
  const moveCard = (fromId, cardId, toId) => { if (fromId === toId) return; setDecks((ds) => {
    const from = ds.find((d) => d.id === fromId); const card = from && from.cards.find((c) => c.id === cardId); if (!card) return ds;
    const group = card.noteId ? from.cards.filter((c) => c.noteId === card.noteId) : [card];
    const ids = new Set(group.map((c) => c.id));
    return ds.map((d) => d.id === fromId ? {...d, cards:d.cards.filter((c) => !ids.has(c.id))} : d.id === toId ? {...d, cards:[...group, ...d.cards]} : d);
  }); };
  const restore = (data) => { try { const { decks:dk, log:lg } = remapBackup(data);
    setDecks(normalize(dk)); setLog(lg);
    if (lg.length) supabase.from("reviews").insert(lg.slice(-5000).map((e) => ({ card_id:e.card, deck_id:e.deck, entry:e }))).then(()=>{});
  } catch(e) { alert("No se pudo restaurar: " + (e.message || e)); } };
  const signOut = () => supabase.auth.signOut();

  if (!decks) return <Splash>Cargando tu jardín…</Splash>;

  return (
    <Shell>
      {status && <div style={{position:"fixed",bottom:14,left:"50%",transform:"translateX(-50%)",background:status.startsWith("Error")?C.rose:C.ink,color:"#fff",borderRadius:999,padding:"6px 16px",fontSize:12.5,fontWeight:700,zIndex:50,opacity:.92}}>{status}</div>}
      {loadErr && <div style={{background:"#FFE9EC",border:`1px solid ${C.rose}`,color:C.ink,borderRadius:12,padding:12,marginBottom:14,fontSize:13}}>No se pudo cargar desde la nube: {loadErr}</div>}
      <Header meta={meta} onStats={() => setView("stats")} active={view === "stats"} />
      {view === "home" && <Home decks={decks}
        onOpen={(id) => { setActiveId(id); setView("deck"); }}
        onStudy={startDeck} onStudySelected={startSelected}
        onCreate={(d) => setDecks((ds) => [d, ...ds])} />}
      {view === "stats" && <Stats log={log} meta={meta} decks={decks} onBack={() => setView("home")} onRestore={restore}
        onSignOut={signOut} userEmail={auth.user.email} />}
      {view === "deck" && activeDeck && <Deck deck={activeDeck} decks={decks} log={log} onBack={() => setView("home")} onStudy={() => startDeck(activeDeck.id)}
        onChange={(fn) => updateDeck(activeDeck.id, fn)} onMove={moveCard}
        onDelete={() => { setDecks((ds) => ds.filter((d) => d.id !== activeDeck.id)); setView("home"); }} />}
      {view === "study" && session && <Study session={session} decks={decks} updateDeck={updateDeck} onReview={recordReview}
        onBack={() => setView(activeId && session.deckIds.length === 1 ? "deck" : "home")} onHome={() => setView("home")} />}
    </Shell>
  );
}

function Shell({ children }) {
  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Nunito',ui-rounded,system-ui,sans-serif",color:C.ink}}>
    <div style={{maxWidth:720,margin:"0 auto",padding:"20px 18px 60px"}}>{children}</div>
  </div>;
}
const display = { fontFamily:"'Baloo 2',ui-rounded,system-ui,sans-serif" };

function Header({ meta, onStats, active }) {
  return <div className="flex items-center justify-between" style={{marginBottom:22}}>
    <div className="flex items-center gap-2">
      <div style={{width:38,height:38,borderRadius:12,background:C.teal,display:"grid",placeItems:"center",boxShadow:"0 4px 12px rgba(20,184,166,.3)"}}><Sprout size={22} color="#fff" /></div>
      <span style={{...display,fontSize:24,fontWeight:700}}>Repaso</span>
    </div>
    <button onClick={onStats} className="flex items-center gap-2" style={{border:"none",background:active?C.teal:C.surface,borderRadius:999,padding:"7px 14px",boxShadow:"0 2px 8px rgba(34,50,44,.06)"}}>
      <CalendarDays size={16} color={active?"#fff":C.muted} />
      <Flame size={17} color={meta.streak>0?(active?"#fff":C.amber):C.line} fill={meta.streak>0?(active?"#fff":C.amber):"none"} />
      <span style={{fontWeight:800,fontSize:15,color:active?"#fff":C.ink}}>{meta.streak}</span>
    </button>
  </div>;
}

const daysUntil=(iso)=>{ if(!iso) return null; const target=new Date(iso+"T00:00:00").getTime(); const today=new Date(todayKey()+"T00:00:00").getTime(); return Math.round((target-today)/DAY); };
function goalInfo(deck){ const g=deck.settings?.goal; if(!g) return null; const days=daysUntil(g); const unseen=newCardsOf(deck).length; const perDay= days>0 ? Math.ceil(unseen/days) : unseen; return { days, unseen, perDay }; }

function Home({ decks, onOpen, onStudy, onStudySelected, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [picking, setPicking] = useState(false);
  const [sel, setSel] = useState({});
  const totalDue = decks.reduce((n,d)=>n+studyCount(d),0);
  const openPicker=()=>{ const s={}; decks.forEach((d)=>{ s[d.id]=studyCount(d)>0; }); setSel(s); setPicking(true); };
  const toggle=(id)=>setSel((s)=>({...s,[id]:!s[id]}));
  const chosen=decks.filter((d)=>sel[d.id]);
  const chosenDue=chosen.reduce((n,d)=>n+studyCount(d),0);
  return <>
    <div style={{marginBottom:14}}>
      <h1 style={{...display,fontSize:30,fontWeight:700,margin:0}}>Tus mazos</h1>
      <p style={{color:C.muted,margin:"2px 0 0",fontSize:15}}>Repasa un poco cada día y todo se queda.</p>
    </div>
    {decks.length>1 && totalDue>0 && !picking && <div className="flex gap-2" style={{marginBottom:14}}>
      <button onClick={()=>onStudySelected(decks.map((d)=>d.id))} className="flex items-center justify-center gap-2" style={{...primaryBtn,flex:1,padding:"13px"}}>
        <Play size={16} fill="#fff" /> Estudiar todo · {totalDue}
      </button>
      <button onClick={openPicker} className="flex items-center justify-center gap-2" style={{...ghostBtn,padding:"13px 16px"}}>
        <Layers size={16} /> Elegir mazos
      </button>
    </div>}
    {picking && <div className="rise" style={{background:C.surface,borderRadius:18,padding:16,marginBottom:14,boxShadow:"0 2px 10px rgba(34,50,44,.06)"}}>
      <div className="flex items-center justify-between" style={{marginBottom:10}}>
        <span style={{...display,fontSize:16,fontWeight:700}}>Elige qué mazos mezclar</span>
        <button onClick={()=>setPicking(false)} style={iconBtn}><X size={16} /></button>
      </div>
      <div className="grid gap-2">
        {decks.map((d)=>{ const c=studyCount(d); return <label key={d.id} className="flex items-center gap-3" style={{padding:"9px 11px",borderRadius:12,background:sel[d.id]?d.color+"14":C.bg,cursor:"pointer"}}>
          <input type="checkbox" checked={!!sel[d.id]} onChange={()=>toggle(d.id)} style={{accentColor:d.color,width:17,height:17}} />
          <span style={{fontSize:18}}>{d.emoji}</span>
          <span style={{flex:1,fontWeight:700,fontSize:15,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.name}</span>
          <span style={{fontSize:13,fontWeight:700,color:c>0?d.color:C.muted}}>{c>0?`${c} para hoy`:"al día"}</span>
        </label>; })}
      </div>
      <button disabled={chosenDue===0} onClick={()=>onStudySelected(chosen.map((d)=>d.id))} className="flex items-center justify-center gap-2"
        style={{...primaryBtn,width:"100%",marginTop:12,opacity:chosenDue?1:0.5}}>
        <Play size={16} fill="#fff" /> Estudiar {chosen.length} mazo{chosen.length===1?"":"s"} · {chosenDue} tarjeta{chosenDue===1?"":"s"}
      </button>
    </div>}
    {decks.length===0 && !creating && <Empty onCreate={()=>setCreating(true)} />}
    <div className="grid gap-3" style={{gridTemplateColumns:"1fr"}}>
      {decks.map((d)=>{
        const count = studyCount(d); const gi=goalInfo(d);
        return <div key={d.id} className="rise" style={cardBox}>
          <div className="flex items-center gap-3" style={{flex:1,minWidth:0}} onClick={()=>onOpen(d.id)}>
            <div style={{width:46,height:46,borderRadius:14,background:d.color+"22",display:"grid",placeItems:"center",fontSize:24,flexShrink:0}}>{d.emoji}</div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:800,fontSize:17,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.name}</div>
              <div style={{color:C.muted,fontSize:13.5}}>{d.cards.length} tarjeta{d.cards.length===1?"":"s"}{count>0 && <span style={{color:d.color,fontWeight:700}}> · {count} para hoy</span>}</div>
              {gi && <div style={{fontSize:12,marginTop:2,color:gi.days<0?C.rose:C.tealDeep,fontWeight:700}}>🎯 {gi.days<0?`meta vencida hace ${-gi.days} d`:gi.days===0?"meta: hoy":`faltan ${gi.days} d`}{gi.unseen>0&&gi.days>0?` · ~${gi.perDay}/día`:""}</div>}
            </div>
          </div>
          <button onClick={()=>(count>0?onStudy(d.id):onOpen(d.id))} style={{border:"none",borderRadius:12,padding:"10px 16px",flexShrink:0,background:count>0?d.color:"transparent",color:count>0?"#fff":C.muted,fontWeight:800,fontSize:14,display:"flex",alignItems:"center",gap:6,boxShadow:count>0?`0 4px 12px ${d.color}44`:"none"}}>
            {count>0 ? <><Play size={16} fill="#fff" /> Estudiar</> : <>Al día ✓</>}
          </button>
        </div>;
      })}
    </div>
    {creating
      ? <NewDeck onCancel={()=>setCreating(false)} onCreate={(d)=>{onCreate(d);setCreating(false);}} />
      : <button onClick={()=>setCreating(true)} className="flex items-center justify-center gap-2" style={{width:"100%",marginTop:12,padding:16,borderRadius:16,border:`2px dashed ${C.line}`,background:"transparent",color:C.tealDeep,fontWeight:800,fontSize:15}}><Plus size={18} /> Crear un mazo</button>}
  </>;
}
const cardBox = { background:C.surface, borderRadius:18, padding:"14px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, boxShadow:"0 2px 10px rgba(34,50,44,.05)", cursor:"pointer" };

function Empty({ onCreate }) {
  return <div style={{textAlign:"center",padding:"40px 20px",background:C.surface,borderRadius:20,marginBottom:12}}>
    <div style={{fontSize:44}}>🌱</div>
    <h3 style={{...display,margin:"8px 0 4px"}}>Empieza tu jardín de memoria</h3>
    <p style={{color:C.muted,margin:"0 0 16px"}}>Crea tu primer mazo y añade tarjetas.</p>
    <button onClick={onCreate} style={primaryBtn}>Crear mazo</button>
  </div>;
}
function NewDeck({ onCreate, onCancel }) {
  const [name,setName]=useState(""),[emoji,setEmoji]=useState("🌿"),[color,setColor]=useState(DECK_COLORS[0]);
  const ref=useRef(); useEffect(()=>ref.current&&ref.current.focus(),[]);
  const make=()=>name.trim()&&onCreate(newDeck(name.trim(),emoji,color));
  return <div className="rise" style={{marginTop:12,background:C.surface,borderRadius:18,padding:18,boxShadow:"0 4px 16px rgba(34,50,44,.08)"}}>
    <div className="flex items-center justify-between" style={{marginBottom:12}}>
      <span style={{...display,fontSize:18,fontWeight:700}}>Nuevo mazo</span>
      <button onClick={onCancel} style={iconBtn}><X size={18} /></button>
    </div>
    <input ref={ref} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nombre del mazo" onKeyDown={(e)=>e.key==="Enter"&&make()} style={input} />
    <div style={secLabel}>Ícono</div>
    <div className="flex flex-wrap gap-1">{EMOJIS.map((e)=><button key={e} onClick={()=>setEmoji(e)} style={{...chip,fontSize:20,background:emoji===e?C.teal+"22":C.bg,outline:emoji===e?`2px solid ${C.teal}`:"none"}}>{e}</button>)}</div>
    <div style={secLabel}>Color</div>
    <div className="flex flex-wrap gap-2">{DECK_COLORS.map((c)=><button key={c} onClick={()=>setColor(c)} style={{width:30,height:30,borderRadius:999,background:c,border:"none",outline:color===c?`3px solid ${c}55`:"none",outlineOffset:2}} />)}</div>
    <button disabled={!name.trim()} onClick={make} style={{...primaryBtn,width:"100%",marginTop:16,opacity:name.trim()?1:0.5}}>Crear mazo</button>
  </div>;
}

const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const WD = ["","Lun","","Mié","","Vie",""];
const heatLevel = (n) => n<=0?HEAT[0]:n<5?HEAT[1]:n<10?HEAT[2]:n<20?HEAT[3]:HEAT[4];
function longestStreak(daysSet) {
  const days=[...daysSet].sort(); let best=0,cur=0,prev=null;
  for (const k of days){ cur = prev && Date.parse(k)-Date.parse(prev)===DAY ? cur+1 : 1; best=Math.max(best,cur); prev=k; }
  return best;
}
function Stats({ log, meta, decks, onBack, onRestore, onSignOut, userEmail }) {
  const scroller = useRef(null); const fileRef = useRef();
  useEffect(()=>{ if(scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth; },[]);
  const exportData=()=>{ try{
    const blob=new Blob([JSON.stringify({app:"repaso",version:1,exported:new Date().toISOString(),decks,meta,log})],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download=`repaso-backup-${todayKey()}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch{} };
  const importData=(e)=>{ const f=e.target.files?.[0]; if(!f) return; const rd=new FileReader();
    rd.onload=()=>{ try{ const data=JSON.parse(String(rd.result||"{}"));
      if(!data.decks){ alert("El archivo no parece un respaldo de Repaso."); return; }
      if(confirm("Esto reemplazará TODOS tus mazos, historial y racha actuales por los del archivo. ¿Continuar?")) onRestore(data);
    }catch{ alert("No se pudo leer el archivo."); } };
    rd.readAsText(f); e.target.value=""; };
  const counts = {};
  for (const e of log) counts[dayKey(e.t)] = (counts[dayKey(e.t)]||0)+1;
  const studiedDays = Object.keys(counts).filter((k)=>counts[k]>0);
  const totalCards = decks.reduce((s,d)=>s+d.cards.length,0);
  const WEEKS=53, CELL=13, GAP=3;
  const end=new Date();
  const sow=new Date(Date.UTC(end.getUTCFullYear(),end.getUTCMonth(),end.getUTCDate()-end.getUTCDay()));
  const start=new Date(sow); start.setUTCDate(start.getUTCDate()-(WEEKS-1)*7);
  const columns=[]; let cur=new Date(start);
  for(let w=0;w<WEEKS;w++){ const col=[]; for(let d=0;d<7;d++){ const key=cur.toISOString().slice(0,10);
    col.push({key,count:counts[key]||0,future:cur.getTime()>end.getTime(),month:cur.getUTCMonth(),dom:cur.getUTCDate()});
    cur.setUTCDate(cur.getUTCDate()+1);} columns.push(col); }
  let lastM=-1;
  const monthLabels = columns.map((col)=>{ const m=col[0].month; if(m!==lastM&&col[0].dom<=7){lastM=m;return MONTHS[m];} return ""; });
  return <div className="rise">
    <button onClick={onBack} className="flex items-center gap-1" style={{...linkBtn,marginBottom:14}}><ChevronLeft size={18} /> Inicio</button>
    <h1 style={{...display,fontSize:26,fontWeight:700,margin:"0 0 2px"}}>Tu actividad</h1>
    <p style={{color:C.muted,margin:"0 0 16px",fontSize:14.5}}>Cada cuadro es un día. Mientras más repasos, más intenso el color.</p>
    <div className="grid gap-2" style={{gridTemplateColumns:"1fr 1fr",marginBottom:16}}>
      <Tile icon={<Flame size={18} color={C.amber} />} value={meta.streak} label="racha actual" />
      <Tile icon={<Trophy size={18} color={C.tealDeep} />} value={longestStreak(studiedDays)} label="mejor racha" />
      <Tile icon={<Check size={18} color={C.green} />} value={log.length} label="repasos totales" />
      <Tile icon={<CalendarDays size={18} color={C.teal} />} value={studiedDays.length} label="días estudiados" />
    </div>
    <div style={{background:C.surface,borderRadius:18,padding:"16px 14px",boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
      <div className="heat" ref={scroller} style={{overflowX:"auto",paddingBottom:4}}>
        <div style={{minWidth:"min-content"}}>
          <div style={{display:"flex",gap:GAP,marginLeft:26,marginBottom:4}}>
            {monthLabels.map((m,i)=><div key={i} style={{width:CELL,fontSize:10,color:C.muted,fontWeight:700,whiteSpace:"nowrap",overflow:"visible"}}>{m}</div>)}
          </div>
          <div style={{display:"flex",gap:GAP}}>
            <div style={{display:"flex",flexDirection:"column",gap:GAP,marginRight:3,width:23}}>
              {WD.map((w,i)=><div key={i} style={{height:CELL,fontSize:9.5,color:C.muted,lineHeight:CELL+"px"}}>{w}</div>)}
            </div>
            {columns.map((col,ci)=><div key={ci} style={{display:"flex",flexDirection:"column",gap:GAP}}>
              {col.map((cell)=><div key={cell.key} title={cell.future?"":`${cell.count} repaso${cell.count===1?"":"s"} · ${cell.dom} ${MONTHS[cell.month]}`}
                style={{width:CELL,height:CELL,borderRadius:3,background:cell.future?"transparent":heatLevel(cell.count),border:cell.key===todayKey()?`1.5px solid ${C.ink}`:"none"}} />)}
            </div>)}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1" style={{marginTop:10,fontSize:11,color:C.muted}}>
        <span>Menos</span>{HEAT.map((h,i)=><div key={i} style={{width:11,height:11,borderRadius:3,background:h}} />)}<span>Más</span>
      </div>
    </div>
    {log.length===0 && <p style={{color:C.muted,textAlign:"center",marginTop:18,fontSize:14}}>Aún no hay repasos registrados. En cuanto estudies, tus días se irán pintando aquí 🌿</p>}

    <div style={{background:C.surface,borderRadius:18,padding:16,marginTop:16,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
      <div style={{...display,fontSize:15,fontWeight:700,marginBottom:4}}>Copia de seguridad</div>
      <p style={{color:C.muted,fontSize:12.5,margin:"0 0 12px",lineHeight:1.5}}>Tus datos se sincronizan en la nube entre tus dispositivos. Aun así, puedes exportar un archivo como respaldo propio.</p>
      <div className="flex gap-2" style={{flexWrap:"wrap"}}>
        <button onClick={exportData} className="flex items-center gap-2" style={{...primaryBtn,flex:1,minWidth:150}}><Download size={16} /> Exportar datos</button>
        <button onClick={()=>fileRef.current.click()} className="flex items-center gap-2" style={{...ghostBtn,flex:1,minWidth:150,justifyContent:"center",display:"inline-flex",alignItems:"center"}}><Upload size={16} /> Importar datos</button>
        <input ref={fileRef} type="file" accept=".json,application/json" onChange={importData} style={{display:"none"}} />
      </div>
      <p style={{color:C.rose,fontSize:11.5,margin:"8px 0 0"}}>Importar reemplaza todo lo que tienes ahora.</p>
      <div style={{height:1,background:C.line,margin:"14px 0"}} />
      <div className="flex items-center justify-between gap-2" style={{flexWrap:"wrap"}}>
        <span style={{fontSize:12.5,color:C.muted}}>Sesión: <b style={{color:C.ink}}>{userEmail}</b></span>
        <button onClick={onSignOut} style={{...ghostBtn,padding:"8px 14px",fontSize:13}}>Cerrar sesión</button>
      </div>
    </div>

    <p style={{color:C.muted,fontSize:12.5,marginTop:16,lineHeight:1.5}}>Se guarda cada repaso (fecha, calificación e intervalo). Tienes {totalCards} tarjeta{totalCards===1?"":"s"} en total.</p>
  </div>;
}
function Tile({ icon, value, label }) {
  return <div style={{background:C.surface,borderRadius:16,padding:"14px 16px",boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
    <div className="flex items-center gap-2">{icon}<span style={{...display,fontSize:24,fontWeight:700}}>{value}</span></div>
    <div style={{color:C.muted,fontSize:13,marginTop:2}}>{label}</div>
  </div>;
}

// ── Gráfico de dona (SVG) ──────────────────────────────────────────────
function Donut({ segments, size=132, thickness=17, centerTop, centerSub }) {
  const r=(size-thickness)/2, c=2*Math.PI*r, cx=size/2;
  const total=segments.reduce((s,x)=>s+x.value,0);
  let acc=0;
  return <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${cx} ${cx})`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={C.line} strokeWidth={thickness} />
        {total>0 && segments.map((seg,i)=>{
          const len=(seg.value/total)*c; const el=<circle key={i} cx={cx} cy={cx} r={r} fill="none" stroke={seg.color} strokeWidth={thickness} strokeDasharray={`${len} ${c-len}`} strokeDashoffset={-acc} />;
          acc+=len; return el;
        })}
      </g>
    </svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <span style={{...display,fontSize:26,fontWeight:700,lineHeight:1}}>{centerTop}</span>
      {centerSub && <span style={{fontSize:11.5,color:C.muted,marginTop:2}}>{centerSub}</span>}
    </div>
  </div>;
}

// ── Panel de importar (pegar o subir un archivo) ───────────────────────
function escHTML(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function fieldToHTML(raw, images){
  let missing=false;
  const h = escHTML(raw).replace(/\[\[([^\]]+)\]\]/g,(m,name)=>{ const k=name.trim().toLowerCase();
    if(images[k]) return `<img src="${images[k]}">`; missing=true; return `[imagen no encontrada: ${escHTML(name.trim())}]`; });
  return { html:h, missing };
}
function parseImport(text, images={}) {
  const items=[]; let missing=0;
  for (const raw of text.split(/\r?\n/)) {
    const line=raw.trim(); if(!line) continue;
    let fields;
    if (line.includes("\t")) fields=line.split("\t").map((s)=>s.trim());
    else { let sep=line.indexOf(";"); if(sep<0) sep=line.indexOf(","); if(sep<0) continue; fields=[line.slice(0,sep).trim(), line.slice(sep+1).trim()]; }
    const c0=fields[0]||"", c1=fields[1]||"", c2=fields[2]||"", c3=fields[3]||"", c4=fields[4]||"";
    const tags=c4.split(/[;,]/).map((s)=>s.trim()).filter(Boolean);
    if (/\{\{c\d+::/.test(c0)) { // tarjeta de huecos
      if (clozeNums(c0).length===0) continue;
      const ex=fieldToHTML(c2,images); if(ex.missing) missing++;
      items.push({ type:"cloze", clozeText:c0, extra:ex.html, hint:c3, tags });
    } else {
      const f=fieldToHTML(c0,images), b=fieldToHTML(c1,images), ex=fieldToHTML(c2,images);
      if(f.missing||b.missing||ex.missing) missing++;
      const fOk=stripHTML(f.html)!=="" || /<img/.test(f.html);
      const bOk=stripHTML(b.html)!=="" || /<img/.test(b.html);
      if(fOk && bOk) items.push({ type:"text", front:f.html, back:b.html, extra:ex.html, hint:c3, tags });
    }
  }
  const cardCount=items.reduce((n,it)=> n + (it.type==="cloze" ? clozeNums(it.clozeText).length : 1), 0);
  return { items, missing, cardCount };
}
function ImportCards({ color, onImport, onCancel }) {
  const [text,setText]=useState("");
  const [images,setImages]=useState({});
  const [imgNames,setImgNames]=useState([]);
  const [ai,setAi]=useState(false), [aiBusy,setAiBusy]=useState(false), [aiErr,setAiErr]=useState("");
  const [aiNotes,setAiNotes]=useState(""), [aiText,setAiText]=useState(""), [aiFile,setAiFile]=useState(null);
  const aiRef=useRef();
  const res=parseImport(text,images);

  const generar = async () => {
    setAiErr(""); setAiBusy(true);
    try {
      let body;
      if (aiFile) {
        const b64 = await fileToB64(aiFile);
        body = { kind: aiFile.type==="application/pdf" ? "pdf" : "image", data:b64, mediaType:aiFile.type, notes:aiNotes };
      } else if (aiText.trim()) {
        body = { kind:"text", data:aiText, notes:aiNotes };
      } else { setAiErr("Sube un PDF o una foto, o pega un texto."); setAiBusy(false); return; }
      const { data, error } = await supabase.functions.invoke("generate-cards", { body });
      if (error) throw new Error(error.message || "No se pudo contactar la IA");
      if (data?.error) throw new Error(data.error);
      const nuevo = (data?.text || "").trim();
      if (!nuevo) throw new Error("La IA no devolvió tarjetas.");
      setText((t) => (t.trim() ? t.trimEnd()+"\n" : "") + nuevo);
      setAi(false); setAiFile(null); setAiText("");
    } catch(e) { setAiErr(e.message || String(e)); }
    finally { setAiBusy(false); }
  };
  const readFile=(e)=>{ const f=e.target.files?.[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>setText(String(rd.result||"")); rd.readAsText(f); e.target.value=""; };
  const readImgs=async(e)=>{ const files=[...(e.target.files||[])]; const map={...images}; const names=[...imgNames];
    for(const f of files){ try{ const u=await compressImage(f); map[f.name.toLowerCase()]=u; if(!names.includes(f.name)) names.push(f.name); }catch{} }
    setImages(map); setImgNames(names); e.target.value=""; };
  return <div className="rise" style={{background:C.cream,borderRadius:14,padding:16,marginBottom:10,border:`1.5px solid ${color}44`}}>
    <div className="flex items-center justify-between" style={{marginBottom:8}}>
      <span style={{...display,fontSize:16,fontWeight:700}}>Importar tarjetas</span>
      <button onClick={onCancel} style={iconBtn}><X size={16} /></button>
    </div>
    {!ai ? <button onClick={()=>{setAi(true);setAiErr("");}} className="flex items-center justify-center gap-2"
      style={{...primaryBtn,width:"100%",marginBottom:12,background:color}}>
      <Sparkles size={16} /> Generar con IA desde PDF, foto o texto
    </button> : <div className="rise" style={{background:C.surface,border:`1.5px solid ${color}66`,borderRadius:12,padding:14,marginBottom:12}}>
      <div className="flex items-center justify-between" style={{marginBottom:8}}>
        <span style={{...display,fontSize:15,fontWeight:700}}>✨ Generar con IA</span>
        <button onClick={()=>setAi(false)} style={iconBtn}><X size={15} /></button>
      </div>
      <label style={{...ghostBtn,padding:"9px 14px",fontSize:13.5,display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer",marginBottom:8}}>
        <Upload size={15} /> {aiFile ? aiFile.name.slice(0,28) : "Elegir PDF o foto"}
        <input type="file" accept="application/pdf,image/*" onChange={(e)=>{setAiFile(e.target.files?.[0]||null);setAiErr("");}} style={{display:"none"}} />
      </label>
      {aiFile && <button onClick={()=>setAiFile(null)} style={{...linkBtn,color:C.rose,fontSize:12.5,marginLeft:10}}>quitar</button>}
      <div style={{fontSize:12,color:C.muted,margin:"4px 0 6px"}}>…o pega aquí el texto (apuntes, un capítulo, preguntas):</div>
      <textarea ref={aiRef} value={aiText} onChange={(e)=>setAiText(e.target.value)} rows={3} disabled={!!aiFile}
        placeholder="Pega el texto del que quieres tarjetas…" style={{...input,resize:"vertical",fontSize:13.5,opacity:aiFile?0.5:1}} />
      <input value={aiNotes} onChange={(e)=>setAiNotes(e.target.value)} placeholder="Indicaciones (opcional): p. ej. en inglés, solo farmacología, usa huecos…"
        style={{...input,marginTop:8,fontSize:13.5}} />
      <button onClick={generar} disabled={aiBusy} className="flex items-center justify-center gap-2"
        style={{...primaryBtn,width:"100%",marginTop:10,background:color,opacity:aiBusy?0.6:1}}>
        {aiBusy ? "Generando… (puede tardar un minuto)" : <><Sparkles size={15} /> Generar tarjetas</>}
      </button>
      {aiErr && <p style={{color:C.rose,fontSize:12.5,marginTop:8,fontWeight:700}}>{aiErr}</p>}
      <p style={{color:C.muted,fontSize:11.5,marginTop:8,lineHeight:1.5}}>La IA escribe las tarjetas abajo para que las revises y edites antes de importarlas. Revisa siempre lo que genera.</p>
    </div>}
    <p style={{color:C.muted,fontSize:12.5,margin:"0 0 8px",lineHeight:1.6}}>
      Una tarjeta por línea. Con <b>TABULADOR</b> puedes usar hasta 5 columnas:<br/>
      <code style={cd}>pregunta · respuesta · explicación · pista · etiquetas</code><br/>
      • Si la 1ª columna lleva <code style={cd}>{"{{c1::...}}"}</code> se crea una tarjeta de <b>huecos</b> (deja la respuesta vacía; una tarjeta por número).<br/>
      • Para <b>imágenes</b>: adjúntalas y escribe <code style={cd}>{"[[nombre.png]]"}</code> en pregunta, respuesta o explicación.<br/>
      (Sin tabulador solo se leen pregunta y respuesta, separadas por ; o ,)
    </p>
    <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={7}
      placeholder={"¿Neurotransmisor que baja en Parkinson?\tDopamina\t\tPiensa en la sustancia negra\nEl {{c1::caudado}} y el {{c2::putamen}} forman el estriado.\t\tNúcleos basales\n¿Qué estructura se muestra?\t[[cortex.png]] Corteza motora"}
      style={{...input,resize:"vertical",fontFamily:"ui-monospace,monospace",fontSize:13,whiteSpace:"pre"}} />
    <div className="flex items-center gap-2" style={{marginTop:10,flexWrap:"wrap"}}>
      <label style={{...ghostBtn,padding:"9px 14px",fontSize:13.5,display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"}}>
        <Upload size={15} /> Subir .txt / .csv
        <input type="file" accept=".txt,.csv,.tsv,text/plain" onChange={readFile} style={{display:"none"}} />
      </label>
      <label style={{...ghostBtn,padding:"9px 14px",fontSize:13.5,display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"}}>
        <Upload size={15} /> Adjuntar imágenes
        <input type="file" accept="image/*" multiple onChange={readImgs} style={{display:"none"}} />
      </label>
      <span style={{fontSize:13,color:res.cardCount?color:C.muted,fontWeight:800,marginLeft:"auto"}}>{res.cardCount} tarjeta{res.cardCount===1?"":"s"}</span>
    </div>
    {imgNames.length>0 && <div className="flex flex-wrap gap-1" style={{marginTop:8}}>
      {imgNames.map((n)=><span key={n} style={{fontSize:11.5,background:C.surface,border:`1px solid ${C.line}`,borderRadius:999,padding:"2px 9px",color:C.muted}}>🖼️ {n}</span>)}
    </div>}
    {res.missing>0 && <p style={{fontSize:12.5,color:C.rose,fontWeight:700,margin:"8px 0 0"}}>Ojo: {res.missing} línea{res.missing===1?"":"s"} menciona{res.missing===1?"":"n"} una imagen que aún no adjuntas.</p>}
    <button disabled={!res.cardCount} onClick={()=>onImport(res.items)} style={{...primaryBtn,background:color,width:"100%",marginTop:12,opacity:res.cardCount?1:0.5}}>
      <Check size={16} style={{marginRight:4,verticalAlign:-3}} /> Importar {res.cardCount||""} tarjeta{res.cardCount===1?"":"s"}
    </button>
  </div>;
}
const cd = { background:"#fff", border:`1px solid ${C.line}`, borderRadius:5, padding:"1px 5px", fontSize:12 };

// ── Análisis por mazo (estilo panel de QBank) ──────────────────────────
function StatTile({ icon, value, label, accent }) {
  return <div style={{background:C.surface,borderRadius:14,padding:"12px 14px",boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
    <div className="flex items-center gap-2">
      <div style={{width:30,height:30,borderRadius:9,background:accent+"22",display:"grid",placeItems:"center",flexShrink:0}}>{icon}</div>
      <div style={{minWidth:0}}>
        <div style={{...display,fontSize:20,fontWeight:700,lineHeight:1}}>{value}</div>
        <div style={{color:C.muted,fontSize:12,marginTop:2}}>{label}</div>
      </div>
    </div>
  </div>;
}
function LegendRow({ color, label, value }) {
  return <div className="flex items-center justify-between" style={{padding:"7px 0",borderBottom:`1px solid ${C.line}`}}>
    <div className="flex items-center gap-2">
      <div style={{width:10,height:10,borderRadius:3,background:color}} />
      <span style={{fontSize:13.5,color:C.ink}}>{label}</span>
    </div>
    <span style={{fontWeight:800,fontSize:14}}>{value}</span>
  </div>;
}
function DeckStats({ deck, log }) {
  const rev = log.filter((e)=>e.deck===deck.id);
  const total = rev.length;
  const correct = rev.filter((e)=>e.g>=3).length;
  const again = rev.filter((e)=>e.g===1).length;
  const mature = rev.filter((e)=>e.st==="review");
  const matureOk = mature.filter((e)=>e.g>=3).length;
  const retention = mature.length ? Math.round((matureOk/mature.length)*100) : null;

  const cards = deck.cards;
  const studied = cards.filter((c)=>c.reps>0).length;
  const unseen = cards.length - studied;
  const buckets = [
    { key:"Nueva", icon:"🌱", color:"#CBD5C7" },
    { key:"Brotando", icon:"🌱", color:"#A7E8DC" },
    { key:"Creciendo", icon:"🌿", color:"#5FD3C0" },
    { key:"Firme", icon:"🪴", color:"#1FBFA8" },
    { key:"Dominada", icon:"🌳", color:C.tealDeep },
  ].map((b)=>({ ...b, n: cards.filter((c)=>maturity(c).label===b.key).length }));
  const maxB = Math.max(1, ...buckets.map((b)=>b.n));
  const avgReps = studied ? (rev.length/studied).toFixed(1) : "0";
  const avgStab = studied ? Math.round(cards.filter((c)=>c.reps>0).reduce((s,c)=>s+(c.stability||0),0)/studied) : 0;
  const daysStudied = new Set(rev.map((e)=>dayKey(e.t))).size;

  const todayStart=new Date(todayKey()+"T00:00:00").getTime();
  const forecast=[]; for(let i=0;i<7;i++){ const ds=todayStart+i*DAY;
    const nDue = i===0 ? cards.filter((c)=>c.state==="review"&&(c.due||0)<ds+DAY).length
                       : cards.filter((c)=>c.state==="review"&&(c.due||0)>=ds&&(c.due||0)<ds+DAY).length;
    forecast.push({ label:i===0?"hoy":i===1?"mañana":`+${i}d`, n:nDue }); }
  const maxF=Math.max(1,...forecast.map((f)=>f.n));
  const allTags=[...new Set(cards.flatMap((c)=>c.tags||[]))].sort();
  const tagRet=allTags.map((t)=>{ const ids=new Set(cards.filter((c)=>(c.tags||[]).includes(t)).map((c)=>c.id));
    const mr=mature.filter((e)=>ids.has(e.card)); const ok=mr.filter((e)=>e.g>=3).length;
    return { tag:t, n:mr.length, ret: mr.length?Math.round(ok/mr.length*100):null }; }).filter((x)=>x.n>0);

  if (total===0 && cards.length===0)
    return <p style={{color:C.muted,textAlign:"center",padding:24}}>Añade tarjetas y estudia para ver tu análisis aquí 📊</p>;

  return <div className="rise">
    <div className="grid gap-2" style={{gridTemplateColumns:"1fr 1fr",marginBottom:14}}>
      <StatTile icon={<Layers size={16} color={C.tealDeep} />} value={total} label="repasos totales" accent={C.teal} />
      <StatTile icon={<BarChart size={16} color={C.tealDeep} />} value={retention==null?"—":retention+"%"} label="retención real" accent={C.teal} />
      <StatTile icon={<Check size={16} color={C.green} />} value={correct} label="aciertos" accent={C.green} />
      <StatTile icon={<X size={16} color={C.rose} />} value={again} label="fallos (otra vez)" accent={C.rose} />
    </div>

    <div className="grid gap-3" style={{gridTemplateColumns:"1fr",marginBottom:14}}>
      <div style={{background:C.surface,borderRadius:18,padding:16,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
        <div style={{...display,fontSize:15,fontWeight:700,marginBottom:12}}>Aciertos vs. fallos</div>
        <div className="flex items-center gap-4" style={{flexWrap:"wrap"}}>
          <Donut segments={[{value:correct,color:C.green},{value:again,color:C.rose}]}
            centerTop={retention==null?"—":retention+"%"} centerSub="recordado" />
          <div style={{flex:1,minWidth:150}}>
            <LegendRow color={C.green} label="Aciertos (Bien / Fácil)" value={correct} />
            <LegendRow color={C.rose} label="Fallos (Otra vez)" value={again} />
            <LegendRow color={C.line} label="Repasos totales" value={total} />
          </div>
        </div>
      </div>
      <div style={{background:C.surface,borderRadius:18,padding:16,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
        <div style={{...display,fontSize:15,fontWeight:700,marginBottom:12}}>Uso del mazo</div>
        <div className="flex items-center gap-4" style={{flexWrap:"wrap"}}>
          <Donut segments={[{value:studied,color:deck.color},{value:unseen,color:C.line}]}
            centerTop={studied} centerSub="estudiadas" />
          <div style={{flex:1,minWidth:150}}>
            <LegendRow color={deck.color} label="Estudiadas" value={studied} />
            <LegendRow color={C.line} label="Sin ver" value={unseen} />
            <LegendRow color={C.ink} label="Total de tarjetas" value={cards.length} />
          </div>
        </div>
      </div>
    </div>

    <div style={{background:C.surface,borderRadius:18,padding:16,marginBottom:14,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
      <div style={{...display,fontSize:15,fontWeight:700,marginBottom:12}}>Previsión de carga (7 días)</div>
      <div className="flex items-end justify-between gap-2" style={{height:110}}>
        {forecast.map((f,i)=><div key={i} className="flex flex-col items-center" style={{flex:1,height:"100%",justifyContent:"flex-end"}}>
          <span style={{fontSize:12,fontWeight:800,color:f.n?C.tealDeep:C.muted,marginBottom:3}}>{f.n}</span>
          <div style={{width:"70%",height:(f.n/maxF*72)+"%",minHeight:f.n?6:2,background:f.n?deck.color:C.line,borderRadius:6,transition:"height .4s ease"}} />
          <span style={{fontSize:11,color:C.muted,marginTop:5}}>{f.label}</span>
        </div>)}
      </div>
      <div style={{fontSize:12,color:C.muted,marginTop:8}}>Cuántas tarjetas ya vistas vencen cada día (sin contar nuevas).</div>
    </div>

    <div style={{background:C.surface,borderRadius:18,padding:16,marginBottom:14,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
      <div style={{...display,fontSize:15,fontWeight:700,marginBottom:12}}>Madurez de las tarjetas</div>
      {buckets.map((b)=><div key={b.key} className="flex items-center gap-2" style={{marginBottom:8}}>
        <span style={{fontSize:14,width:18}}>{b.icon}</span>
        <span style={{fontSize:13,width:78,color:C.muted}}>{b.key}</span>
        <div style={{flex:1,height:8,background:C.bg,borderRadius:999,overflow:"hidden"}}>
          <div style={{width:(b.n/maxB*100)+"%",height:"100%",background:b.color,borderRadius:999}} />
        </div>
        <span style={{fontWeight:800,fontSize:13,width:26,textAlign:"right"}}>{b.n}</span>
      </div>)}
    </div>

    {tagRet.length>0 && <div style={{background:C.surface,borderRadius:18,padding:16,marginBottom:14,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
      <div style={{...display,fontSize:15,fontWeight:700,marginBottom:12}}>Retención por etiqueta</div>
      {tagRet.map((x)=><div key={x.tag} className="flex items-center gap-2" style={{marginBottom:8}}>
        <span style={{fontSize:12.5,width:100,color:deck.color,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>#{x.tag}</span>
        <div style={{flex:1,height:8,background:C.bg,borderRadius:999,overflow:"hidden"}}>
          <div style={{width:(x.ret||0)+"%",height:"100%",background:x.ret>=85?C.green:x.ret>=70?C.amber:C.rose,borderRadius:999}} />
        </div>
        <span style={{fontWeight:800,fontSize:13,width:64,textAlign:"right"}}>{x.ret}% <span style={{color:C.muted,fontWeight:400,fontSize:11}}>({x.n})</span></span>
      </div>)}
    </div>}

    <div style={{background:C.surface,borderRadius:18,padding:16,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
      <div style={{...display,fontSize:15,fontWeight:700,marginBottom:8}}>Desempeño</div>
      <LegendRow color={C.teal} label="Retención real" value={retention==null?"—":retention+"%"} />
      <LegendRow color={C.amber} label="Repasos por tarjeta" value={avgReps} />
      <LegendRow color={C.tealDeep} label="Estabilidad promedio" value={avgStab+" días"} />
      <LegendRow color={C.green} label="Días estudiados" value={daysStudied} />
    </div>
  </div>;
}

const cardStr=(c)=>((c.type==="cloze"?stripHTML(renderCloze(c.clozeText,c.clozeNum,true)):c.type==="occlusion"?"imagen":stripHTML(c.front)+" "+stripHTML(c.back))+" "+stripHTML(c.extra)+" "+(c.tags||[]).join(" ")).toLowerCase();

function Deck({ deck, decks, log, onBack, onStudy, onChange, onMove, onDelete }) {
  const [adding,setAdding]=useState(false),[editId,setEditId]=useState(null),[showSet,setShowSet]=useState(false);
  const [importing,setImporting]=useState(false),[tab,setTab]=useState("cards");
  const [search,setSearch]=useState(""),[tagFilter,setTagFilter]=useState(""),[movingId,setMovingId]=useState(null);
  const count=studyCount(deck);
  const addCard=(data)=>{
    if(data.type==="cloze"){
      const nums=clozeNums(data.clozeText); if(!nums.length) return; const noteId=uid();
      const cards=nums.map((n)=>mkCard({type:"cloze",clozeText:data.clozeText,clozeNum:n,noteId,extra:data.extra,hint:data.hint,tags:data.tags}));
      onChange((d)=>({...d,cards:[...cards,...d.cards]}));
    } else if(data.type==="occlusion" && data.perMask && (data.masks||[]).length){
      const noteId=uid();
      const cards=data.masks.map((_,i)=>mkCard({type:"occlusion",image:data.image,masks:data.masks,maskIndex:i,noteId,extra:data.extra,hint:data.hint,tags:data.tags}));
      onChange((d)=>({...d,cards:[...cards,...d.cards]}));
    } else onChange((d)=>({...d,cards:[cardFromData(data),...d.cards]}));
  };
  const editCard=(id,data)=>{
    if(data.type==="cloze"){
      const nums=clozeNums(data.clozeText); if(!nums.length) return;
      onChange((d)=>{
        const cur=d.cards.find((c)=>c.id===id); const noteId=cur?.noteId||uid();
        const sibs=d.cards.filter((c)=>c.type==="cloze"&&c.noteId===noteId);
        const others=d.cards.filter((c)=>!(c.type==="cloze"&&c.noteId===noteId));
        const rebuilt=nums.map((n)=>{ const ex=sibs.find((c)=>c.clozeNum===n);
          return ex?{...ex,clozeText:data.clozeText,extra:data.extra,hint:data.hint,tags:data.tags}
                   :mkCard({type:"cloze",clozeText:data.clozeText,clozeNum:n,noteId,extra:data.extra,hint:data.hint,tags:data.tags}); });
        return {...d,cards:[...rebuilt,...others]};
      });
    } else if(data.type==="occlusion" && data.perMask && (data.masks||[]).length){
      onChange((d)=>{
        const cur=d.cards.find((c)=>c.id===id); const noteId=cur?.noteId||uid();
        const sibs=d.cards.filter((c)=>c.type==="occlusion"&&c.noteId===noteId);
        const others=d.cards.filter((c)=>!(c.type==="occlusion"&&c.noteId===noteId));
        const rebuilt=data.masks.map((_,i)=>{ const ex=sibs.find((c)=>c.maskIndex===i);
          return ex?{...ex,image:data.image,masks:data.masks,extra:data.extra,hint:data.hint,tags:data.tags}
                   :mkCard({type:"occlusion",image:data.image,masks:data.masks,maskIndex:i,noteId,extra:data.extra,hint:data.hint,tags:data.tags}); });
        return {...d,cards:[...rebuilt,...others]};
      });
    } else onChange((d)=>({...d,cards:d.cards.map((c)=>c.id===id?{...c,...data,maskIndex:data.type==="occlusion"?null:c.maskIndex}:c)}));
  };
  const delCard=(id)=>onChange((d)=>({...d,cards:d.cards.filter((c)=>c.id!==id)}));
  const moveRow=(id,dir)=>onChange((d)=>{ const i=d.cards.findIndex((c)=>c.id===id); const j=i+dir; if(i<0||j<0||j>=d.cards.length) return d; const cards=[...d.cards]; [cards[i],cards[j]]=[cards[j],cards[i]]; return {...d,cards}; });
  const importCards=(items)=>{ onChange((d)=>{
    let added=[];
    for(const it of items){
      if(it.type==="cloze"){ const noteId=uid();
        added=added.concat(clozeNums(it.clozeText).map((n)=>mkCard({type:"cloze",clozeText:it.clozeText,clozeNum:n,noteId,extra:it.extra,hint:it.hint,tags:it.tags}))); }
      else added.push(mkCard({type:"text",front:it.front,back:it.back,extra:it.extra,hint:it.hint,tags:it.tags}));
    }
    return {...d,cards:[...added,...d.cards]};
  }); setImporting(false); };

  const allTags=[...new Set(deck.cards.flatMap((c)=>c.tags||[]))].sort();
  const filtered=deck.cards.filter((c)=> (!tagFilter||(c.tags||[]).includes(tagFilter)) && (!search.trim()||cardStr(c).includes(search.trim().toLowerCase())) );
  const canReorder=!search.trim() && !tagFilter;
  const otherDecks=decks.filter((d)=>d.id!==deck.id);

  return <>
    <button onClick={onBack} className="flex items-center gap-1" style={{...linkBtn,marginBottom:14}}><ChevronLeft size={18} /> Mazos</button>
    <div style={{background:C.surface,borderRadius:20,padding:20,marginBottom:16,boxShadow:"0 2px 10px rgba(34,50,44,.05)"}}>
      <div className="flex items-center gap-3">
        <div style={{width:54,height:54,borderRadius:16,background:deck.color+"22",display:"grid",placeItems:"center",fontSize:28}}>{deck.emoji}</div>
        <div style={{flex:1,minWidth:0}}>
          <h1 style={{...display,fontSize:24,fontWeight:700,margin:0}}>{deck.name}</h1>
          <p style={{color:C.muted,margin:"2px 0 0",fontSize:14}}>Retención {Math.round(deck.settings.retention*100)}% · {deck.settings.newPerDay} nuevas/día</p>
        </div>
        <button onClick={()=>setShowSet((s)=>!s)} style={iconBtn} title="Ajustes"><Settings2 size={18} /></button>
      </div>
      {showSet && <DeckSettings deck={deck} onChange={onChange} onDelete={onDelete} />}
      <button onClick={onStudy} disabled={count===0} className="flex items-center justify-center gap-2" style={{...primaryBtn,width:"100%",marginTop:16,background:count?deck.color:C.line,color:count?"#fff":C.muted,boxShadow:count?`0 6px 16px ${deck.color}44`:"none"}}>
        {count ? <><Play size={18} fill="#fff" /> Estudiar {count} tarjeta{count===1?"":"s"}</> : "Todo repasado por hoy 🎉"}
      </button>
    </div>

    <div className="flex gap-1" style={{background:C.surface,borderRadius:12,padding:4,marginBottom:14,boxShadow:"0 1px 6px rgba(34,50,44,.04)"}}>
      {[["cards","Tarjetas"],["stats","Análisis"]].map(([k,lbl])=>(
        <button key={k} onClick={()=>setTab(k)} style={{flex:1,border:"none",borderRadius:9,padding:"9px 0",fontWeight:800,fontSize:14,background:tab===k?deck.color:"transparent",color:tab===k?"#fff":C.muted}}>{lbl}</button>
      ))}
    </div>

    {tab==="stats" ? <DeckStats deck={deck} log={log} /> : <>
      <div className="flex items-center justify-between" style={{marginBottom:10}}>
        <span style={{...display,fontSize:17,fontWeight:700}}>{deck.cards.length} tarjeta{deck.cards.length===1?"":"s"}</span>
        <div className="flex gap-3">
          <button onClick={()=>{setImporting(true);setAdding(false);setEditId(null);}} className="flex items-center gap-1" style={{...linkBtn,color:deck.color,fontWeight:800,fontSize:14}}><Upload size={15} /> Importar</button>
          <button onClick={()=>{setAdding(true);setImporting(false);setEditId(null);}} className="flex items-center gap-1" style={{...linkBtn,color:deck.color,fontWeight:800,fontSize:14}}><Plus size={16} /> Añadir</button>
        </div>
      </div>

      {deck.cards.length>0 && <div style={{position:"relative",marginBottom:10}}>
        <Search size={15} color={C.muted} style={{position:"absolute",left:11,top:11}} />
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar en este mazo…" style={{...input,paddingLeft:34}} />
      </div>}
      {allTags.length>0 && <div className="flex flex-wrap gap-1" style={{marginBottom:10}}>
        {allTags.map((t)=><button key={t} onClick={()=>setTagFilter(tagFilter===t?"":t)} style={{border:"none",borderRadius:999,padding:"4px 11px",fontSize:12,fontWeight:700,cursor:"pointer",background:tagFilter===t?deck.color:C.bg,color:tagFilter===t?"#fff":C.muted}}>#{t}</button>)}
      </div>}

      {importing && <ImportCards color={deck.color} onImport={importCards} onCancel={()=>setImporting(false)} />}
      {adding && <CardEditor color={deck.color} onSave={(data)=>{addCard(data);setAdding(false);}} onCancel={()=>setAdding(false)} />}
      <div className="grid gap-2">
        {filtered.length===0 && !adding && !importing && <p style={{color:C.muted,textAlign:"center",padding:24}}>{deck.cards.length===0?"Aún no hay tarjetas. Añade la primera 🌱":"Sin resultados para tu búsqueda."}</p>}
        {filtered.map((c)=>editId===c.id
          ? <CardEditor key={c.id} card={c} color={deck.color} onSave={(data)=>{editCard(c.id,data);setEditId(null);}} onCancel={()=>setEditId(null)} />
          : <div key={c.id} style={{background:C.surface,borderRadius:14,padding:"12px 14px",boxShadow:"0 1px 6px rgba(34,50,44,.04)"}}>
              <div className="flex items-start justify-between gap-2">
                <div style={{flex:1,minWidth:0}}>
                  {c.type==="occlusion"
                    ? <div className="flex items-center gap-2"><img src={c.image} style={{width:52,height:38,objectFit:"cover",borderRadius:6}} /><span style={{fontWeight:700,fontSize:14}}>Imagen · {(c.masks||[]).length} recuadro{(c.masks||[]).length===1?"":"s"}{c.maskIndex!=null?` · #${c.maskIndex+1}`:""}</span></div>
                    : c.type==="cloze"
                    ? <><div style={{fontWeight:700,fontSize:15,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{stripHTML(renderCloze(c.clozeText,c.clozeNum,false))}</div><div style={{color:C.muted,fontSize:13,marginTop:2}}>Rellenar huecos · c{c.clozeNum}</div></>
                    : <>
                        <div style={{fontWeight:700,fontSize:15}}>{stripHTML(c.front)||"(sin texto)"}{hasMedia(c.front)?" 🖼️":""}</div>
                        <div style={{color:C.muted,fontSize:14,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{stripHTML(c.back)}{hasMedia(c.back)?" 🖼️":""}</div>
                      </>}
                  {(c.tags||[]).length>0 && <div className="flex flex-wrap gap-1" style={{marginTop:5}}>{c.tags.map((t)=><span key={t} style={{fontSize:11,background:deck.color+"18",color:deck.color,borderRadius:999,padding:"1px 8px",fontWeight:700}}>#{t}</span>)}</div>}
                </div>
                <div className="flex gap-1" style={{flexShrink:0}}>
                  {canReorder && <><button onClick={()=>moveRow(c.id,-1)} style={{...iconBtn,width:28}} title="Subir"><ArrowUp size={14} /></button>
                  <button onClick={()=>moveRow(c.id,1)} style={{...iconBtn,width:28}} title="Bajar"><ArrowDown size={14} /></button></>}
                  {otherDecks.length>0 && <button onClick={()=>setMovingId(movingId===c.id?null:c.id)} style={{...iconBtn,width:28,color:movingId===c.id?deck.color:C.muted}} title="Mover a otro mazo"><Folder size={14} /></button>}
                  <button onClick={()=>{setEditId(c.id);setAdding(false);}} style={{...iconBtn,width:28}}><Pencil size={14} /></button>
                  <button onClick={()=>delCard(c.id)} style={{...iconBtn,width:28,color:C.rose}}><Trash2 size={14} /></button>
                </div>
              </div>
              {movingId===c.id && <div className="rise flex flex-wrap gap-1" style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.line}`}}>
                <span style={{fontSize:12.5,color:C.muted,fontWeight:700,alignSelf:"center"}}>Mover a:</span>
                {otherDecks.map((od)=><button key={od.id} onClick={()=>{onMove(deck.id,c.id,od.id);setMovingId(null);}} style={{border:`1px solid ${C.line}`,background:C.surface,borderRadius:999,padding:"5px 11px",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{od.emoji} {od.name}</button>)}
              </div>}
              <MaturityBar card={c} color={deck.color} />
            </div>)}
      </div>
    </>}
  </>;
}
function DeckSettings({ deck, onChange, onDelete }) {
  const s=deck.settings, r=s.retention, n=s.newPerDay;
  const set=(patch)=>onChange((d)=>({...d,settings:{...d.settings,...patch}}));
  const [confirm,setConfirm]=useState(false);
  const gi=goalInfo(deck);
  return <div className="rise" style={{marginTop:14,padding:16,borderRadius:14,background:C.bg}}>
    <div className="flex items-center justify-between" style={{marginBottom:4}}>
      <span style={{fontWeight:800,fontSize:14}}>Retención deseada</span>
      <span style={{...display,fontWeight:700,color:C.tealDeep,fontSize:16}}>{Math.round(r*100)}%</span>
    </div>
    <input type="range" min={80} max={95} step={1} value={Math.round(r*100)} onChange={(e)=>set({retention:Number(e.target.value)/100})} style={{width:"100%"}} />
    <div className="flex items-start gap-1" style={{color:C.muted,fontSize:12.5,marginTop:2}}>
      <Info size={13} style={{marginTop:1,flexShrink:0}} />
      <span>Qué proporción quieres recordar al repasar. <b>90%</b> es lo recomendado para exámenes tipo USMLE. Subir a 95% casi duplica los repasos diarios.</span>
    </div>
    <div className="flex items-center justify-between" style={{marginTop:16,marginBottom:6}}>
      <span style={{fontWeight:800,fontSize:14}}>Tarjetas nuevas por día</span>
      <input type="number" min={1} max={200} value={n} onChange={(e)=>set({newPerDay:Math.max(1,Math.min(200,Number(e.target.value)||1))})} style={{...input,width:74,textAlign:"center",padding:"7px 8px"}} />
    </div>
    <div style={{color:C.muted,fontSize:12.5}}>Empieza bajo y sube gradualmente para no acumular repasos. Para USMLE suele estar en 20–50.</div>

    <div style={{height:1,background:C.line,margin:"16px 0"}} />

    <div className="flex items-center gap-2" style={{marginBottom:6}}>
      <Target size={15} color={C.tealDeep} /><span style={{fontWeight:800,fontSize:14}}>Fecha objetivo</span>
    </div>
    <input type="date" value={s.goal||""} onChange={(e)=>set({goal:e.target.value||null})} style={{...input,padding:"9px 11px"}} />
    {gi && <div style={{fontSize:12.5,color:gi.days<0?C.rose:C.tealDeep,fontWeight:700,marginTop:6}}>
      {gi.days<0?`La meta pasó hace ${-gi.days} día(s).`:gi.days===0?"La meta es hoy.":`Faltan ${gi.days} día(s).`}
      {gi.unseen>0 && gi.days>0 && <> Te quedan {gi.unseen} tarjetas sin ver → necesitas <b>~{gi.perDay}/día</b>.
        {gi.perDay!==n && <button onClick={()=>set({newPerDay:Math.max(1,Math.min(200,gi.perDay))})} style={{...linkBtn,color:C.tealDeep,fontSize:12.5,marginLeft:6}}>Aplicar</button>}</>}
    </div>}

    <label className="flex items-center gap-2" style={{marginTop:14,fontSize:13.5,cursor:"pointer"}}>
      <input type="checkbox" checked={s.includeNew!==false} onChange={(e)=>set({includeNew:e.target.checked})} style={{accentColor:deck.color,width:16,height:16}} />
      Incluir tarjetas nuevas al estudiar <span style={{color:C.muted}}>(si lo apagas, solo repasas las vencidas)</span>
    </label>

    <div className="flex items-center justify-between" style={{marginTop:14,marginBottom:2}}>
      <span style={{fontWeight:800,fontSize:14}}>Límite de tiempo por sesión</span>
      <div className="flex items-center gap-1">
        <input type="number" min={0} max={180} value={s.minutes||0} onChange={(e)=>set({minutes:Math.max(0,Math.min(180,Number(e.target.value)||0))})} style={{...input,width:64,textAlign:"center",padding:"7px 8px"}} />
        <span style={{fontSize:13,color:C.muted}}>min</span>
      </div>
    </div>
    <div style={{color:C.muted,fontSize:12.5}}>0 = sin límite. Al agotarse, la sesión termina.</div>

    {confirm
      ? <div className="flex items-center gap-2" style={{marginTop:16}}>
          <span style={{fontSize:13,color:C.ink,flex:1}}>¿Borrar este mazo?</span>
          <button onClick={onDelete} style={{...ghostBtn,padding:"8px 14px",color:"#fff",background:C.rose,border:"none"}}>Sí, borrar</button>
          <button onClick={()=>setConfirm(false)} style={{...ghostBtn,padding:"8px 14px"}}>No</button>
        </div>
      : <button onClick={()=>setConfirm(true)} className="flex items-center gap-1" style={{...linkBtn,color:C.rose,marginTop:16,fontSize:14}}><Trash2 size={14} /> Borrar mazo</button>}
  </div>;
}
function MaturityBar({ card, color }) {
  const m=maturity(card);
  return <div className="flex items-center gap-2" style={{marginTop:8}}>
    <span style={{fontSize:13}}>{m.icon}</span>
    <div style={{flex:1,height:5,background:C.bg,borderRadius:999,overflow:"hidden"}}>
      <div style={{width:m.pct+"%",height:"100%",background:color,borderRadius:999,transition:"width .4s ease"}} />
    </div>
    <span style={{fontSize:11.5,color:C.muted,fontWeight:700,minWidth:62,textAlign:"right"}}>{m.label}</span>
  </div>;
}
// ── Utilidades de contenido enriquecido ────────────────────────────────
function compressImage(file, maxW=1100, q=0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => { const scale = Math.min(1, maxW/img.width);
      const w = Math.round(img.width*scale), h = Math.round(img.height*scale);
      const cv = document.createElement("canvas"); cv.width=w; cv.height=h;
      cv.getContext("2d").drawImage(img,0,0,w,h); URL.revokeObjectURL(url);
      resolve(cv.toDataURL("image/jpeg", q)); };
    img.onerror = reject; img.src = url;
  });
}
const fileToB64 = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(",")[1]);
  r.onerror = () => rej(new Error("No se pudo leer el archivo"));
  r.readAsDataURL(file);
});
const stripHTML = (html) => { const d = document.createElement("div"); d.innerHTML = html||""; return (d.textContent||"").trim(); };
const hasMedia = (html) => /<(img|table)/i.test(html||"");
function RichHTML({ html, style, className }) { return <div className={"rich "+(className||"")} style={style} dangerouslySetInnerHTML={{__html: html||""}} />; }

// Campo editable con barra de herramientas (negrita, listas, imagen, tabla)
const tbBtn = { border:"none", background:"transparent", width:28, height:26, borderRadius:7, display:"grid", placeItems:"center", color:C.ink, cursor:"pointer" };
const tblLbl = { display:"flex", alignItems:"center", gap:6, fontSize:12.5, color:C.ink, fontWeight:700 };
const numInp = { width:52, border:`1.5px solid ${C.line}`, borderRadius:8, padding:"5px 7px", fontSize:14, fontFamily:"inherit", textAlign:"center", outline:"none", background:C.surface, color:C.ink };
function RichField({ initial, onInput, placeholder }) {
  const ref = useRef(); const fileRef = useRef(); const savedRange = useRef(null);
  const [showTable, setShowTable] = useState(false);
  const [tCols, setTCols] = useState(3), [tRows, setTRows] = useState(2);
  useEffect(() => { if (ref.current) ref.current.innerHTML = initial || ""; }, []);
  const sync = () => onInput(ref.current.innerHTML);
  const cmd = (c, v) => { ref.current.focus(); document.execCommand(c, false, v); sync(); };
  const captureSel = () => { const s = window.getSelection();
    savedRange.current = (s && s.rangeCount && ref.current.contains(s.anchorNode)) ? s.getRangeAt(0).cloneRange() : null; };
  const buildTable = (cols, rows) => { const c = Math.max(1, Math.min(12, cols||1)), r = Math.max(1, Math.min(30, rows||1));
    let h = "<table>"; for (let i=0;i<r;i++){ h+="<tr>"; for (let j=0;j<c;j++) h+="<td><br></td>"; h+="</tr>"; } return h + "</table><p><br></p>"; };
  const insTable = () => { ref.current.focus();
    if (savedRange.current) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange.current); document.execCommand("insertHTML", false, buildTable(tCols, tRows)); }
    else { ref.current.innerHTML += buildTable(tCols, tRows); }
    sync(); setShowTable(false); };
  const onImg = async (e) => { const f = e.target.files?.[0]; if(!f) return; try { const u = await compressImage(f); cmd("insertHTML", `<img src="${u}"/>`); } catch {} e.target.value=""; };
  const onPaste = async (e) => {
    const items = e.clipboardData?.items || [];
    for (const it of items) { if (it.type.startsWith("image/")) { e.preventDefault(); const f = it.getAsFile();
      if (f) { try { const u = await compressImage(f); cmd("insertHTML", `<img src="${u}"/>`); } catch {} } return; } }
    setTimeout(sync, 0); // deja pegar tablas/HTML y luego guarda
  };
  const Tb = ({ c, children, title }) => <button type="button" title={title}
    onMouseDown={(e)=>e.preventDefault()} onClick={()=> c==="img" ? fileRef.current.click() : c==="table" ? (captureSel(), setShowTable((v)=>!v)) : cmd(c)} style={tbBtn}>{children}</button>;
  return <div style={{border:`1.5px solid ${C.line}`,borderRadius:12,overflow:"hidden",background:C.surface}}>
    <div className="flex flex-wrap gap-1" style={{padding:6,borderBottom:`1px solid ${C.line}`,background:C.bg}}>
      <Tb c="bold" title="Negrita"><b style={{fontSize:14}}>B</b></Tb>
      <Tb c="italic" title="Cursiva"><i style={{fontSize:14}}>I</i></Tb>
      <Tb c="underline" title="Subrayado"><u style={{fontSize:14}}>U</u></Tb>
      <Tb c="insertUnorderedList" title="Lista"><span style={{fontSize:15,lineHeight:1}}>•</span></Tb>
      <Tb c="superscript" title="Superíndice"><span style={{fontSize:12,fontWeight:800}}>x²</span></Tb>
      <Tb c="subscript" title="Subíndice"><span style={{fontSize:12,fontWeight:800}}>x₂</span></Tb>
      <button type="button" title="Resaltar" onMouseDown={(e)=>e.preventDefault()} onClick={()=>{ ref.current.focus(); document.execCommand("hiliteColor",false,"#FDE68A"); sync(); }} style={{...tbBtn,background:"#FDE68A"}}><span style={{fontSize:12,fontWeight:800}}>H</span></button>
      <Tb c="img" title="Insertar imagen"><Upload size={14} /></Tb>
      <Tb c="table" title="Insertar tabla"><Layers size={14} /></Tb>
      <input ref={fileRef} type="file" accept="image/*" onChange={onImg} style={{display:"none"}} />
    </div>
    {showTable && <div className="flex items-center gap-2" style={{padding:"8px 10px",borderBottom:`1px solid ${C.line}`,background:C.cream,flexWrap:"wrap"}}>
      <span style={{fontSize:12.5,color:C.muted,fontWeight:800}}>Tabla</span>
      <label style={tblLbl}>Columnas<input type="number" min={1} max={12} value={tCols} onChange={(e)=>setTCols(Math.max(1,Math.min(12,+e.target.value||1)))} style={numInp} /></label>
      <label style={tblLbl}>Filas<input type="number" min={1} max={30} value={tRows} onChange={(e)=>setTRows(Math.max(1,Math.min(30,+e.target.value||1)))} style={numInp} /></label>
      <button onMouseDown={(e)=>e.preventDefault()} onClick={insTable} style={{...primaryBtn,padding:"7px 13px",fontSize:13,boxShadow:"none"}}>Insertar</button>
      <button onMouseDown={(e)=>e.preventDefault()} onClick={()=>setShowTable(false)} style={{...ghostBtn,padding:"7px 12px",fontSize:13}}>Cancelar</button>
    </div>}
    <div ref={ref} className="rich" contentEditable suppressContentEditableWarning data-ph={placeholder}
      onInput={sync} onPaste={onPaste} style={{minHeight:62,padding:"10px 12px",fontSize:15,lineHeight:1.5}} />
  </div>;
}

// ── Ocultar en imagen (recuadros) ──────────────────────────────────────
function OccCanvas({ image, masks, setMasks, color }) {
  const wrap = useRef(); const start = useRef(null); const [draft, setDraft] = useState(null);
  const rel = (e) => { const r = wrap.current.getBoundingClientRect();
    return { x: Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)), y: Math.min(1,Math.max(0,(e.clientY-r.top)/r.height)) }; };
  const down = (e) => { if(e.target.dataset.del) return; e.preventDefault(); wrap.current.setPointerCapture(e.pointerId); start.current = rel(e); setDraft({x:start.current.x,y:start.current.y,w:0,h:0}); };
  const move = (e) => { if(!start.current) return; const p = rel(e); setDraft({ x:Math.min(p.x,start.current.x), y:Math.min(p.y,start.current.y), w:Math.abs(p.x-start.current.x), h:Math.abs(p.y-start.current.y) }); };
  const up = () => { if(draft && draft.w>0.02 && draft.h>0.02) setMasks([...masks, draft]); setDraft(null); start.current=null; };
  return <div ref={wrap} className="occ-wrap" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
    <img src={image} draggable={false} />
    {masks.map((m,i)=><div key={i} className="occ-mask" style={{left:m.x*100+"%",top:m.y*100+"%",width:m.w*100+"%",height:m.h*100+"%",background:color+"CC",border:`2px solid ${color}`,borderRadius:4}}>
      <button data-del="1" onClick={()=>setMasks(masks.filter((_,j)=>j!==i))} style={{position:"absolute",top:-2,right:-2,border:"none",background:"rgba(0,0,0,.45)",color:"#fff",borderRadius:6,width:18,height:18,fontSize:12,lineHeight:"16px",cursor:"pointer"}}>×</button>
    </div>)}
    {draft && <div className="occ-mask" style={{left:draft.x*100+"%",top:draft.y*100+"%",width:draft.w*100+"%",height:draft.h*100+"%",background:color+"55",border:`2px dashed ${color}`,borderRadius:4}} />}
  </div>;
}
function OcclusionView({ image, masks, masked, only }) {
  return <div className="occ-wrap">
    <img src={image} draggable={false} />
    {(masks||[]).map((m,i)=>{ const cover = masked && (only==null || only===i); const outline = !cover && only===i;
      return <div key={i} className="occ-mask" style={{left:m.x*100+"%",top:m.y*100+"%",width:m.w*100+"%",height:m.h*100+"%",background:cover?C.tealDeep:"transparent",border:outline?`2px solid ${C.tealDeep}`:"none",borderRadius:4}} />; })}
  </div>;
}

// ── Editor de tarjeta (texto enriquecido u ocultar en imagen) ──────────
function CardEditor({ card, color, onSave, onCancel }) {
  const [mode, setMode] = useState(card?.type==="occlusion" ? "occ" : card?.type==="cloze" ? "cloze" : "text");
  const fRef = useRef(card?.front||""), bRef = useRef(card?.back||""), eRef = useRef(card?.extra||"");
  const [img, setImg] = useState(card?.image||null);
  const [masks, setMasks] = useState(card?.masks||[]);
  const [perMask, setPerMask] = useState(card?.maskIndex!=null);
  const [cz, setCz] = useState(card?.clozeText||"");
  const [hint, setHint] = useState(card?.hint||"");
  const [tags, setTags] = useState((card?.tags||[]).join(", "));
  const [, force] = useState(0); const bump = () => force((n)=>n+1);
  const bgRef = useRef(); const czRef = useRef();
  const pickBg = async (e) => { const fl = e.target.files?.[0]; if(!fl) return; try { const u = await compressImage(fl,1300,0.85); setImg(u); setMasks([]); } catch {} e.target.value=""; };
  const nums = clozeNums(cz);
  const [nextN, setNextN] = useState(1);
  useEffect(()=>{ setNextN((clozeNums(cz).slice(-1)[0]||0)+1); },[]);
  const markCloze = (n) => { const ta=czRef.current; if(!ta) return; const s=ta.selectionStart,e=ta.selectionEnd; if(s===e) return;
    const v=ta.value; const nv=v.slice(0,s)+`{{c${n}::`+v.slice(s,e)+`}}`+v.slice(e); setCz(nv); setNextN(Math.max(nextN,n)+1); setTimeout(()=>ta.focus(),0); };
  const parsedTags = tags.split(",").map((t)=>t.trim()).filter(Boolean);
  const okText = stripHTML(fRef.current)!=="" && stripHTML(bRef.current)!=="";
  const okOcc = !!img && masks.length>0;
  const okCz = nums.length>0;
  const ok = mode==="text" ? okText : mode==="occ" ? okOcc : okCz;
  const save = () => { if(!ok) return;
    if (mode==="text") onSave({ type:"text", front:fRef.current, back:bRef.current, extra:eRef.current, hint, tags:parsedTags });
    else if (mode==="occ") onSave({ type:"occlusion", image:img, masks, perMask, extra:eRef.current, front:"", back:"", hint, tags:parsedTags });
    else onSave({ type:"cloze", clozeText:cz, extra:eRef.current, hint, tags:parsedTags }); };
  return <div className="rise" style={{background:C.cream,borderRadius:14,padding:14,marginBottom:8,border:`1.5px solid ${color}44`}}>
    <div className="flex gap-1" style={{background:C.bg,borderRadius:10,padding:3,marginBottom:12}}>
      {[["text","Texto"],["cloze","Huecos"],["occ","Imagen"]].map(([k,l])=>(
        <button key={k} onClick={()=>setMode(k)} style={{flex:1,border:"none",borderRadius:8,padding:"7px 0",fontWeight:800,fontSize:13,background:mode===k?color:"transparent",color:mode===k?"#fff":C.muted}}>{l}</button>
      ))}
    </div>
    {mode==="text" ? <>
      <label style={miniLabel}>Pregunta / frente</label>
      <RichField initial={card?.front} placeholder="Lo que verás primero…" onInput={(h)=>{fRef.current=h;bump();}} />
      <label style={{...miniLabel,marginTop:10}}>Respuesta / reverso</label>
      <RichField initial={card?.back} placeholder="Lo que quieres recordar…" onInput={(h)=>{bRef.current=h;bump();}} />
    </> : mode==="occ" ? <>
      {img ? <>
        <p style={{fontSize:12.5,color:C.muted,margin:"0 0 6px"}}>Arrastra sobre la imagen para dibujar recuadros que ocultarán esa zona. Toca la × para borrar uno.</p>
        <OccCanvas image={img} masks={masks} setMasks={(u)=>{setMasks(u);bump();}} color={color} />
        <label className="flex items-center gap-2" style={{marginTop:10,fontSize:13,cursor:"pointer"}}>
          <input type="checkbox" checked={perMask} onChange={(e)=>setPerMask(e.target.checked)} style={{accentColor:color,width:16,height:16}} />
          Una tarjeta por recuadro {perMask && masks.length>0 && <span style={{color:C.muted}}>({masks.length} tarjeta{masks.length===1?"":"s"})</span>}
        </label>
        <button onClick={()=>bgRef.current.click()} style={{...linkBtn,color,marginTop:8,fontSize:13.5,display:"block"}}>Cambiar imagen</button>
      </> : <button onClick={()=>bgRef.current.click()} className="flex items-center justify-center gap-2" style={{width:"100%",padding:"30px 0",borderRadius:12,border:`2px dashed ${color}66`,background:"transparent",color,fontWeight:800}}><Upload size={18} /> Subir imagen</button>}
      <input ref={bgRef} type="file" accept="image/*" onChange={pickBg} style={{display:"none"}} />
    </> : <>
      <label style={miniLabel}>Texto con huecos</label>
      <textarea ref={czRef} value={cz} onChange={(e)=>setCz(e.target.value)} rows={3}
        placeholder="El {{c1::caudado}} y el {{c2::putamen}} forman el estriado." style={{...input,resize:"vertical"}} />
      <div className="flex items-center gap-2" style={{marginTop:8,flexWrap:"wrap"}}>
        <button onClick={()=>markCloze(nextN)} style={{...primaryBtn,background:color,padding:"8px 12px",fontSize:13,boxShadow:"none"}}>Ocultar selección (c{nextN})</button>
        {nextN>1 && <button onClick={()=>markCloze(nextN-1)} style={{...ghostBtn,padding:"8px 12px",fontSize:13}}>Añadir a c{nextN-1}</button>}
      </div>
      <p style={{fontSize:12,color:C.muted,margin:"8px 0 0",lineHeight:1.5}}>Selecciona una palabra y pulsa el botón para ocultarla. Cada número (c1, c2…) crea una tarjeta distinta; reutiliza el mismo número para ocultar varias cosas en la misma tarjeta. Formato: <code>{"{{c1::respuesta}}"}</code> o con pista <code>{"{{c1::respuesta::pista}}"}</code>.</p>
      {nums.length>0 && <div style={{marginTop:10,padding:10,borderRadius:10,background:C.surface,border:`1px solid ${C.line}`}}>
        <div style={{fontSize:12.5,fontWeight:800,color:C.muted,marginBottom:6}}>Se crearán {nums.length} tarjeta{nums.length===1?"":"s"}:</div>
        {nums.map((n)=><div key={n} style={{fontSize:13.5,padding:"3px 0"}}><b style={{color}}>c{n}</b> <span dangerouslySetInnerHTML={{__html:renderCloze(cz,n,false)}} /></div>)}
      </div>}
    </>}
    <label style={{...miniLabel,marginTop:12}}>Etiquetas (separadas por coma)</label>
    <input value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="p. ej. neuro, farmacología" style={input} />
    <label style={{...miniLabel,marginTop:10}}>Pista (opcional)</label>
    <input value={hint} onChange={(e)=>setHint(e.target.value)} placeholder="Se puede mostrar antes de la respuesta." style={input} />
    <label style={{...miniLabel,marginTop:10}}>Explicación (opcional)</label>
    <RichField initial={card?.extra} placeholder="Notas, contexto, mnemotecnia… se muestra junto con la respuesta." onInput={(h)=>{eRef.current=h;bump();}} />
    <div className="flex gap-2" style={{marginTop:12}}>
      <button onClick={save} disabled={!ok} style={{...primaryBtn,background:color,flex:1,opacity:ok?1:0.5}}><Check size={16} style={{marginRight:4,verticalAlign:-3}} /> Guardar</button>
      <button onClick={onCancel} style={ghostBtn}>Cancelar</button>
    </div>
  </div>;
}

const shuffle=(a)=>{ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const qText=(c)=> !c?"" : c.type==="cloze"?stripHTML(renderCloze(c.clozeText,c.clozeNum,false)) : c.type==="occlusion"?"" : stripHTML(c.front);
const aText=(c)=> !c?"" : c.type==="cloze"?stripHTML(renderCloze(c.clozeText,c.clozeNum,true)) : c.type==="occlusion"?"" : (stripHTML(c.back)+". "+stripHTML(c.extra));
const speakText=(t)=>{ try{ if(!t) return; window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(t)); }catch{} };
const mmss=(s)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

function Study({ session, decks, updateDeck, onReview, onBack, onHome }) {
  const byId = Object.fromEntries(decks.map((d)=>[d.id,d]));
  const [queue,setQueue]=useState(()=>{
    const refs=[];
    for(const id of session.deckIds){ const d=byId[id]; if(!d) continue;
      dueReviews(d).sort((a,b)=>a.due-b.due).forEach((c)=>refs.push({deckId:id,cardId:c.id}));
      if(session.includeNew!==false){ const nuevas=shuffle(newCardsOf(d).slice()).slice(0,newAllowed(d));
        nuevas.forEach((c)=>refs.push({deckId:id,cardId:c.id})); }
    }
    if(session.deckIds.length>1) shuffle(refs);
    return refs;
  });
  const [flipped,setFlipped]=useState(false);
  const [showHint,setShowHint]=useState(false);
  const [done,setDone]=useState(0);
  const [timeUp,setTimeUp]=useState(false);
  const [left,setLeft]=useState(session.minutes>0?session.minutes*60:0);
  const startTotal=useRef(queue.length);
  const ref=queue[0];
  const curDeck=ref?byId[ref.deckId]:null;
  const current=curDeck?curDeck.cards.find((c)=>c.id===ref.cardId):null;
  const color=curDeck?curDeck.color:C.teal;
  const retention=curDeck?curDeck.settings.retention:0.9;

  useEffect(()=>{ if(!session.minutes) return; const t=setInterval(()=>setLeft((l)=>{ if(l<=1){clearInterval(t);setTimeUp(true);return 0;} return l-1; }),1000); return ()=>clearInterval(t); },[]);

  const rate=useCallback((g)=>{
    if(!current) return;
    const wasNew=current.state==="new"||!current.state;
    const elapsed=wasNew?0:Math.max(0,(now()-(current.lastReview||now()))/DAY);
    const R=wasNew?null:retrievability(elapsed,current.stability);
    const updated=fsrs(current,g,retention);
    updateDeck(ref.deckId,(d)=>{
      const cards=d.cards.map((c)=>c.id===current.id?updated:c);
      let daily=d.daily?.date===todayKey()?d.daily:{date:todayKey(),newDone:0};
      if(wasNew) daily={...daily,newDone:daily.newDone+1};
      return {...d,cards,daily};
    });
    onReview({ t:now(), deck:ref.deckId, card:current.id, g, st:wasNew?"new":"review",
      elapsed:Math.round(elapsed*1000)/1000, R:R==null?null:Math.round(R*1000)/1000,
      sB:current.stability==null?null:Math.round(current.stability*100)/100, sA:Math.round(updated.stability*100)/100, dA:Math.round(updated.difficulty*100)/100 });
    setFlipped(false); setShowHint(false);
    setQueue((q)=>(g===1?[...q.slice(1),q[0]]:q.slice(1)));
    if(g!==1) setDone((n)=>n+1);
  },[current,retention,updateDeck,onReview,ref]);

  useEffect(()=>{
    const h=(e)=>{ if(!current) return;
      if(e.code==="Space"){e.preventDefault();setFlipped((f)=>!f);}
      else if(flipped&&["Digit1","Digit2","Digit3"].includes(e.code)) rate({Digit1:1,Digit2:3,Digit3:4}[e.code]); };
    window.addEventListener("keydown",h); return ()=>window.removeEventListener("keydown",h);
  },[flipped,current,rate]);

  if(!current || timeUp) return <SessionDone count={done} title={session.title} timeUp={timeUp} color={color} onHome={onHome} onBack={onBack} />;
  const progress=startTotal.current?Math.round((done/startTotal.current)*100):0;

  return <>
    <div className="flex items-center justify-between" style={{marginBottom:16}}>
      <button onClick={onBack} className="flex items-center gap-1" style={linkBtn}><ChevronLeft size={18} /> Salir</button>
      <div className="flex items-center gap-3">
        {session.minutes>0 && <span style={{color:left<60?C.rose:C.muted,fontWeight:800,fontSize:14}}>⏱️ {mmss(left)}</span>}
        <button onClick={()=>speakText(flipped?aText(current):qText(current))} title="Leer en voz alta" style={iconBtn}><Volume2 size={16} /></button>
        <span style={{color:C.muted,fontWeight:800,fontSize:14}}>{queue.length} restantes</span>
      </div>
    </div>
    <div style={{height:8,background:C.surface,borderRadius:999,overflow:"hidden",marginBottom:20}}>
      <div style={{width:progress+"%",height:"100%",background:color,borderRadius:999,transition:"width .4s ease"}} />
    </div>
    <div style={{perspective:1600,marginBottom:22}} onClick={()=>setFlipped((f)=>!f)}>
      <div className={"card3d"+(flipped?" flip":"")} style={{position:"relative",minHeight:300}}>
        <div className="face front" style={faceStyle(C.surface)}>
          <span style={faceTag(color)}>Pregunta{session.deckIds.length>1?` · ${curDeck.emoji} ${curDeck.name}`:""}</span>
          {current.type==="occlusion"
            ? <OcclusionView image={current.image} masks={current.masks} masked={true} only={current.maskIndex} />
            : current.type==="cloze"
            ? <RichHTML html={renderCloze(current.clozeText,current.clozeNum,false)} style={faceText} />
            : <RichHTML html={current.front} style={faceText} />}
          <span style={{color:C.muted,fontSize:13,marginTop:18}}>Toca o pulsa <kbd style={kbd}>espacio</kbd> para ver la respuesta</span>
        </div>
        <div className="face back" style={{...faceStyle(C.surface),background:`linear-gradient(${color}12, ${color}12), ${C.surface}`,position:"absolute",inset:0,borderColor:color+"40",overflow:"auto",justifyContent:"flex-start",paddingTop:24,paddingBottom:24}}>
          <span style={faceTag(color)}>Respuesta</span>
          {current.type==="occlusion"
            ? <OcclusionView image={current.image} masks={current.masks} masked={false} only={current.maskIndex} />
            : current.type==="cloze"
            ? <RichHTML html={renderCloze(current.clozeText,current.clozeNum,true)} style={faceText} />
            : <RichHTML html={current.back} style={faceText} />}
          {(stripHTML(current.extra) || hasMedia(current.extra))
            ? <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.line}`,width:"100%",maxWidth:460}}><RichHTML html={current.extra} style={{fontSize:14.5,color:C.muted,textAlign:"left"}} /></div>
            : null}
        </div>
      </div>
    </div>
    {flipped
      ? <div className="rise">
          <p style={{textAlign:"center",color:C.muted,fontSize:14,marginBottom:10,fontWeight:700}}>¿Qué tan bien lo recordaste?</p>
          <div className="grid gap-2" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
            <RateBtn color={C.rose} label="Otra vez" sub="pronto" k="1" onClick={()=>rate(1)} />
            <RateBtn color={C.amber} label="Bien" sub={fmtIvl(projectDays(current,3,retention))} k="2" onClick={()=>rate(3)} />
            <RateBtn color={C.green} label="¡Fácil!" sub={fmtIvl(projectDays(current,4,retention))} k="3" onClick={()=>rate(4)} />
          </div>
        </div>
      : <>
          {current.hint ? (showHint
            ? <div className="rise" style={{marginBottom:10,padding:"11px 14px",borderRadius:12,background:C.amber+"1E",fontSize:14.5}}><b style={{color:C.amber}}>Pista:</b> {current.hint}</div>
            : <button onClick={()=>setShowHint(true)} style={{...ghostBtn,width:"100%",marginBottom:10,color:C.tealDeep}}>Mostrar pista</button>) : null}
          <button onClick={()=>setFlipped(true)} style={{...primaryBtn,width:"100%",background:color,boxShadow:`0 6px 16px ${color}44`}}>Mostrar respuesta</button>
        </>}
  </>;
}
function RateBtn({ color, label, sub, k, onClick }) {
  return <button onClick={onClick} className="pop" style={{background:C.surface,border:`2px solid ${color}`,borderRadius:16,padding:"14px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
    <span style={{...display,fontWeight:700,fontSize:16,color}}>{label}</span>
    <span style={{fontSize:12,color:C.muted}}>{sub}</span>
    <kbd style={{...kbd,marginTop:4,borderColor:color+"55"}}>{k}</kbd>
  </button>;
}
function SessionDone({ count, title, timeUp, color, onHome, onBack }) {
  return <div className="rise" style={{textAlign:"center",paddingTop:40}}>
    <div style={{fontSize:56,marginBottom:8}}>{timeUp?"⏱️":"🎉"}</div>
    <h1 style={{...display,fontSize:28,fontWeight:700,margin:0}}>{timeUp?"¡Se acabó el tiempo!":"¡Sesión completa!"}</h1>
    <p style={{color:C.muted,margin:"6px 0 24px",fontSize:16}}>Repasaste {count} tarjeta{count===1?"":"s"}{title?<> de <b>{title}</b></>:null}. Tu jardín creció un poco más. 🌿</p>
    <div className="flex gap-2 justify-center" style={{flexWrap:"wrap"}}>
      <button onClick={onBack} style={ghostBtn}><BookOpen size={16} style={{verticalAlign:-3,marginRight:6}} />Volver</button>
      <button onClick={onHome} style={{...primaryBtn,background:color||C.teal}}><Sparkles size={16} style={{verticalAlign:-3,marginRight:6}} />Inicio</button>
    </div>
  </div>;
}

const faceStyle=(bg)=>({background:bg,borderRadius:24,border:`1.5px solid ${C.line}`,minHeight:300,padding:28,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",boxShadow:"0 6px 24px rgba(34,50,44,.07)",cursor:"pointer"});
const faceTag=(c)=>({...display,fontSize:13,fontWeight:700,color:c,letterSpacing:1,textTransform:"uppercase",marginBottom:14});
const faceText={...display,fontSize:22,fontWeight:600,lineHeight:1.35,margin:0,maxWidth:460};
const primaryBtn={border:"none",borderRadius:14,padding:"13px 20px",background:C.teal,color:"#fff",fontWeight:800,fontSize:15.5,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:"0 6px 16px rgba(20,184,166,.3)"};
const ghostBtn={border:`1.5px solid ${C.line}`,borderRadius:14,padding:"13px 18px",background:C.surface,color:C.ink,fontWeight:800,fontSize:15};
const linkBtn={border:"none",background:"transparent",color:C.tealDeep,fontWeight:800,fontSize:15,display:"inline-flex",alignItems:"center",padding:0};
const iconBtn={border:"none",background:C.bg,borderRadius:10,width:32,height:32,display:"grid",placeItems:"center",color:C.muted};
const chip={border:"none",borderRadius:10,width:38,height:38,display:"grid",placeItems:"center"};
const input={width:"100%",border:`1.5px solid ${C.line}`,borderRadius:12,padding:"11px 13px",fontSize:15,fontFamily:"inherit",outline:"none",background:C.surface,color:C.ink};
const secLabel={marginTop:12,marginBottom:6,fontSize:13,color:C.muted,fontWeight:700};
const miniLabel={display:"block",fontSize:12.5,fontWeight:800,color:C.muted,marginBottom:5};
const kbd={fontFamily:"inherit",fontSize:11,fontWeight:800,background:C.bg,border:`1px solid ${C.line}`,borderRadius:6,padding:"1px 6px",color:C.muted};

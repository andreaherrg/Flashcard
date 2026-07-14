import React, { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const C = { bg:"#EEF6F2", surface:"#FFFFFF", ink:"#22322C", muted:"#6B8078", line:"#DCEAE3", teal:"#14B8A6" };

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };
  const signOut = () => supabase.auth.signOut();

  const wrap = { minHeight:"100vh", background:C.bg, display:"grid", placeItems:"center", padding:20,
    fontFamily:"ui-rounded, system-ui, -apple-system, sans-serif", color:C.ink };
  const card = { background:C.surface, borderRadius:20, padding:32, maxWidth:400, width:"100%",
    textAlign:"center", boxShadow:"0 4px 20px rgba(34,50,44,.08)" };
  const btn = { border:"none", borderRadius:14, padding:"13px 22px", background:C.teal, color:"#fff",
    fontWeight:800, fontSize:15.5, cursor:"pointer", width:"100%", marginTop:8 };

  if (loading) return <div style={wrap}><p style={{color:C.muted}}>Cargando…</p></div>;

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{fontSize:44}}>🌿</div>
        <h1 style={{fontSize:28, margin:"8px 0 4px"}}>Repaso</h1>
        {session ? (
          <>
            <p style={{color:C.muted, margin:"6px 0 20px"}}>
              ¡Hola! Sesión iniciada como<br/><b style={{color:C.ink}}>{session.user.email}</b>
            </p>
            <div style={{background:"#E9F9F1", border:`1px solid ${C.line}`, borderRadius:12, padding:14, marginBottom:16, fontSize:14}}>
              ✅ El login funciona. Ya podemos construir la app.
            </div>
            <button onClick={signOut} style={{...btn, background:"transparent", color:C.muted, border:`1.5px solid ${C.line}`}}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <p style={{color:C.muted, margin:"6px 0 20px"}}>Tu jardín de memoria, en todos tus dispositivos.</p>
            <button onClick={signIn} style={btn}>Entrar con Google</button>
            {error && <p style={{color:"#FB7185", fontSize:13, marginTop:12}}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

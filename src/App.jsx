import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { Analytics } from "@vercel/analytics/react";
import translations from "./translations";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const detectLang = () => {
  const lang = navigator.language || "en";
  return lang.startsWith("es") ? "es" : "en";
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --soil:#2c1a0e; --bark:#4a2e1a; --moss:#3a5c35; --leaf:#5a8a4a;
      --sprout:#8ab87a; --dew:#c8e6b8; --sky:#b8d4e8; --cream:#f5f0e8;
      --sun:#e8c46a; --tomato:#c85a3a; --text:#1a1208; --muted:#7a6a58;
    }
    body { font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--text); min-height:100vh; }
    ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:var(--dew)} ::-webkit-scrollbar-thumb{background:var(--leaf);border-radius:3px}
    .app-wrapper{max-width:1100px;margin:0 auto;padding:0 16px 80px}
    .header{display:flex;align-items:center;justify-content:space-between;padding:28px 0 20px;border-bottom:2px solid var(--dew);margin-bottom:32px;flex-wrap:wrap;gap:12px}
    .logo{display:flex;align-items:center;gap:12px}
    .logo-icon{width:44px;height:44px;background:var(--moss);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px}
    .logo h1{font-family:'Playfair Display',serif;font-size:1.6rem;color:var(--soil);line-height:1}
    .logo span{font-size:0.75rem;color:var(--muted);font-weight:300;letter-spacing:0.08em;text-transform:uppercase}
    .nav{display:flex;gap:6px;background:var(--dew);padding:6px;border-radius:14px;flex-wrap:wrap}
    .nav-btn{padding:8px 16px;border:none;border-radius:10px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;transition:all 0.2s;background:transparent;color:var(--muted);display:flex;align-items:center;gap:6px}
    .nav-btn.active{background:var(--moss);color:white;box-shadow:0 2px 8px rgba(58,92,53,0.35)}
    .nav-btn:hover:not(.active){background:white;color:var(--soil)}
    .location-bar{display:flex;align-items:center;gap:12px;background:white;border:1.5px solid var(--dew);border-radius:14px;padding:12px 18px;margin-bottom:28px;flex-wrap:wrap}
    .location-bar input{border:none;outline:none;font-family:'DM Sans',sans-serif;font-size:0.9rem;flex:1;min-width:120px;background:transparent;color:var(--text)}
    .location-bar input::placeholder{color:var(--muted)}
    .btn-primary{background:var(--moss);color:white;border:none;border-radius:10px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.2s;white-space:nowrap}
    .btn-primary:hover{background:var(--bark);transform:translateY(-1px)}
    .btn-primary:disabled{opacity:0.6;cursor:not-allowed;transform:none}
    .btn-secondary{background:white;color:var(--moss);border:1.5px solid var(--moss);border-radius:10px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.2s;white-space:nowrap}
    .btn-secondary:hover{background:var(--dew)}
    .btn-danger{background:white;color:var(--tomato);border:1.5px solid var(--tomato);border-radius:10px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:500;cursor:pointer;transition:all 0.2s}
    .btn-danger:hover{background:#fdf0ec}
    .btn-lang{background:var(--dew);border:none;border-radius:20px;padding:6px 12px;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:600;cursor:pointer;color:var(--moss);transition:all 0.2s}
    .btn-lang:hover{background:var(--sprout);color:white}
    .card{background:white;border:1.5px solid var(--dew);border-radius:18px;padding:22px;box-shadow:0 2px 12px rgba(44,26,14,0.06)}
    .weather-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:12px;margin-bottom:28px}
    .weather-tile{background:linear-gradient(135deg,var(--sky) 0%,var(--dew) 100%);border-radius:14px;padding:14px;text-align:center}
    .weather-tile .val{font-family:'DM Mono',monospace;font-size:1.4rem;font-weight:500;color:var(--soil)}
    .weather-tile .lbl{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);margin-top:3px}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    @media(max-width:700px){.two-col{grid-template-columns:1fr}.nav{gap:4px}.nav-btn{padding:7px 11px;font-size:0.78rem}}
    .rec-card{border-radius:14px;padding:16px;border:1.5px solid}
    .rec-card.green{border-color:var(--sprout);background:#f0f7ec}
    .rec-card.amber{border-color:var(--sun);background:#fdf6e3}
    .rec-card.red{border-color:var(--tomato);background:#fdf0ec}
    .rec-card h3{font-size:0.9rem;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:6px}
    .rec-card p{font-size:0.82rem;color:var(--muted);line-height:1.5}
    .plant-card{border:1.5px solid var(--dew);border-radius:14px;padding:14px;cursor:pointer;transition:all 0.2s;background:white}
    .plant-card:hover{border-color:var(--leaf);transform:translateY(-2px);box-shadow:0 4px 16px rgba(58,92,53,0.12)}
    .plant-card.selected{border-color:var(--moss);background:#f0f7ec}
    .plant-emoji{font-size:2rem;margin-bottom:8px}
    .plant-name{font-weight:600;font-size:0.9rem;color:var(--soil)}
    .plant-tag{display:inline-block;background:var(--dew);color:var(--moss);border-radius:6px;padding:2px 8px;font-size:0.7rem;font-weight:500;margin-top:5px}
    .ai-box{background:linear-gradient(135deg,#f0f7ec 0%,var(--cream) 100%);border:1.5px solid var(--sprout);border-radius:16px;padding:20px;margin-top:20px;white-space:pre-wrap;font-size:0.88rem;line-height:1.7;color:var(--soil);min-height:80px}
    .ai-box .ai-label{font-family:'DM Mono',monospace;font-size:0.7rem;color:var(--moss);font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px}
    .dot-pulse{display:inline-flex;gap:3px;align-items:center}
    .dot-pulse span{width:5px;height:5px;background:var(--moss);border-radius:50%;animation:pulse 1.2s ease-in-out infinite}
    .dot-pulse span:nth-child(2){animation-delay:0.2s}
    .dot-pulse span:nth-child(3){animation-delay:0.4s}
    @keyframes pulse{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
    .message-list{display:flex;flex-direction:column;gap:14px;margin-bottom:20px;max-height:500px;overflow-y:auto;padding-right:4px}
    .message-item{display:flex;gap:12px;align-items:flex-start}
    .msg-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0;font-weight:700;color:white}
    .msg-body{flex:1}
    .msg-header{display:flex;align-items:baseline;gap:8px;margin-bottom:4px;flex-wrap:wrap}
    .msg-author{font-weight:600;font-size:0.85rem;color:var(--soil)}
    .msg-time{font-size:0.72rem;color:var(--muted)}
    .msg-tag{font-size:0.68rem;background:var(--dew);color:var(--moss);border-radius:5px;padding:1px 7px;font-weight:500}
    .msg-text{font-size:0.85rem;line-height:1.55;color:#3a2e22}
    .msg-actions{margin-top:6px;display:flex;gap:10px}
    .msg-action-btn{background:none;border:none;cursor:pointer;font-size:0.75rem;color:var(--muted);padding:2px 6px;border-radius:5px;transition:all 0.15s;display:flex;align-items:center;gap:4px}
    .msg-action-btn:hover{background:var(--dew);color:var(--soil)}
    .compose-box{border:1.5px solid var(--dew);border-radius:14px;overflow:hidden;background:white}
    .compose-toolbar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--dew);background:#fafaf7}
    .compose-select{border:1px solid var(--dew);border-radius:8px;padding:4px 10px;font-family:'DM Sans',sans-serif;font-size:0.8rem;background:white;color:var(--soil);outline:none}
    .compose-textarea{width:100%;border:none;outline:none;padding:14px;font-family:'DM Sans',sans-serif;font-size:0.88rem;resize:none;background:white;color:var(--text);min-height:80px}
    .compose-footer{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-top:1px solid var(--dew);background:#fafaf7}
    .compose-hint{font-size:0.75rem;color:var(--muted)}
    .month-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;margin-bottom:20px}
    .month-cell{border-radius:6px;padding:6px 4px;text-align:center;font-size:0.68rem}
    .month-cell .m{font-weight:600;color:var(--muted);margin-bottom:3px;letter-spacing:0.04em}
    .month-cell .dot{width:8px;height:8px;border-radius:50%;margin:0 auto}
    .season-legend{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px}
    .season-item{display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--muted)}
    .season-dot{width:10px;height:10px;border-radius:50%}
    .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:500}
    .badge.good{background:#e8f5e2;color:var(--moss)}
    .badge.warn{background:#fef8e7;color:#b8860b}
    .badge.info{background:#e8f0fc;color:#2255aa}
    .water-bar{height:8px;border-radius:4px;background:var(--dew);overflow:hidden;margin-top:8px}
    .water-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--sky),#5ba3cc);transition:width 0.6s ease}
    .section{margin-bottom:28px}
    .section-heading{font-family:'Playfair Display',serif;font-size:1.05rem;color:var(--soil);margin-bottom:16px;padding-bottom:8px;border-bottom:1px dashed var(--dew)}
    .tab-pills{display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap}
    .tab-pill{padding:6px 14px;border-radius:20px;border:1.5px solid var(--dew);background:white;font-size:0.8rem;font-weight:500;cursor:pointer;transition:all 0.18s;color:var(--muted)}
    .tab-pill.active{background:var(--moss);border-color:var(--moss);color:white}
    .fert-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--dew);gap:12px}
    .fert-row:last-child{border-bottom:none}
    .fert-label{font-size:0.88rem;font-weight:500;flex:1}
    .fert-freq{font-size:0.78rem;color:var(--muted)}
    .progress-bar{height:6px;width:80px;border-radius:3px;background:var(--dew);overflow:hidden}
    .progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--sun),var(--tomato))}
    .auth-wrapper{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--cream);padding:20px}
    .auth-card{background:white;border:1.5px solid var(--dew);border-radius:24px;padding:40px;width:100%;max-width:420px;box-shadow:0 4px 24px rgba(44,26,14,0.08)}
    .auth-logo{text-align:center;margin-bottom:28px}
    .auth-logo .logo-icon{width:56px;height:56px;background:var(--moss);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:12px}
    .auth-logo h1{font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--soil)}
    .auth-logo p{font-size:0.85rem;color:var(--muted);margin-top:4px}
    .auth-tabs{display:flex;gap:0;margin-bottom:24px;border:1.5px solid var(--dew);border-radius:10px;overflow:hidden}
    .auth-tab{flex:1;padding:10px;border:none;background:white;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;cursor:pointer;color:var(--muted);transition:all 0.2s}
    .auth-tab.active{background:var(--moss);color:white}
    .form-group{margin-bottom:16px}
    .form-label{display:block;font-size:0.82rem;font-weight:500;color:var(--soil);margin-bottom:6px}
    .form-input{width:100%;border:1.5px solid var(--dew);border-radius:10px;padding:10px 14px;font-family:'DM Sans',sans-serif;font-size:0.9rem;outline:none;transition:border-color 0.2s;background:white;color:var(--text)}
    .form-input:focus{border-color:var(--moss)}
    .form-error{font-size:0.8rem;color:var(--tomato);margin-top:6px}
    .form-success{font-size:0.8rem;color:var(--moss);margin-top:6px;background:#f0f7ec;padding:8px 12px;border-radius:8px}
    .user-chip{display:flex;align-items:center;gap:8px;background:var(--dew);border-radius:20px;padding:6px 12px}
    .user-chip span{font-size:0.82rem;font-weight:500;color:var(--moss)}
    .empty-board{text-align:center;padding:40px;color:var(--muted);font-size:0.9rem}
    .login-prompt{background:#f0f7ec;border:1.5px solid var(--sprout);border-radius:14px;padding:20px;text-align:center;margin-bottom:16px}
    .login-prompt p{font-size:0.88rem;color:var(--moss);margin-bottom:12px}
    .modal-overlay{position:fixed;inset:0;background:rgba(44,26,14,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}
    .modal-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--muted)}
  `}</style>
);

const PLANTS = [
  { id:"tomato",    emoji:"🍅", name:"Tomato",     tagKey:"warmSeason", water:80, fert:85 },
  { id:"lettuce",   emoji:"🥬", name:"Lettuce",    tagKey:"coolSeason", water:65, fert:40 },
  { id:"basil",     emoji:"🌿", name:"Basil",      tagKey:"warmSeason", water:55, fert:50 },
  { id:"pepper",    emoji:"🫑", name:"Pepper",     tagKey:"warmSeason", water:70, fert:75 },
  { id:"radish",    emoji:"🌱", name:"Radish",     tagKey:"quickGrow",  water:45, fert:35 },
  { id:"cucumber",  emoji:"🥒", name:"Cucumber",   tagKey:"warmSeason", water:90, fert:70 },
  { id:"spinach",   emoji:"🍃", name:"Spinach",    tagKey:"coolSeason", water:60, fert:45 },
  { id:"carrot",    emoji:"🥕", name:"Carrot",     tagKey:"rootVeg",    water:50, fert:40 },
  { id:"chilli",    emoji:"🌶️", name:"Chilli",     tagKey:"warmSeason", water:55, fert:65 },
  { id:"mint",      emoji:"🌱", name:"Mint",       tagKey:"perennial",  water:70, fert:30 },
  { id:"zucchini",  emoji:"🫛", name:"Zucchini",   tagKey:"warmSeason", water:85, fert:80 },
  { id:"strawberry",emoji:"🍓", name:"Strawberry", tagKey:"fruiting",   water:60, fert:55 },
];

const MONTHS = {
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  es: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
};

const BOARD_TAGS = ["All","Tips","Help","Harvest","Pests","Recipes"];
const BOARD_TAGS_ES = ["Todo","Consejos","Ayuda","Cosecha","Plagas","Recetas"];

const plantingSeasons = {
  tomato:    [false,false,true,true,true,false,false,false,false,false,false,false],
  lettuce:   [false,true,true,true,false,false,false,false,true,true,false,false],
  basil:     [false,false,false,true,true,true,false,false,false,false,false,false],
  pepper:    [false,false,true,true,true,false,false,false,false,false,false,false],
  radish:    [false,true,true,true,false,false,false,false,true,true,true,false],
  cucumber:  [false,false,false,true,true,true,false,false,false,false,false,false],
  spinach:   [true,true,true,false,false,false,false,false,true,true,true,false],
  carrot:    [false,true,true,true,false,false,false,false,true,true,false,false],
  chilli:    [false,false,true,true,true,false,false,false,false,false,false,false],
  mint:      [false,false,true,true,true,true,false,false,false,false,false,false],
  zucchini:  [false,false,false,true,true,true,false,false,false,false,false,false],
  strawberry:[false,false,true,true,false,false,false,false,true,false,false,false],
};

const avatarColors = ["#3a5c35","#c85a3a","#2255aa","#b8860b","#6a3a7a","#2a7a6a"];
const getAvatarColor = (str) => avatarColors[(str?.charCodeAt(0) || 0) % avatarColors.length];
const getInitials = (str) => (str || "?").slice(0,2).toUpperCase();

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, lang }) {
  const t = translations[lang];
  const [authTab, setAuthTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    onClose();
  };

  const handleSignup = async () => {
    setError(""); setSuccess(""); setLoading(true);
    if (!username.trim()) { setError(t.enterDisplayName); setLoading(false); return; }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").update({ username: username.trim() }).eq("id", data.user.id);
    }
    setSuccess(t.confirmEmail);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="auth-logo">
          <div className="logo-icon">🌿</div>
          <h1>BalconyGrow</h1>
          <p>{t.joinCommunity}</p>
        </div>
        <div className="auth-tabs">
          <button className={`auth-tab ${authTab==="login"?"active":""}`} onClick={()=>{setAuthTab("login");setError("");setSuccess("")}}>{t.logIn}</button>
          <button className={`auth-tab ${authTab==="signup"?"active":""}`} onClick={()=>{setAuthTab("signup");setError("");setSuccess("")}}>{t.signUp}</button>
        </div>
        {authTab==="signup"&&(
          <div className="form-group">
            <label className="form-label">{t.displayName}</label>
            <input className="form-input" placeholder={t.displayNamePlaceholder} value={username} onChange={e=>setUsername(e.target.value)}/>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">{t.email}</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">{t.password}</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&(authTab==="login"?handleLogin():handleSignup())}/>
        </div>
        {error&&<div className="form-error">⚠️ {error}</div>}
        {success&&<div className="form-success">✅ {success}</div>}
        <button className="btn-primary" style={{width:"100%",marginTop:8,padding:"12px"}}
          onClick={authTab==="login"?handleLogin:handleSignup} disabled={loading}>
          {loading?t.pleaseWait:authTab==="login"?t.logInBtn:t.createAccountBtn}
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState(detectLang);
  const t = translations[lang];

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [location, setLocation] = useState("Zaragoza, ES");
  const [locationInput, setLocationInput] = useState("Zaragoza, ES");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [selectedPlants, setSelectedPlants] = useState(["tomato","basil","lettuce"]);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [boardTab, setBoardTab] = useState(0);
  const [newPost, setNewPost] = useState("");
  const [newPostTag, setNewPostTag] = useState("Tip");
  const [savingPlants, setSavingPlants] = useState(false);

  const toggleLang = () => setLang(l => l === "en" ? "es" : "en");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    supabase.from("profiles").select("*").eq("id", session.user.id).single()
      .then(({ data }) => {
        if (data) { setProfile(data); if (data.selected_plants?.length) setSelectedPlants(data.selected_plants); }
      });
  }, [session]);

  const weatherIconEmoji = (id) => {
    const code = parseInt(id);
    if (code >= 200 && code < 300) return "⛈";
    if (code >= 300 && code < 400) return "🌦";
    if (code >= 500 && code < 600) return "🌧";
    if (code >= 600 && code < 700) return "❄️";
    if (code >= 700 && code < 800) return "🌫";
    if (code === 800) return "☀️";
    if (code === 801 || code === 802) return "⛅";
    return "🌥";
  };

  const fetchWeather = useCallback(async (cityName) => {
    setWeatherLoading(true); setWeatherError("");
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      const data = await res.json();
      if (data.error) { setWeatherError(data.error); setWeatherLoading(false); return; }
      setWeather({
        temp:`${data.temp}°C`, humidity:`${data.humidity}%`,
        rainfall:`~${data.rainfall}mm/mo`, sun:`${data.sun}h/day`,
        desc:data.desc, icon:weatherIconEmoji(data.weatherId),
        raw:{ temp:data.temp, humidity:data.humidity, rainfall:data.rainfall },
      });
      setLocation(cityName); setAiText("");
    } catch { setWeatherError("Could not fetch weather. Please try again."); }
    finally { setWeatherLoading(false); }
  }, []);

  useEffect(() => { fetchWeather(location); }, [fetchWeather, location]);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
    setPostsLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const savePlants = async (plants) => {
    if (!session) return;
    setSavingPlants(true);
    await supabase.from("profiles").update({ selected_plants: plants }).eq("id", session.user.id);
    setSavingPlants(false);
  };

  const togglePlant = (id) => {
    const updated = selectedPlants.includes(id) ? selectedPlants.filter(p=>p!==id) : [...selectedPlants,id];
    setSelectedPlants(updated); setAiText(""); savePlants(updated);
  };

  const getRecommendations = async () => {
    if (aiLoading || !weather) return;
    setAiLoading(true); setAiText("");
    const plantNames = selectedPlants.map(id => t.plants[id]).join(", ");
    const respondIn = lang === "es" ? "Spanish (español)" : "English";
    const prompt = `You are an expert urban balcony gardening advisor. The user is growing: ${plantNames} on a small balcony. Respond in ${respondIn}.

Location: ${location}
Conditions: ${weather.temp} temp, ${weather.humidity} humidity, ${weather.rainfall} rainfall, ${weather.sun} sun, ${weather.desc}

Give concise practical advice covering:
1. 🌱 PLANTING SEASON — Best times to plant each vegetable
2. 💧 WATERING SCHEDULE — Frequency adjusted for current weather
3. 🌿 FERTILISER PLAN — What nutrients, when, organic options
4. ⚠️ WATCH OUT — 1-2 key risks to watch for

Use bullet points. Aim for ~200 words. Be friendly and specific to container/balcony growing.`;

    try {
      const resp = await fetch("/api/recommend", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ prompt })
      });
      const data = await resp.json();
      setAiText(data?.text || "No response received. Please try again.");
    } catch { setAiText("Unable to load recommendations. Please try again."); }
    finally { setAiLoading(false); }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !session || !profile) return;
    const post = { user_id:session.user.id, author:profile.username||session.user.email, tag:BOARD_TAGS[boardTab]||"Tips", text:newPost.trim() };
    const { data } = await supabase.from("posts").insert(post).select().single();
    if (data) setPosts(prev => [data,...prev]);
    setNewPost("");
  };

  const handleLike = async (post) => {
    const newLikes = post.likes + 1;
    await supabase.from("posts").update({ likes: newLikes }).eq("id", post.id);
    setPosts(prev => prev.map(p => p.id===post.id ? {...p,likes:newLikes} : p));
  };

  const handleDeletePost = async (postId) => {
    await supabase.from("posts").delete().eq("id", postId);
    setPosts(prev => prev.filter(p => p.id!==postId));
  };

  const handleSignOut = () => { supabase.auth.signOut(); setProfile(null); };

  const currentBoardTag = BOARD_TAGS[boardTab] || "All";
  const filteredPosts = currentBoardTag==="All" ? posts : posts.filter(p=>p.tag===currentBoardTag);
  const currentMonth = new Date().getMonth();
  const rawHumidity = weather?.raw?.humidity ?? 60;
  const rawTemp     = weather?.raw?.temp     ?? 20;
  const rawRain     = weather?.raw?.rainfall ?? 40;
  const months = MONTHS[lang];
  const boardTagLabels = lang==="es" ? BOARD_TAGS_ES : BOARD_TAGS;

  return (
    <>
      <GlobalStyle />
      {showAuthModal && <AuthModal onClose={()=>setShowAuthModal(false)} lang={lang} />}
      <div className="app-wrapper">

        <header className="header">
          <div className="logo">
            <div className="logo-icon">🌿</div>
            <div>
              <h1>BalconyGrow</h1>
              <span>Urban Kitchen Garden</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <nav className="nav">
              {[
                { id:"dashboard", icon:"🏡", label:t.dashboard },
                { id:"planner",   icon:"🗓", label:t.planner },
                { id:"watering",  icon:"💧", label:t.watering },
                { id:"fertiliser",icon:"🌿", label:t.fertiliser },
                { id:"board",     icon:"💬", label:t.community },
              ].map(n=>(
                <button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
                  {n.icon} {n.label}
                </button>
              ))}
            </nav>
            <button className="btn-lang" onClick={toggleLang}>
              {lang==="en" ? "🇪🇸 ES" : "🇬🇧 EN"}
            </button>
            {session && profile ? (
              <div className="user-chip">
                <div style={{width:24,height:24,borderRadius:"50%",background:getAvatarColor(profile.username),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:700,color:"white"}}>
                  {getInitials(profile.username)}
                </div>
                <span>{profile.username||session.user.email}</span>
                <button className="btn-danger" style={{padding:"3px 8px",fontSize:"0.72rem"}} onClick={handleSignOut}>{t.logOut}</button>
              </div>
            ) : (
              <button className="btn-secondary" onClick={()=>setShowAuthModal(true)}>{t.loginSignup}</button>
            )}
          </div>
        </header>

        <div className="location-bar">
          <span style={{fontSize:"1.1rem"}}>📍</span>
          <input value={locationInput} onChange={e=>setLocationInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&fetchWeather(locationInput.trim())}
            placeholder={t.enterCity}/>
          {weatherLoading&&<span style={{fontSize:"0.85rem",color:"var(--muted)"}}>{t.fetching}</span>}
          {!weatherLoading&&weather&&<span style={{fontSize:"0.85rem",color:"var(--muted)",whiteSpace:"nowrap"}}>{weather.icon} {weather.temp} · {weather.desc}</span>}
          {weatherError&&<span style={{fontSize:"0.8rem",color:"var(--tomato)"}}>{weatherError}</span>}
          <button className="btn-primary" onClick={()=>fetchWeather(locationInput.trim())} disabled={weatherLoading}>
            {weatherLoading?"…":t.update}
          </button>
        </div>

        {weather&&(
          <div className="weather-strip">
            {[{val:weather.temp,lbl:t.temperature},{val:weather.humidity,lbl:t.humidity},{val:weather.rainfall,lbl:t.rainfall},{val:weather.sun,lbl:t.sunHours}].map(w=>(
              <div key={w.lbl} className="weather-tile">
                <div className="val">{w.val}</div>
                <div className="lbl">{w.lbl}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&(
          <div>
            <div className="section">
              <div className="section-heading">
                {t.myGarden}
                {savingPlants&&<span style={{fontSize:"0.75rem",color:"var(--muted)",marginLeft:10}}>{t.savingPlants}</span>}
                {!session&&<span style={{fontSize:"0.75rem",color:"var(--muted)",marginLeft:10}}>— <button style={{background:"none",border:"none",color:"var(--moss)",cursor:"pointer",fontWeight:600,fontSize:"0.75rem"}} onClick={()=>setShowAuthModal(true)}>{lang==="es"?"Inicia sesión":"Log in"}</button> {t.loginToSave}</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"16px"}}>
                {PLANTS.map(p=>(
                  <div key={p.id} className={`plant-card ${selectedPlants.includes(p.id)?"selected":""}`} onClick={()=>togglePlant(p.id)}>
                    <div className="plant-emoji">{p.emoji}</div>
                    <div className="plant-name">{t.plants[p.id]}</div>
                    <div className="plant-tag">{t[p.tagKey]}</div>
                    {selectedPlants.includes(p.id)&&<div style={{marginTop:6,fontSize:"0.75rem",color:"var(--moss)",fontWeight:600}}>{t.growing}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="section">
              <div className="section-heading">{t.aiAdvisor}</div>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
                <span style={{fontSize:"0.85rem",color:"var(--muted)"}}>{t.plantsSelected(selectedPlants.length)} · {location}</span>
                <button className="btn-primary" onClick={getRecommendations} disabled={aiLoading||selectedPlants.length===0||!weather}>
                  {aiLoading?t.analysing:t.getRecommendations}
                </button>
              </div>
              {(aiText||aiLoading)&&(
                <div className="ai-box">
                  <div className="ai-label">🌿 BalconyGrow AI{aiLoading&&<div className="dot-pulse"><span/><span/><span/></div>}</div>
                  {aiText}{aiLoading&&!aiText&&t.analysingSub}
                </div>
              )}
            </div>
            <div className="section">
              <div className="section-heading">{t.todayStatus}</div>
              <div className="two-col">
                <div className="rec-card green">
                  <h3>{t.wateringToday}</h3>
                  <p>{t.wateringBasedOn(weather?.temp,weather?.humidity)} {rawHumidity>70?t.wateringMoist:rawHumidity<45?t.wateringDry:t.wateringModerate}</p>
                </div>
                <div className="rec-card amber"><h3>{t.fertDue}</h3><p>{t.fertDueText}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* ── PLANNER ── */}
        {tab==="planner"&&(
          <div>
            <div className="section">
              <div className="section-heading">{t.plantingCalendar}</div>
              <div className="card">
                <div style={{marginBottom:16,fontSize:"0.85rem",color:"var(--muted)"}}>{t.calendarSubtitle(location)}</div>
                {selectedPlants.map(id=>{
                  const plant=PLANTS.find(p=>p.id===id);
                  const seasons=plantingSeasons[id]||[];
                  return(
                    <div key={id} style={{marginBottom:16}}>
                      <div style={{fontSize:"0.88rem",fontWeight:600,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>{plant.emoji} {t.plants[plant.id]}</div>
                      <div className="month-grid">
                        {months.map((m,i)=>(
                          <div key={m} className="month-cell" style={{background:i===currentMonth?"var(--sun)":seasons[i]?"#d8eed0":"#f5f5f0",border:i===currentMonth?"2px solid var(--bark)":"none"}}>
                            <div className="m">{m}</div>
                            <div className="dot" style={{background:seasons[i]?"var(--moss)":"var(--dew)"}}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div className="season-legend">
                  <div className="season-item"><div className="season-dot" style={{background:"var(--moss)"}}/>{t.sowNow}</div>
                  <div className="season-item"><div className="season-dot" style={{background:"var(--sun)"}}/>{t.currentMonth}</div>
                  <div className="season-item"><div className="season-dot" style={{background:"var(--dew)"}}/>{t.offSeason}</div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section-heading">{t.spacePlanning}</div>
              <div className="two-col">
                {[
                  {title:t.containerSizesTitle,body:t.containerSizesBody},
                  {title:t.lightPlacementTitle,body:t.lightPlacementBody},
                  {title:t.windProtectionTitle,body:t.windProtectionBody},
                  {title:t.successionTitle,body:t.successionBody},
                ].map(c=><div key={c.title} className="rec-card green"><h3>{c.title}</h3><p>{c.body}</p></div>)}
              </div>
            </div>
          </div>
        )}

        {/* ── WATERING ── */}
        {tab==="watering"&&(
          <div>
            <div className="section">
              <div className="section-heading">{t.wateringNeeds}</div>
              <p style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:18}}>{t.wateringLiveData(location,weather?.temp,weather?.humidity)}</p>
              <div className="card">
                {selectedPlants.map(id=>{
                  const plant=PLANTS.find(p=>p.id===id);
                  let adjusted=plant.water;
                  if(rawHumidity>75)adjusted-=20;else if(rawHumidity>60)adjusted-=10;else if(rawHumidity<40)adjusted+=10;
                  if(rawTemp>30)adjusted+=15;else if(rawTemp>25)adjusted+=8;else if(rawTemp<15)adjusted-=10;
                  if(rawRain>80)adjusted-=15;else if(rawRain<20)adjusted+=10;
                  adjusted=Math.min(100,Math.max(10,adjusted));
                  return(
                    <div key={id} className="fert-row">
                      <div style={{fontSize:"1.4rem",width:36}}>{plant.emoji}</div>
                      <div style={{flex:1}}>
                        <div className="fert-label">{t.plants[plant.id]}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                          <div style={{flex:1}}><div className="water-bar"><div className="water-fill" style={{width:`${adjusted}%`}}/></div></div>
                          <span style={{fontSize:"0.75rem",color:"var(--muted)",whiteSpace:"nowrap"}}>{adjusted}{t.wateringNeed}</span>
                        </div>
                      </div>
                      <span className={`badge ${adjusted>75?"warn":adjusted>50?"info":"good"}`}>
                        {adjusted>75?t.daily:adjusted>50?t.everyTwoDays:t.twiceWeek}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="section">
              <div className="section-heading">{t.wateringTips}</div>
              <div className="two-col">
                {[
                  {c:"green",title:t.bestTimeTitle,body:t.bestTimeBody},
                  {c:"amber",title:t.heatAdjTitle,body:rawTemp>25?t.heatAdjBodyHot(weather?.temp):t.heatAdjBodyNormal(weather?.temp)},
                  {c:"green",title:t.drainageTitle,body:t.drainageBody},
                  {c:"red",title:t.rainTitle,body:rawRain>80?t.rainHigh(weather?.rainfall):rawRain<20?t.rainLow(weather?.rainfall):t.rainMid(weather?.rainfall)},
                ].map(ti=><div key={ti.title} className={`rec-card ${ti.c}`}><h3>{ti.title}</h3><p>{ti.body}</p></div>)}
              </div>
            </div>
          </div>
        )}

        {/* ── FERTILISER ── */}
        {tab==="fertiliser"&&(
          <div>
            <div className="section">
              <div className="section-heading">{t.fertSchedule}</div>
              <div className="card">
                {selectedPlants.map(id=>{
                  const plant=PLANTS.find(p=>p.id===id);
                  return(
                    <div key={id} className="fert-row">
                      <div style={{fontSize:"1.4rem",width:36}}>{plant.emoji}</div>
                      <div style={{flex:1}}>
                        <div className="fert-label">{t.plants[plant.id]}</div>
                        <div className="fert-freq">{plant.fert>70?t.fertFortnightly:plant.fert>45?t.fertMonthly:t.fertSixWeeks}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="progress-bar"><div className="progress-fill" style={{width:`${plant.fert}%`}}/></div>
                        <span style={{fontSize:"0.75rem",color:"var(--muted)",width:30}}>{plant.fert}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="section">
              <div className="section-heading">{t.fertGuide}</div>
              <div className="two-col">
                {[
                  {c:"green",title:t.fruitingTitle,body:t.fruitingBody},
                  {c:"green",title:t.leafyTitle,body:t.leafyBody},
                  {c:"amber",title:t.slowReleaseTitle,body:t.slowReleaseBody},
                  {c:"amber",title:t.organicTitle,body:t.organicBody},
                  {c:"green",title:t.stopFeedingTitle,body:t.stopFeedingBody},
                  {c:"red",title:t.overFertTitle,body:t.overFertBody},
                ].map(ti=><div key={ti.title} className={`rec-card ${ti.c}`}><h3>{ti.title}</h3><p>{ti.body}</p></div>)}
              </div>
            </div>
          </div>
        )}

        {/* ── COMMUNITY BOARD ── */}
        {tab==="board"&&(
          <div>
            <div className="section-heading">{t.communityBoard}</div>
            <div className="tab-pills">
              {boardTagLabels.map((label,i)=>(
                <button key={label} className={`tab-pill ${boardTab===i?"active":""}`} onClick={()=>setBoardTab(i)}>{label}</button>
              ))}
            </div>
            <div className="message-list">
              {postsLoading&&<div className="empty-board">{t.loadingPosts}</div>}
              {!postsLoading&&filteredPosts.length===0&&<div className="empty-board">{t.noPosts}</div>}
              {filteredPosts.map(post=>(
                <div key={post.id} className="card" style={{padding:"16px 18px"}}>
                  <div className="message-item">
                    <div className="msg-avatar" style={{background:getAvatarColor(post.author)}}>{getInitials(post.author)}</div>
                    <div className="msg-body">
                      <div className="msg-header">
                        <span className="msg-author">{post.author}</span>
                        <span className="msg-time">{new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="msg-tag">{post.tag}</span>
                      </div>
                      <div className="msg-text">{post.text}</div>
                      <div className="msg-actions">
                        <button className="msg-action-btn" onClick={()=>handleLike(post)}>❤️ {post.likes}</button>
                        {session&&post.user_id===session.user.id&&(
                          <button className="msg-action-btn" style={{color:"var(--tomato)"}} onClick={()=>handleDeletePost(post.id)}>🗑 Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {session ? (
              <div className="card" style={{padding:0}}>
                <div className="compose-box">
                  <div className="compose-toolbar">
                    <span style={{fontSize:"0.82rem",fontWeight:500,color:"var(--muted)"}}>{t.postAs} <strong>{profile?.username||session.user.email}</strong></span>
                    <select className="compose-select" value={newPostTag} onChange={e=>setNewPostTag(e.target.value)}>
                      {BOARD_TAGS.filter(t=>t!=="All").map(tag=><option key={tag}>{tag}</option>)}
                    </select>
                  </div>
                  <textarea className="compose-textarea" placeholder={t.postPlaceholder} value={newPost} onChange={e=>setNewPost(e.target.value)}/>
                  <div className="compose-footer">
                    <span className="compose-hint">{t.postHint}</span>
                    <button className="btn-primary" onClick={handlePost} disabled={!newPost.trim()}>{t.post}</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                <p>{t.loginToPost}</p>
                <button className="btn-primary" onClick={()=>setShowAuthModal(true)}>{t.loginToPostBtn}</button>
              </div>
            )}
          </div>
        )}

      </div>
      <Analytics />
    </>
  );
}

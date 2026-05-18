import { useState, useEffect, useCallback } from "react";

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
    .header{display:flex;align-items:center;justify-content:space-between;padding:28px 0 20px;border-bottom:2px solid var(--dew);margin-bottom:32px}
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
    .message-list{display:flex;flex-direction:column;gap:14px;margin-bottom:20px;max-height:440px;overflow-y:auto;padding-right:4px}
    .message-item{display:flex;gap:12px;align-items:flex-start}
    .msg-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
    .msg-body{flex:1}
    .msg-header{display:flex;align-items:baseline;gap:8px;margin-bottom:4px}
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
  `}</style>
);

const PLANTS = [
  { id:"tomato",    emoji:"🍅", name:"Tomato",     tag:"Warm season", water:80, fert:85 },
  { id:"lettuce",   emoji:"🥬", name:"Lettuce",    tag:"Cool season", water:65, fert:40 },
  { id:"basil",     emoji:"🌿", name:"Basil",      tag:"Warm season", water:55, fert:50 },
  { id:"pepper",    emoji:"🫑", name:"Pepper",     tag:"Warm season", water:70, fert:75 },
  { id:"radish",    emoji:"🌱", name:"Radish",     tag:"Quick grow",  water:45, fert:35 },
  { id:"cucumber",  emoji:"🥒", name:"Cucumber",   tag:"Warm season", water:90, fert:70 },
  { id:"spinach",   emoji:"🍃", name:"Spinach",    tag:"Cool season", water:60, fert:45 },
  { id:"carrot",    emoji:"🥕", name:"Carrot",     tag:"Root veg",    water:50, fert:40 },
  { id:"chilli",    emoji:"🌶️", name:"Chilli",     tag:"Warm season", water:55, fert:65 },
  { id:"mint",      emoji:"🌱", name:"Mint",       tag:"Perennial",   water:70, fert:30 },
  { id:"zucchini",  emoji:"🫛", name:"Zucchini",   tag:"Warm season", water:85, fert:80 },
  { id:"strawberry",emoji:"🍓", name:"Strawberry", tag:"Fruiting",    water:60, fert:55 },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const SAMPLE_POSTS = [
  { id:1, author:"Rosa M.",   avatar:"🌸", avatarBg:"#f9d8e8", tag:"Tip",     time:"2h ago", likes:14, text:"My cherry tomatoes are going crazy on the south-facing balcony! I added a reflective foil panel behind the pots — made a noticeable difference to the temperature. Anyone tried this?" },
  { id:2, author:"Kieran T.", avatar:"🥦", avatarBg:"#d8f0d8", tag:"Help",    time:"5h ago", likes:7,  text:"First time growing anything — my basil looks a bit yellow. I water it every day. Could overwatering be the issue? The pot doesn't have drainage holes..." },
  { id:3, author:"Priya S.",  avatar:"🌻", avatarBg:"#fdf0c8", tag:"Harvest", time:"1d ago", likes:22, text:"Just pulled my first radishes! 26 days from seed. Perfect for a 30cm pot. Sowing another batch today while the lettuce comes up behind them. Succession sowing is the real trick for small spaces." },
  { id:4, author:"Marcus W.", avatar:"🫚", avatarBg:"#e8d8c8", tag:"Tip",     time:"2d ago", likes:11, text:"Worm castings mixed into my potting mix have been phenomenal. Way cheaper than bought fertiliser and my peppers have never looked better. Anyone else composting on a balcony?" },
];

const BOARD_TAGS = ["All","Tips","Help","Harvest","Pests","Recipes"];

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

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [location, setLocation] = useState("Zaragoza, ES");
  const [locationInput, setLocationInput] = useState("Zaragoza, ES");
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [selectedPlants, setSelectedPlants] = useState(["tomato","basil","lettuce"]);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [boardTab, setBoardTab] = useState("All");
  const [newPost, setNewPost] = useState("");
  const [newPostTag, setNewPostTag] = useState("Tip");
  const [postLikes, setPostLikes] = useState({});

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
    setWeatherLoading(true);
    setWeatherError("");
    try {
      const currentRes = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
      const data = await currentRes.json();
      if (data.error) {
        setWeatherError(data.error);
        setWeatherLoading(false);
        return;
      }
      setWeather({
        temp: `${data.temp}°C`,
        humidity: `${data.humidity}%`,
        rainfall: `~${data.rainfall}mm/mo`,
        sun: `${data.sun}h/day`,
        desc: data.desc,
        icon: weatherIconEmoji(data.weatherId),
        raw: { temp: data.temp, humidity: data.humidity, rainfall: data.rainfall },
      });
      setLocation(cityName);
      setAiText("");
    } catch (e) {
      setWeatherError("Could not fetch weather. Please try again.");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const handleSetLocation = () => {
    if (locationInput.trim()) fetchWeather(locationInput.trim());
  };

  useEffect(() => { fetchWeather(location); }, [fetchWeather, location]);

  const getRecommendations = async () => {
    if (aiLoading || !weather) return;
    setAiLoading(true);
    setAiText("");
    const userLang = navigator.language || "en";
    const plantNames = selectedPlants.map(id => PLANTS.find(p => p.id === id)?.name).join(", ");
    const prompt = `You are an expert urban balcony gardening advisor. The user is growing: ${plantNames} on a small balcony/small urban space. Respond in the following language: ${userLang}.

Location: ${location}
Current conditions: ${weather.temp} temperature, ${weather.humidity} humidity, ${weather.rainfall} monthly rainfall, ${weather.sun} daily sunlight, weather: ${weather.desc}

Please give concise, practical advice covering:
1. 🌱 PLANTING SEASON — Best times to plant each selected vegetable given the location & climate
2. 💧 WATERING SCHEDULE — Specific watering frequency & amounts adjusted for current weather conditions
3. 🌿 FERTILISER PLAN — What nutrients are needed, when to apply, and which organic options suit small-space balcony growing
4. ⚠️ WATCH OUT — 1-2 key risks (pests, heat, overwatering etc.) to watch for in these conditions

Keep advice practical, specific to balcony/container growing, and friendly. Use bullet points under each heading. Be concise — aim for ~200 words total.`;

    try {
      const resp = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await resp.json();
      if (data?.text) {
        setAiText(data.text);
      } else {
        setAiText("No response received. Please try again.");
      }
    } catch (e) {
      setAiText("Unable to load recommendations. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const togglePlant = (id) => {
    setSelectedPlants(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    setAiText("");
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts(prev => [{
      id: Date.now(), author:"You", avatar:"🌱", avatarBg:"#d8f0d8",
      tag: newPostTag, time:"just now", likes:0, text: newPost.trim()
    }, ...prev]);
    setNewPost("");
  };

  const toggleLike = (id) => setPostLikes(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredPosts = boardTab === "All" ? posts : posts.filter(p => p.tag === boardTab);
  const currentMonth = new Date().getMonth();

  const rawHumidity = weather?.raw?.humidity ?? 60;
  const rawTemp     = weather?.raw?.temp     ?? 20;
  const rawRain     = weather?.raw?.rainfall ?? 40;

  return (
    <>
      <GlobalStyle />
      <div className="app-wrapper">

        <header className="header">
          <div className="logo">
            <div className="logo-icon">🌿</div>
            <div>
              <h1>BalconyGrow</h1>
              <span>Urban Kitchen Garden</span>
            </div>
          </div>
          <nav className="nav">
            {[
              { id:"dashboard", icon:"🏡", label:"Dashboard" },
              { id:"planner",   icon:"🗓", label:"Planner" },
              { id:"watering",  icon:"💧", label:"Watering" },
              { id:"fertiliser",icon:"🌿", label:"Fertiliser" },
              { id:"board",     icon:"💬", label:"Community" },
            ].map(t => (
              <button key={t.id} className={`nav-btn ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="location-bar">
          <span style={{fontSize:"1.1rem"}}>📍</span>
          <input
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSetLocation()}
            placeholder="Enter your city…"
          />
          {weatherLoading && <span style={{fontSize:"0.85rem",color:"var(--muted)"}}>⏳ Fetching…</span>}
          {!weatherLoading && weather && (
            <span style={{fontSize:"0.85rem",color:"var(--muted)",whiteSpace:"nowrap"}}>
              {weather.icon} {weather.temp} · {weather.desc}
            </span>
          )}
          {weatherError && <span style={{fontSize:"0.8rem",color:"var(--tomato)"}}>{weatherError}</span>}
          <button className="btn-primary" onClick={handleSetLocation} disabled={weatherLoading}>
            {weatherLoading ? "…" : "Update"}
          </button>
        </div>

        {weather && (
          <div className="weather-strip">
            {[
              { val: weather.temp,     lbl: "Temperature" },
              { val: weather.humidity, lbl: "Humidity" },
              { val: weather.rainfall, lbl: "Rainfall" },
              { val: weather.sun,      lbl: "Sun hours" },
            ].map(w => (
              <div key={w.lbl} className="weather-tile">
                <div className="val">{w.val}</div>
                <div className="lbl">{w.lbl}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "dashboard" && (
          <div>
            <div className="section">
              <div className="section-heading">My Garden — Select your plants</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"16px"}}>
                {PLANTS.map(p => (
                  <div key={p.id} className={`plant-card ${selectedPlants.includes(p.id)?"selected":""}`} onClick={() => togglePlant(p.id)}>
                    <div className="plant-emoji">{p.emoji}</div>
                    <div className="plant-name">{p.name}</div>
                    <div className="plant-tag">{p.tag}</div>
                    {selectedPlants.includes(p.id) && (
                      <div style={{marginTop:6,fontSize:"0.75rem",color:"var(--moss)",fontWeight:600}}>✓ Growing</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="section-heading">AI Garden Advisor</div>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
                <span style={{fontSize:"0.85rem",color:"var(--muted)"}}>
                  {selectedPlants.length} plant{selectedPlants.length !== 1 ? "s" : ""} selected · {location}
                </span>
                <button className="btn-primary" onClick={getRecommendations}
                  disabled={aiLoading || selectedPlants.length === 0 || !weather}>
                  {aiLoading ? "Analysing…" : "✨ Get Personalised Recommendations"}
                </button>
              </div>
              {(aiText || aiLoading) && (
                <div className="ai-box">
                  <div className="ai-label">
                    🌿 BalconyGrow AI
                    {aiLoading && <div className="dot-pulse"><span/><span/><span/></div>}
                  </div>
                  {aiText}
                  {aiLoading && !aiText && "Analysing your garden conditions…"}
                </div>
              )}
            </div>

            <div className="section">
              <div className="section-heading">Today's Garden Status</div>
              <div className="two-col">
                <div className="rec-card green">
                  <h3>💧 Watering Today</h3>
                  <p>Based on {weather?.temp} and {weather?.humidity} humidity — {
                    rawHumidity > 70 ? "conditions are moist. Skip or reduce watering by 30%." :
                    rawHumidity < 45 ? "dry conditions! Water thoroughly, especially tomatoes & cucumbers." :
                    "moderate conditions. Water as scheduled."
                  }</p>
                </div>
                <div className="rec-card amber">
                  <h3>🌿 Fertiliser Due</h3>
                  <p>Tomatoes & peppers are due for a potassium-rich feed this week. Leafy greens can wait another 10 days.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "planner" && (
          <div>
            <div className="section">
              <div className="section-heading">Planting Calendar</div>
              <div className="card">
                <div style={{marginBottom:16,fontSize:"0.85rem",color:"var(--muted)"}}>
                  Green months = ideal sowing window for {location}. Current month highlighted.
                </div>
                {selectedPlants.map(id => {
                  const plant = PLANTS.find(p => p.id === id);
                  const seasons = plantingSeasons[id] || [];
                  return (
                    <div key={id} style={{marginBottom:16}}>
                      <div style={{fontSize:"0.88rem",fontWeight:600,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                        {plant.emoji} {plant.name}
                      </div>
                      <div className="month-grid">
                        {MONTHS.map((m, i) => (
                          <div key={m} className="month-cell" style={{
                            background: i === currentMonth ? "var(--sun)" : seasons[i] ? "#d8eed0" : "#f5f5f0",
                            border: i === currentMonth ? "2px solid var(--bark)" : "none"
                          }}>
                            <div className="m">{m}</div>
                            <div className="dot" style={{background: seasons[i] ? "var(--moss)" : "var(--dew)"}}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div className="season-legend">
                  <div className="season-item"><div className="season-dot" style={{background:"var(--moss)"}}/>Sow now</div>
                  <div className="season-item"><div className="season-dot" style={{background:"var(--sun)"}}/>Current month</div>
                  <div className="season-item"><div className="season-dot" style={{background:"var(--dew)"}}/>Off-season</div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section-heading">Space Planning for Balcony Growing</div>
              <div className="two-col">
                {[
                  { title:"🪣 Container Sizes", body:"Tomatoes & peppers need 25–30cm deep pots. Lettuce & radishes thrive in 15cm-deep window boxes. Mint: keep isolated in its own pot — it spreads." },
                  { title:"☀️ Light Placement", body:"South-facing spots get the most sun. Prioritise tomatoes, peppers & cucumbers there. Leafy greens tolerate partial shade and can go on the shadier side." },
                  { title:"🌬️ Wind Protection", body:"Higher balconies face more wind. Stake tall plants and consider a trellis or windbreak net. Group pots together to reduce moisture loss." },
                  { title:"🔄 Succession Planting", body:"For lettuces and radishes, sow every 2–3 weeks for continuous harvests rather than a single glut. A great balcony technique for small batches." },
                ].map(c => (
                  <div key={c.title} className="rec-card green">
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "watering" && (
          <div>
            <div className="section">
              <div className="section-heading">Watering Needs by Plant</div>
              <p style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:18}}>
                Live data for {location} · {weather?.temp} · {weather?.humidity} humidity
              </p>
              <div className="card">
                {selectedPlants.map(id => {
                  const plant = PLANTS.find(p => p.id === id);
                  let adjusted = plant.water;
                  if (rawHumidity > 75) adjusted -= 20;
                  else if (rawHumidity > 60) adjusted -= 10;
                  else if (rawHumidity < 40) adjusted += 10;
                  if (rawTemp > 30) adjusted += 15;
                  else if (rawTemp > 25) adjusted += 8;
                  else if (rawTemp < 15) adjusted -= 10;
                  if (rawRain > 80) adjusted -= 15;
                  else if (rawRain < 20) adjusted += 10;
                  adjusted = Math.min(100, Math.max(10, adjusted));
                  return (
                    <div key={id} className="fert-row">
                      <div style={{fontSize:"1.4rem",width:36}}>{plant.emoji}</div>
                      <div style={{flex:1}}>
                        <div className="fert-label">{plant.name}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                          <div style={{flex:1}}>
                            <div className="water-bar">
                              <div className="water-fill" style={{width:`${adjusted}%`}}/>
                            </div>
                          </div>
                          <span style={{fontSize:"0.75rem",color:"var(--muted)",whiteSpace:"nowrap"}}>{adjusted}% need</span>
                        </div>
                      </div>
                      <div>
                        <span className={`badge ${adjusted > 75 ? "warn" : adjusted > 50 ? "info" : "good"}`}>
                          {adjusted > 75 ? "🚿 Daily" : adjusted > 50 ? "💧 Every 2 days" : "🌦 Twice/week"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="section">
              <div className="section-heading">Watering Tips for Containers</div>
              <div className="two-col">
                {[
                  { c:"green", title:"⏰ Best Time to Water", body:"Water in the early morning (6–9am) to reduce evaporation and fungal issues. Avoid watering in full midday sun, especially in hot climates." },
                  { c:"amber", title:"🌡️ Heat Adjustment", body:`At ${weather?.temp} you should ${rawTemp > 25 ? "increase watering frequency and consider shading pots" : "maintain regular schedule"}. Check soil moisture by pressing a finger 2cm deep.` },
                  { c:"green", title:"🪴 Container Drainage", body:"Always use pots with drainage holes. Waterlogged roots are the #1 killer of balcony vegetables. Elevate pots on feet for airflow." },
                  { c:"red",   title:"🌧️ Rain Consideration", body:`${weather?.rainfall} monthly rainfall — ${rawRain > 80 ? "significant rain expected, reduce watering considerably" : rawRain < 20 ? "very dry month ahead, increase frequency" : "moderate rainfall, adjust around wet days"}.` },
                ].map(t => (
                  <div key={t.title} className={`rec-card ${t.c}`}>
                    <h3>{t.title}</h3>
                    <p>{t.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "fertiliser" && (
          <div>
            <div className="section">
              <div className="section-heading">Fertiliser Schedule</div>
              <div className="card">
                {selectedPlants.map(id => {
                  const plant = PLANTS.find(p => p.id === id);
                  return (
                    <div key={id} className="fert-row">
                      <div style={{fontSize:"1.4rem",width:36}}>{plant.emoji}</div>
                      <div style={{flex:1}}>
                        <div className="fert-label">{plant.name}</div>
                        <div className="fert-freq">
                          {plant.fert > 70 ? "Fortnightly feed (high feeder)" : plant.fert > 45 ? "Monthly feed (moderate)" : "Every 6 weeks (light feeder)"}
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width:`${plant.fert}%`}}/>
                        </div>
                        <span style={{fontSize:"0.75rem",color:"var(--muted)",width:30}}>{plant.fert}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="section">
              <div className="section-heading">Fertiliser Guide for Balcony Gardens</div>
              <div className="two-col">
                {[
                  { c:"green", title:"🍅 Fruiting Plants (Tomato, Pepper, Chilli)", body:"Use a high-potassium (K) fertiliser once fruiting begins. Tomato feed works well. Seaweed liquid feed fortnightly throughout the season as a complement." },
                  { c:"green", title:"🥬 Leafy Greens (Lettuce, Spinach, Mint)", body:"Nitrogen-rich feed every 4–6 weeks encourages lush leaf growth. Fish emulsion or balanced liquid feed works well. Avoid over-feeding — it reduces flavour." },
                  { c:"amber", title:"🌱 Slow-release vs Liquid", body:"Slow-release granules at planting save time. Top up with liquid feed mid-season when plants are actively growing. Liquid feeds act within days; granules last 3–4 months." },
                  { c:"amber", title:"🌿 Organic Options", body:"Worm castings, compost tea, and seaweed extract are excellent organic options. Comfrey liquid (home-made) is free and incredibly rich in potassium for fruiting plants." },
                  { c:"green", title:"📅 When to Stop Feeding", body:"Cease feeding 4–6 weeks before the end of the growing season to let plants harden off. For perennials like mint, stop feeding in late summer." },
                  { c:"red",   title:"⚠️ Signs of Over-fertilising", body:"Yellow leaf edges (fertiliser burn), excessive leafy growth with no fruit, or white salt crust on soil surface all signal too much. Flush pots with water and pause feeding." },
                ].map(t => (
                  <div key={t.title} className={`rec-card ${t.c}`}>
                    <h3>{t.title}</h3>
                    <p>{t.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "board" && (
          <div>
            <div className="section-heading">Community Message Board</div>
            <div className="tab-pills">
              {BOARD_TAGS.map(t => (
                <button key={t} className={`tab-pill ${boardTab === t ? "active" : ""}`} onClick={() => setBoardTab(t)}>{t}</button>
              ))}
            </div>
            <div className="message-list">
              {filteredPosts.map(post => (
                <div key={post.id} className="card" style={{padding:"16px 18px"}}>
                  <div className="message-item">
                    <div className="msg-avatar" style={{background:post.avatarBg}}>{post.avatar}</div>
                    <div className="msg-body">
                      <div className="msg-header">
                        <span className="msg-author">{post.author}</span>
                        <span className="msg-time">{post.time}</span>
                        <span className="msg-tag">{post.tag}</span>
                      </div>
                      <div className="msg-text">{post.text}</div>
                      <div className="msg-actions">
                        <button className="msg-action-btn" onClick={() => toggleLike(post.id)}>
                          {postLikes[post.id] ? "❤️" : "🤍"} {post.likes + (postLikes[post.id] ? 1 : 0)}
                        </button>
                        <button className="msg-action-btn">💬 Reply</button>
                        <button className="msg-action-btn">🔖 Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPosts.length === 0 && (
                <div style={{textAlign:"center",padding:"40px",color:"var(--muted)",fontSize:"0.9rem"}}>
                  No posts in this category yet. Be the first! 🌱
                </div>
              )}
            </div>
            <div className="card" style={{padding:0}}>
              <div className="compose-box">
                <div className="compose-toolbar">
                  <span style={{fontSize:"0.82rem",fontWeight:500,color:"var(--muted)"}}>Post as You</span>
                  <select className="compose-select" value={newPostTag} onChange={e => setNewPostTag(e.target.value)}>
                    {["Tip","Help","Harvest","Pests","Recipes"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <textarea
                  className="compose-textarea"
                  placeholder="Share a tip, ask for help, or celebrate a harvest…"
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                />
                <div className="compose-footer">
                  <span className="compose-hint">Be kind · No spam · Share your experience</span>
                  <button className="btn-primary" onClick={handlePost} disabled={!newPost.trim()}>Post 🌱</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

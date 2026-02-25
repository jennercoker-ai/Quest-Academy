import { useState, useRef, useCallback } from "react";

// ─── CSV PARSER ───────────────────────────────────────────────────────────────
const BOND_COLS   = ["Subject","Difficulty","Question","OptionA","OptionB","OptionC","OptionD","Answer","Hint","Reference","Topic"];
const GL_COLS     = ["subject","level","q_text","opt_1","opt_2","opt_3","opt_4","correct_answer","hint_text","explanation","topic_tag"];
const SUBJECT_MAP = {
  english:"English", "english language":"English",
  maths:"Maths", mathematics:"Maths",
  "verbal reasoning":"Verbal Reasoning", vr:"Verbal Reasoning", "verbal-reasoning":"Verbal Reasoning",
  "non-verbal reasoning":"Non-Verbal Reasoning", nvr:"Non-Verbal Reasoning",
  "non verbal reasoning":"Non-Verbal Reasoning",
};
const DIFF_MAP = {
  easy:"easy", foundation:"easy",
  medium:"medium", applied:"medium",
  hard:"hard", "exam style":"hard", "exam-style":"hard",
};
const SUBJECT_META = {
  "English":              { icon:"📖", color:"#818cf8", bg:"rgba(129,140,248,0.12)", border:"rgba(129,140,248,0.3)" },
  "Maths":               { icon:"🔢", color:"#34d399", bg:"rgba(52,211,153,0.12)",  border:"rgba(52,211,153,0.3)"  },
  "Verbal Reasoning":    { icon:"💬", color:"#fbbf24", bg:"rgba(251,191,36,0.12)",  border:"rgba(251,191,36,0.3)"  },
  "Non-Verbal Reasoning":{ icon:"🔷", color:"#a78bfa", bg:"rgba(167,139,250,0.12)", border:"rgba(167,139,250,0.3)" },
};
const DIFF_META = {
  easy:   { label:"Foundation", color:"#34d399", bg:"rgba(52,211,153,0.1)",   border:"rgba(52,211,153,0.25)"  },
  medium: { label:"Applied",    color:"#fbbf24", bg:"rgba(251,191,36,0.1)",   border:"rgba(251,191,36,0.25)"  },
  hard:   { label:"Exam Style", color:"#f43f5e", bg:"rgba(244,63,94,0.1)",    border:"rgba(244,63,94,0.25)"   },
};

function detectFormat(headers) {
  const h = headers.map(s => s.trim());
  if (BOND_COLS.every(c => h.includes(c))) return "bond";
  if (GL_COLS.every(c => h.includes(c)))  return "gl";
  // partial match
  if (h.includes("Question") || h.includes("OptionA")) return "bond";
  if (h.includes("q_text") || h.includes("opt_1"))     return "gl";
  return "unknown";
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map(s => s.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map(line => {
    // Handle quoted fields with commas inside
    const cols = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') { inQ = !inQ; }
      else if (line[i] === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
      else cur += line[i];
    }
    cols.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] || "").replace(/^"|"$/g, "").trim(); });
    return obj;
  });
  return { headers, rows };
}

function normaliseRow(row, format) {
  if (format === "bond") {
    return {
      subject:    SUBJECT_MAP[row.Subject?.toLowerCase()] || row.Subject,
      difficulty: DIFF_MAP[row.Difficulty?.toLowerCase()] || row.Difficulty?.toLowerCase(),
      question:   row.Question,
      options:    [row.OptionA, row.OptionB, row.OptionC, row.OptionD].filter(Boolean),
      answer:     row.Answer,
      hint:       row.Hint,
      reference:  row.Reference,
      topic:      row.Topic || "",
      source:     "bond",
    };
  }
  // GL format
  return {
    subject:    SUBJECT_MAP[row.subject?.toLowerCase()] || row.subject,
    difficulty: DIFF_MAP[row.level?.toLowerCase()] || row.level?.toLowerCase(),
    question:   row.q_text,
    options:    [row.opt_1, row.opt_2, row.opt_3, row.opt_4].filter(Boolean),
    answer:     row.correct_answer,
    hint:       row.hint_text,
    reference:  row.explanation,
    topic:      row.topic_tag || "",
    source:     "gl_assessment",
  };
}

function validateRow(q, idx) {
  const errors = [];
  if (!q.subject || !SUBJECT_MAP[q.subject?.toLowerCase()]) errors.push(`Unknown subject "${q.subject}"`);
  if (!q.difficulty || !DIFF_MAP[q.difficulty?.toLowerCase()]) errors.push(`Unknown difficulty "${q.difficulty}"`);
  if (!q.question || q.question.length < 5) errors.push("Question text too short");
  if (q.options.length < 2) errors.push("Need at least 2 options");
  if (!q.answer) errors.push("No answer provided");
  if (q.answer && !q.options.includes(q.answer)) errors.push(`Answer "${q.answer}" not in options`);
  return errors;
}

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
const BOND_TEMPLATE = `Subject,Difficulty,Question,OptionA,OptionB,OptionC,OptionD,Answer,Hint,Reference,Topic
English,easy,Which word means the same as HAPPY?,Sad,Joyful,Angry,Tired,Joyful,Think about a positive uplifting feeling.,SYNONYMS are words with the same meaning. HAPPY = Joyful/Cheerful/Delighted.,Synonyms
Maths,medium,What is 15% of 80?,8,10,12,15,12,Find 10% first then 5% and add them.,10% of 80=8 and 5%=4 so 15%=12.,Percentages`;

const GL_TEMPLATE = `subject,level,q_text,opt_1,opt_2,opt_3,opt_4,correct_answer,hint_text,explanation,topic_tag
English,easy,Which word means the same as HAPPY?,Sad,Joyful,Angry,Tired,Joyful,Think about a positive uplifting feeling.,SYNONYMS are words with the same meaning. HAPPY = Joyful/Cheerful/Delighted.,Synonyms
Maths,medium,What is 15% of 80?,8,10,12,15,12,Find 10% first then 5% and add them.,10% of 80=8 and 5%=4 so 15%=12.,Percentages`;

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=DM+Sans:wght@400;600;700;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; }
input, button, select { font-family: 'DM Sans', sans-serif; }

@keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes popIn     { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
@keyframes successPop{ 0%{transform:scale(0.9);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
@keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes progressFill { from{width:0%} to{width:var(--w)} }
@keyframes rowIn     { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }

.drop-zone-active { border-color: rgba(245,158,11,0.7) !important; background: rgba(245,158,11,0.06) !important; }
.row-anim { animation: rowIn 0.25s ease-out both; }

/* Table scrollbar */
.table-scroll::-webkit-scrollbar { height: 5px; width: 5px; }
.table-scroll::-webkit-scrollbar-track { background: #0f172a; }
.table-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
`;

// ─── COMPONENT ATOMS ─────────────────────────────────────────────────────────
function Pill({ children, color, bg, border }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:999,
      fontSize:11, fontWeight:700, border:`1px solid ${border}`, background:bg, color,
      whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div style={{
      flex:1, padding:"16px 12px", textAlign:"center",
      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
      borderRadius:16, animation:"popIn 0.4s ease-out",
    }}>
      <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
      <div style={{ fontSize:24, fontWeight:900, color: color || "#e2e8f0", marginBottom:3 }}>{value}</div>
      <div style={{ fontSize:10, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
    </div>
  );
}

function ProgressBar({ value, max, color = "#f59e0b", label }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:12 }}>
        <span style={{ color:"#94a3b8", fontWeight:600 }}>{label}</span>
        <span style={{ color:"#475569" }}>{value} / {max}</span>
      </div>
      <div style={{ height:6, background:"#1e293b", borderRadius:3, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${pct}%`, background:color, borderRadius:3,
          transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}/>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CSVImportUtility() {
  const [stage, setStage]         = useState("upload");  // upload | mapping | preview | importing | done
  const [dragOver, setDragOver]   = useState(false);
  const [fileName, setFileName]   = useState("");
  const [rawText, setRawText]     = useState("");
  const [parsed, setParsed]       = useState(null);
  const [format, setFormat]       = useState(null);      // bond | gl | unknown
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors]       = useState([]);
  const [filterSubj, setFilterSubj] = useState("all");
  const [filterDiff, setFilterDiff] = useState("all");
  const [filterValid, setFilterValid] = useState("all");
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount]   = useState(0);
  const [activeTab, setActiveTab] = useState("questions"); // questions | errors | stats
  const [search, setSearch]       = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [templateFormat, setTemplateFormat] = useState("bond");
  const fileRef = useRef();

  const processFile = useCallback((text, name) => {
    setFileName(name);
    setRawText(text);
    const { headers, rows } = parseCSV(text);
    const fmt = detectFormat(headers);
    setFormat(fmt);
    setParsed({ headers, rows });

    const normalised = rows.map((r, i) => {
      const q = normaliseRow(r, fmt === "gl" ? "gl" : "bond");
      const errs = validateRow(q, i);
      return { ...q, _row: i + 2, _errors: errs, _id: `r${i}` };
    });

    const valid = normalised.filter(q => q._errors.length === 0);
    const invalid = normalised.filter(q => q._errors.length > 0);
    setQuestions(normalised);
    setErrors(invalid);
    setSelectedRows(new Set(valid.map(q => q._id)));
    setStage("preview");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => processFile(ev.target.result, file.name);
    reader.readAsText(file);
  }, [processFile]);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => processFile(ev.target.result, file.name);
    reader.readAsText(file);
  };

  const handleImport = () => {
    const toImport = questions.filter(q => selectedRows.has(q._id) && q._errors.length === 0);
    setStage("importing");
    setImportProgress(0);
    let i = 0;
    const interval = setInterval(() => {
      i += Math.ceil(toImport.length / 20);
      if (i >= toImport.length) {
        i = toImport.length;
        clearInterval(interval);
        setImportedCount(toImport.length);
        setTimeout(() => setStage("done"), 400);
      }
      setImportProgress(Math.round((i / toImport.length) * 100));
    }, 60);
  };

  const downloadTemplate = (fmt) => {
    const content = fmt === "bond" ? BOND_TEMPLATE : GL_TEMPLATE;
    const name = fmt === "bond" ? "bond-template.csv" : "gl-template.csv";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered questions
  const visible = questions.filter(q => {
    if (filterSubj !== "all" && q.subject !== filterSubj) return false;
    if (filterDiff !== "all" && q.difficulty !== filterDiff) return false;
    if (filterValid === "valid"   && q._errors.length > 0) return false;
    if (filterValid === "invalid" && q._errors.length === 0) return false;
    if (search && !q.question?.toLowerCase().includes(search.toLowerCase()) &&
        !q.topic?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const validCount   = questions.filter(q => q._errors.length === 0).length;
  const invalidCount = questions.length - validCount;
  const selectedValid = [...selectedRows].filter(id => questions.find(q => q._id === id && q._errors.length === 0)).length;

  const subjectCounts = {};
  questions.forEach(q => { if (q._errors.length === 0) subjectCounts[q.subject] = (subjectCounts[q.subject]||0)+1; });
  const diffCounts = {};
  questions.forEach(q => { if (q._errors.length === 0) diffCounts[q.difficulty] = (diffCounts[q.difficulty]||0)+1; });

  // ── UPLOAD SCREEN ───────────────────────────────────────────────────────────
  if (stage === "upload") return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 15% 15%, #0e1e4a 0%, #020817 60%)", fontFamily:"'DM Sans',sans-serif", padding:"0 16px 40px" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ maxWidth:680, margin:"0 auto", paddingTop:48, paddingBottom:32, animation:"fadeUp 0.45s ease-out" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:8 }}>
          <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 16px rgba(245,158,11,0.3)" }}>📥</div>
          <div>
            <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:22, color:"#fff", marginBottom:2 }}>CSV Import Utility</h1>
            <p style={{ fontSize:13, color:"#475569" }}>Bond Assessment & GL Assessment formats supported</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:680, margin:"0 auto" }}>
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current.click()}
          className={dragOver ? "drop-zone-active" : ""}
          style={{
            border:"2px dashed rgba(255,255,255,0.12)", borderRadius:24, padding:"48px 24px",
            textAlign:"center", cursor:"pointer", transition:"all 0.25s", marginBottom:24,
            background: dragOver ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
          }}
        >
          <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={handleFileInput} />
          <div style={{ fontSize:52, marginBottom:16 }}>📂</div>
          <p style={{ fontSize:16, fontWeight:800, color:"#e2e8f0", marginBottom:8 }}>Drop your CSV file here</p>
          <p style={{ fontSize:13, color:"#475569", marginBottom:20 }}>or click to browse · .csv files only</p>
          <div style={{ display:"inline-flex", gap:10 }}>
            <span style={{ padding:"6px 16px", borderRadius:999, background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.3)", fontSize:12, fontWeight:700, color:"#f59e0b" }}>Bond Format</span>
            <span style={{ padding:"6px 16px", borderRadius:999, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", fontSize:12, fontWeight:700, color:"#818cf8" }}>GL Assessment</span>
          </div>
        </div>

        {/* Templates */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          {[
            { fmt:"bond", label:"Bond Assessment Template", color:"#f59e0b", icon:"📋",
              cols:"Subject, Difficulty, Question, OptionA-D, Answer, Hint, Reference, Topic" },
            { fmt:"gl", label:"GL Assessment Template", color:"#818cf8", icon:"📄",
              cols:"subject, level, q_text, opt_1-4, correct_answer, hint_text, explanation, topic_tag" },
          ].map(t => (
            <div key={t.fmt} style={{ padding:18, borderRadius:18, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:20 }}>{t.icon}</span>
                <span style={{ fontSize:13, fontWeight:800, color:"#e2e8f0" }}>{t.label}</span>
              </div>
              <p style={{ fontSize:11, color:"#475569", lineHeight:1.5, marginBottom:14 }}>{t.cols}</p>
              <button
                onClick={e => { e.stopPropagation(); downloadTemplate(t.fmt); }}
                style={{ width:"100%", padding:"9px", borderRadius:10, border:`1px solid ${t.color}40`, background:`${t.color}10`, color:t.color, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background=`${t.color}20`}
                onMouseLeave={e => e.currentTarget.style.background=`${t.color}10`}
              >
                ⬇ Download Template
              </button>
            </div>
          ))}
        </div>

        {/* Format guide */}
        <div style={{ padding:20, borderRadius:18, background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.15)" }}>
          <p style={{ fontSize:11, fontWeight:800, color:"#818cf8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:12 }}>📘 Quick Format Guide</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, fontSize:12, color:"#475569", lineHeight:1.7 }}>
            <div>
              <p style={{ color:"#94a3b8", fontWeight:700, marginBottom:4 }}>Subjects (any case)</p>
              <p>English · Maths · Mathematics</p>
              <p>Verbal Reasoning · VR</p>
              <p>Non-Verbal Reasoning · NVR</p>
            </div>
            <div>
              <p style={{ color:"#94a3b8", fontWeight:700, marginBottom:4 }}>Difficulties (any case)</p>
              <p>Easy · Foundation</p>
              <p>Medium · Applied</p>
              <p>Hard · Exam Style · Exam-Style</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── IMPORTING SCREEN ────────────────────────────────────────────────────────
  if (stage === "importing") return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at top, #0e1e4a 0%, #020817 60%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ textAlign:"center", maxWidth:400, padding:24 }}>
        <div style={{ fontSize:52, marginBottom:20, animation:"spin 1.5s linear infinite", display:"inline-block" }}>⚙️</div>
        <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:22, color:"#fff", marginBottom:8 }}>Importing Questions…</h2>
        <p style={{ fontSize:13, color:"#475569", marginBottom:32 }}>Processing and validating each row</p>
        <div style={{ height:8, background:"#1e293b", borderRadius:4, overflow:"hidden", marginBottom:16 }}>
          <div style={{ height:"100%", width:`${importProgress}%`, background:"linear-gradient(90deg,#f59e0b,#10b981)", borderRadius:4, transition:"width 0.15s linear" }}/>
        </div>
        <p style={{ fontSize:14, fontWeight:800, color:"#f59e0b" }}>{importProgress}%</p>
      </div>
    </div>
  );

  // ── DONE SCREEN ─────────────────────────────────────────────────────────────
  if (stage === "done") return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at top, #022c22 0%, #020817 60%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ textAlign:"center", maxWidth:440, padding:24, animation:"successPop 0.5s ease-out" }}>
        <div style={{ fontSize:72, marginBottom:16 }}>✅</div>
        <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:26, color:"#fff", marginBottom:8 }}>Import Complete!</h2>
        <p style={{ fontSize:14, color:"#64748b", marginBottom:28 }}>Questions are now in the Quest Academy database</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:32 }}>
          <div style={{ padding:"16px 24px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:18 }}>
            <div style={{ fontSize:28, fontWeight:900, color:"#34d399" }}>{importedCount}</div>
            <div style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em" }}>Questions Imported</div>
          </div>
          <div style={{ padding:"16px 24px", background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:18 }}>
            <div style={{ fontSize:28, fontWeight:900, color:"#f59e0b" }}>{Object.keys(subjectCounts).length}</div>
            <div style={{ fontSize:11, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em" }}>Subjects</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => { setStage("upload"); setQuestions([]); setFileName(""); setSelectedRows(new Set()); }}
            style={{ flex:1, padding:14, borderRadius:14, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#64748b", fontWeight:700, cursor:"pointer" }}>
            ← Import Another File
          </button>
          <button onClick={() => setStage("preview")}
            style={{ flex:1, padding:14, borderRadius:14, border:"none", background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#0f172a", fontWeight:900, cursor:"pointer" }}>
            View Question Bank
          </button>
        </div>
      </div>
    </div>
  );

  // ── PREVIEW SCREEN ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"radial-gradient(ellipse at 15% 10%, #0e1e4a 0%, #020817 60%)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{CSS}</style>

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div style={{ background:"rgba(15,23,42,0.9)", borderBottom:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"12px 20px", display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => setStage("upload")} style={{ background:"none", border:"none", color:"#475569", fontSize:20, cursor:"pointer", padding:"4px 8px", borderRadius:8 }}>‹</button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:16, color:"#fff", whiteSpace:"nowrap" }}>Import Preview</h2>
              <span style={{ fontSize:12, color:"#475569", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>· {fileName}</span>
              {format && (
                <span style={{ padding:"2px 10px", borderRadius:999, fontSize:11, fontWeight:700,
                  background: format==="bond" ? "rgba(245,158,11,0.12)" : "rgba(129,140,248,0.12)",
                  border: format==="bond" ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(129,140,248,0.3)",
                  color: format==="bond" ? "#f59e0b" : "#818cf8", whiteSpace:"nowrap",
                }}>
                  {format==="bond" ? "Bond Format" : format==="gl" ? "GL Assessment" : "Unknown Format"}
                </span>
              )}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <span style={{ fontSize:13, color:"#475569" }}>
              <span style={{ color:"#34d399", fontWeight:800 }}>{selectedValid}</span> selected
            </span>
            <button
              onClick={handleImport}
              disabled={selectedValid === 0}
              style={{
                padding:"10px 22px", borderRadius:12, border:"none",
                background: selectedValid > 0 ? "linear-gradient(135deg,#f59e0b,#d97706)" : "#1e293b",
                color: selectedValid > 0 ? "#0f172a" : "#475569",
                fontWeight:900, fontSize:13, cursor: selectedValid > 0 ? "pointer" : "not-allowed",
                boxShadow: selectedValid > 0 ? "0 4px 16px rgba(245,158,11,0.3)" : "none",
              }}
            >
              Import {selectedValid} Questions →
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"20px 20px 60px" }}>

        {/* ── STATS ROW ──────────────────────────────────────────────── */}
        <div style={{ display:"flex", gap:12, marginBottom:24, animation:"fadeUp 0.4s ease-out" }}>
          <StatCard icon="📊" value={questions.length} label="Total rows"   color="#e2e8f0" />
          <StatCard icon="✅" value={validCount}        label="Valid"        color="#34d399" />
          <StatCard icon="⚠️" value={invalidCount}      label="Errors"       color="#f43f5e" />
          <StatCard icon="☑️" value={selectedValid}     label="Selected"     color="#f59e0b" />
        </div>

        {/* ── TABS ───────────────────────────────────────────────────── */}
        <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid rgba(255,255,255,0.07)", paddingBottom:0 }}>
          {[
            { key:"questions", label:`Questions (${questions.length})`, icon:"📋" },
            { key:"errors",    label:`Errors (${invalidCount})`,        icon:"⚠️" },
            { key:"stats",     label:"Stats & Coverage",                icon:"📊" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding:"10px 18px", borderRadius:"12px 12px 0 0", border:"none",
              background: activeTab===tab.key ? "rgba(255,255,255,0.06)" : "transparent",
              color: activeTab===tab.key ? "#e2e8f0" : "#475569",
              fontWeight: activeTab===tab.key ? 700 : 600, fontSize:13, cursor:"pointer",
              borderBottom: activeTab===tab.key ? "2px solid #f59e0b" : "2px solid transparent",
              transition:"all 0.2s",
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: QUESTIONS ─────────────────────────────────────────── */}
        {activeTab === "questions" && (
          <div style={{ animation:"fadeIn 0.3s ease-out" }}>
            {/* Filters */}
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search questions or topics…"
                style={{ flex:1, minWidth:200, padding:"9px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.04)", color:"#e2e8f0", fontSize:13, outline:"none" }}
              />
              {[
                { state:filterSubj, set:setFilterSubj, options:["all","English","Maths","Verbal Reasoning","Non-Verbal Reasoning"], label:"Subject" },
                { state:filterDiff, set:setFilterDiff, options:["all","easy","medium","hard"],                                        label:"Difficulty" },
                { state:filterValid, set:setFilterValid, options:["all","valid","invalid"],                                            label:"Status" },
              ].map(f => (
                <select key={f.label} value={f.state} onChange={e => f.set(e.target.value)} style={{
                  padding:"9px 12px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)",
                  background:"rgba(255,255,255,0.04)", color:"#e2e8f0", fontSize:13, cursor:"pointer",
                }}>
                  {f.options.map(o => <option key={o} value={o} style={{ background:"#0f172a" }}>{o==="all" ? `All ${f.label}s` : o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
                </select>
              ))}
              <span style={{ fontSize:12, color:"#334155" }}>{visible.length} shown</span>
            </div>

            {/* Select all */}
            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <button onClick={() => setSelectedRows(new Set(questions.filter(q=>q._errors.length===0).map(q=>q._id)))}
                style={{ padding:"6px 14px", borderRadius:10, border:"1px solid rgba(52,211,153,0.3)", background:"rgba(52,211,153,0.08)", color:"#34d399", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                ☑ Select all valid ({validCount})
              </button>
              <button onClick={() => setSelectedRows(new Set())}
                style={{ padding:"6px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#475569", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                ☐ Deselect all
              </button>
            </div>

            {/* Table */}
            <div className="table-scroll" style={{ overflowX:"auto", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:800 }}>
                <thead>
                  <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", width:40 }}>#</th>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", width:36 }}>✓</th>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Subject</th>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Difficulty</th>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Question</th>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Answer</th>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Topic</th>
                    <th style={{ padding:"12px 14px", textAlign:"left", color:"#475569", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.slice(0, 200).map((q, i) => {
                    const sm = SUBJECT_META[q.subject] || {};
                    const dm = DIFF_META[q.difficulty] || {};
                    const isSelected = selectedRows.has(q._id);
                    const hasErrors  = q._errors.length > 0;
                    return (
                      <tr key={q._id} className="row-anim"
                        style={{
                          borderBottom:"1px solid rgba(255,255,255,0.04)",
                          background: hasErrors ? "rgba(244,63,94,0.04)" : isSelected ? "rgba(255,255,255,0.02)" : "transparent",
                          animationDelay:`${Math.min(i * 0.02, 0.3)}s`,
                          transition:"background 0.15s",
                          cursor: hasErrors ? "default" : "pointer",
                        }}
                        onClick={() => {
                          if (hasErrors) return;
                          const next = new Set(selectedRows);
                          if (next.has(q._id)) next.delete(q._id); else next.add(q._id);
                          setSelectedRows(next);
                        }}
                      >
                        <td style={{ padding:"10px 14px", color:"#334155", fontSize:11 }}>{q._row}</td>
                        <td style={{ padding:"10px 14px" }}>
                          {!hasErrors && (
                            <div style={{
                              width:16, height:16, borderRadius:4, border:`2px solid ${isSelected ? "#f59e0b" : "rgba(255,255,255,0.15)"}`,
                              background: isSelected ? "#f59e0b" : "transparent", transition:"all 0.15s",
                              display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#0f172a",
                            }}>{isSelected ? "✓" : ""}</div>
                          )}
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          {q.subject ? (
                            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, color: sm.color || "#94a3b8" }}>
                              <span>{sm.icon || "?"}</span>{q.subject}
                            </span>
                          ) : <span style={{ color:"#f43f5e", fontSize:11 }}>—</span>}
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          {q.difficulty && dm.label ? (
                            <Pill color={dm.color} bg={dm.bg} border={dm.border}>{dm.label}</Pill>
                          ) : <span style={{ color:"#f43f5e", fontSize:11 }}>{q.difficulty || "—"}</span>}
                        </td>
                        <td style={{ padding:"10px 14px", color:"#cbd5e1", maxWidth:320 }}>
                          <span style={{ display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {q.question || <span style={{ color:"#f43f5e" }}>Missing question</span>}
                          </span>
                        </td>
                        <td style={{ padding:"10px 14px", color:"#64748b", fontSize:12, maxWidth:140 }}>
                          <span style={{ display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.answer || "—"}</span>
                        </td>
                        <td style={{ padding:"10px 14px", color:"#475569", fontSize:11 }}>
                          {q.topic && <span style={{ padding:"2px 8px", background:"rgba(255,255,255,0.04)", borderRadius:999, border:"1px solid rgba(255,255,255,0.06)" }}>{q.topic}</span>}
                        </td>
                        <td style={{ padding:"10px 14px" }}>
                          {hasErrors
                            ? <Pill color="#f43f5e" bg="rgba(244,63,94,0.1)" border="rgba(244,63,94,0.3)">⚠ {q._errors.length} error{q._errors.length>1?"s":""}</Pill>
                            : <Pill color="#34d399" bg="rgba(52,211,153,0.1)" border="rgba(52,211,153,0.25)">✓ Valid</Pill>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {visible.length > 200 && (
                <div style={{ padding:14, textAlign:"center", fontSize:12, color:"#334155", background:"rgba(255,255,255,0.02)" }}>
                  Showing first 200 of {visible.length} rows — use filters to narrow down
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: ERRORS ────────────────────────────────────────────── */}
        {activeTab === "errors" && (
          <div style={{ animation:"fadeIn 0.3s ease-out" }}>
            {invalidCount === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
                <p style={{ fontSize:16, fontWeight:800, color:"#34d399", marginBottom:6 }}>No errors found!</p>
                <p style={{ fontSize:13, color:"#475569" }}>All {validCount} rows are ready to import.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {errors.map((q, i) => (
                  <div key={q._id} style={{ padding:"16px 18px", borderRadius:16, background:"rgba(244,63,94,0.05)", border:"1px solid rgba(244,63,94,0.2)", animation:"rowIn 0.25s ease-out both", animationDelay:`${i*0.03}s` }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:"#f43f5e", padding:"2px 8px", background:"rgba(244,63,94,0.1)", borderRadius:999 }}>Row {q._row}</span>
                          {q.subject && <span style={{ fontSize:11, color:SUBJECT_META[q.subject]?.color || "#94a3b8", fontWeight:700 }}>{q.subject}</span>}
                          {q.difficulty && <span style={{ fontSize:11, color:DIFF_META[q.difficulty]?.color || "#94a3b8" }}>{q.difficulty}</span>}
                        </div>
                        <p style={{ fontSize:13, color:"#cbd5e1", marginBottom:8, fontStyle: q.question ? "normal" : "italic" }}>
                          {q.question || "No question text"}
                        </p>
                        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                          {q._errors.map((err, j) => (
                            <div key={j} style={{ fontSize:12, color:"#fca5a5", display:"flex", gap:6, alignItems:"flex-start" }}>
                              <span style={{ flexShrink:0 }}>⚠</span>
                              <span>{err}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: STATS ─────────────────────────────────────────────── */}
        {activeTab === "stats" && (
          <div style={{ animation:"fadeIn 0.3s ease-out", display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {/* By Subject */}
            <div style={{ padding:20, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>📚 By Subject</p>
              {["English","Maths","Verbal Reasoning","Non-Verbal Reasoning"].map(s => {
                const cnt = subjectCounts[s] || 0;
                const sm = SUBJECT_META[s] || {};
                return (
                  <div key={s} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:5 }}>
                      <span style={{ color:"#e2e8f0", fontWeight:600 }}>{sm.icon} {s}</span>
                      <span style={{ color:sm.color || "#94a3b8", fontWeight:800 }}>{cnt}</span>
                    </div>
                    <div style={{ height:5, background:"#1e293b", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${validCount > 0 ? (cnt/validCount)*100 : 0}%`, background:sm.color || "#64748b", borderRadius:3, transition:"width 0.8s ease" }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* By Difficulty */}
            <div style={{ padding:20, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>🎯 By Difficulty</p>
              {["easy","medium","hard"].map(d => {
                const cnt = diffCounts[d] || 0;
                const dm = DIFF_META[d] || {};
                return (
                  <ProgressBar key={d} value={cnt} max={validCount} color={dm.color} label={`${dm.label || d} (${d})`} />
                );
              })}
              <div style={{ marginTop:16, padding:14, background:"rgba(255,255,255,0.02)", borderRadius:12, border:"1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize:11, color:"#334155", textAlign:"center" }}>
                  {validCount} valid · {invalidCount} errors · {Math.round((validCount/Math.max(questions.length,1))*100)}% pass rate
                </p>
              </div>
            </div>

            {/* Coverage matrix */}
            <div style={{ gridColumn:"1 / -1", padding:20, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18 }}>
              <p style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16 }}>🗺 Coverage Matrix</p>
              <div className="table-scroll" style={{ overflowX:"auto" }}>
                <table style={{ borderCollapse:"collapse", fontSize:13, width:"100%" }}>
                  <thead>
                    <tr>
                      <th style={{ padding:"8px 16px", color:"#475569", textAlign:"left", fontSize:11, fontWeight:700 }}>Subject</th>
                      {["easy","medium","hard"].map(d => (
                        <th key={d} style={{ padding:"8px 16px", textAlign:"center", fontSize:11, fontWeight:700, color: DIFF_META[d]?.color || "#94a3b8" }}>
                          {DIFF_META[d]?.label || d}
                        </th>
                      ))}
                      <th style={{ padding:"8px 16px", textAlign:"center", fontSize:11, fontWeight:700, color:"#64748b" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["English","Maths","Verbal Reasoning","Non-Verbal Reasoning"].map(subj => {
                      const sm = SUBJECT_META[subj] || {};
                      const total = questions.filter(q=>q.subject===subj && q._errors.length===0).length;
                      return (
                        <tr key={subj} style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding:"10px 16px", fontSize:13, fontWeight:700, color:sm.color||"#94a3b8" }}>
                            {sm.icon} {subj}
                          </td>
                          {["easy","medium","hard"].map(diff => {
                            const cnt = questions.filter(q=>q.subject===subj && q.difficulty===diff && q._errors.length===0).length;
                            const target = 50;
                            const pct = Math.min(cnt/target, 1);
                            const cellColor = cnt === 0 ? "rgba(244,63,94,0.15)" : pct >= 1 ? "rgba(52,211,153,0.12)" : pct >= 0.5 ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)";
                            const textColor = cnt === 0 ? "#f43f5e" : pct >= 1 ? "#34d399" : pct >= 0.5 ? "#f59e0b" : "#94a3b8";
                            return (
                              <td key={diff} style={{ padding:"10px 16px", textAlign:"center", background:cellColor, borderLeft:"1px solid rgba(255,255,255,0.04)" }}>
                                <span style={{ fontWeight:900, color:textColor, fontSize:15 }}>{cnt}</span>
                                <span style={{ fontSize:10, color:"#334155", display:"block" }}>/ 50 target</span>
                              </td>
                            );
                          })}
                          <td style={{ padding:"10px 16px", textAlign:"center", borderLeft:"1px solid rgba(255,255,255,0.05)", fontWeight:900, color:"#e2e8f0" }}>{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize:11, color:"#1e293b", marginTop:12 }}>
                🟢 = 50+ questions (target met) · 🟡 = 25–49 · 🔴 = under 25 · Target: 50 per subject per difficulty
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

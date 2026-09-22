import { useRef, useState } from 'react'
import { Activity, AudioLines, BarChart3, Bell, Check, ChevronDown, CircleHelp, Clock3, FileAudio, Home, Info, Menu, Mic, MoreHorizontal, Pause, Play, Plus, Search, Settings, Sparkles, Upload, Users, X } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './App.css'

const trendData = [
  { day: 'Mon', score: 61 }, { day: 'Tue', score: 67 }, { day: 'Wed', score: 64 },
  { day: 'Thu', score: 72 }, { day: 'Fri', score: 70 }, { day: 'Sat', score: 78 }, { day: 'Sun', score: 76 },
]
const sessions = [
  { title: 'Morning check-in', date: 'Today, 9:42 AM', duration: '02:14', score: '84', color: 'mint' },
  { title: 'Weekly reflection', date: 'Yesterday, 4:18 PM', duration: '07:36', score: '78', color: 'gold' },
  { title: 'Project debrief', date: 'May 24, 11:05 AM', duration: '05:22', score: '71', color: 'coral' },
]

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFile, setUploadedFile] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const fileInputRef = useRef(null)
  const handleRecord = () => setIsRecording((recording) => !recording)
  const handleUpload = (event) => { const file = event.target.files?.[0]; if (file) setUploadedFile(file.name) }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><AudioLines size={18} /></span><span>Parkinson Voice</span></div>
        <div className="workspace-switcher"><span className="avatar avatar-small">AM</span><span><b>Alex Morgan</b><small>Personal workspace</small></span><ChevronDown size={14} /></div>
        <nav className="main-nav" aria-label="Main navigation"><p className="nav-label">WORKSPACE</p>{[[Home, 'Overview'], [FileAudio, 'Sessions'], [BarChart3, 'Insights'], [Users, 'Collaborators']].map(([Icon, label]) => <button className={activeNav === label ? 'nav-item active' : 'nav-item'} key={label} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{label === 'Sessions' && <span className="nav-count">12</span>}</button>)}<p className="nav-label nav-label-spaced">MANAGE</p>{[[Settings, 'Settings'], [CircleHelp, 'Help center']].map(([Icon, label]) => <button className="nav-item" key={label}><Icon size={18} /><span>{label}</span></button>)}</nav>
        <div className="sidebar-bottom"><div className="upgrade-card"><Sparkles size={16} /><b>Unlock deeper insights</b><p>Explore patterns across all your sessions.</p><button>Explore Pro <span>↗</span></button></div><div className="profile-row"><span className="avatar">AM</span><span><b>Alex Morgan</b><small>Free plan</small></span><MoreHorizontal size={18} /></div></div>
      </aside>
      <main className="content">
        <header className="topbar"><div className="mobile-brand"><Menu size={19} /><span className="brand-mark"><AudioLines size={16} /></span><b>Parkinson Voice</b></div><div className="breadcrumbs"><span>Parkinson Voice</span><span>/</span><b>{activeNav}</b></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><span className="avatar">AM</span></div></header>
        <div className="page-wrap">
          <section className="welcome-row"><div><p className="eyebrow"><span className="status-dot" /> Tuesday, May 28, 2024</p><h1>Good morning, Alex<span className="title-dot">.</span></h1><p className="intro">Turn your voice into a clearer picture of how you think, feel, and communicate.</p></div><button className="new-session" onClick={() => setIsRecording(true)}><Plus size={17} /> New session</button></section>
          <section className="capture-grid">
            <div className="record-card"><div className="card-heading"><div><p className="eyebrow">CAPTURE A THOUGHT</p><h2>{isRecording ? 'Listening closely...' : 'What is on your mind?'}</h2></div><span className="live-pill"><span /> {isRecording ? 'Recording' : 'Ready'}</span></div><div className={isRecording ? 'waveform is-recording' : 'waveform'} aria-label="Audio waveform">{Array.from({ length: 44 }, (_, index) => <span key={index} style={{ '--height': `${18 + ((index * 17) % 58)}%` }} />)}</div><div className="record-controls"><span className="timer">00:00</span><button className={isRecording ? 'record-button recording' : 'record-button'} onClick={handleRecord} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>{isRecording ? <Pause size={22} fill="currentColor" /> : <Mic size={22} />}</button><span className="record-hint">{isRecording ? 'Tap to pause' : 'Tap to record'}</span></div><div className="upload-divider"><span>or</span></div><button className="upload-button" onClick={() => fileInputRef.current?.click()}><Upload size={16} /> Upload an audio file <small>MP3, WAV up to 50MB</small></button><input ref={fileInputRef} type="file" accept="audio/*" hidden onChange={handleUpload} />{uploadedFile && <p className="uploaded-file"><Check size={14} /> {uploadedFile} is ready to analyze</p>}</div>
            <div className="today-card"><div className="card-heading"><div><p className="eyebrow">YOUR MOMENTUM</p><h2>Small steps, real progress.</h2></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="momentum-score"><strong>76</strong><span>/ 100</span><em>+8.4%</em></div><div className="trend-chart"><ResponsiveContainer width="100%" height={112}><AreaChart data={trendData}><defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#76b7a0" stopOpacity={0.32} /><stop offset="100%" stopColor="#76b7a0" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e9ede8" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#91a097', fontSize: 10 }} /><YAxis hide domain={[50, 90]} /><Tooltip cursor={{ stroke: '#b8c8bf' }} contentStyle={{ border: 0, borderRadius: 8, fontSize: 11 }} /><Area type="monotone" dataKey="score" stroke="#4e9179" strokeWidth={2.5} fill="url(#scoreFill)" /></AreaChart></ResponsiveContainer></div><div className="score-footer"><span><Activity size={14} /> Consistency</span><b>Strong</b></div></div>
          </section>
          <section className="section-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Your sessions</h2></div><button className="text-button">View all <span>↗</span></button></section>
          <section className="sessions-card">{sessions.map((session, index) => <div className="session-row" key={session.title}><div className={`session-icon ${session.color}`}>{index === 0 ? <AudioLines size={19} /> : <FileAudio size={18} />}</div><div className="session-main"><b>{session.title}</b><span>{session.date}</span></div><div className="session-duration"><Clock3 size={14} /> {session.duration}</div><div className="mini-score"><span className="score-ring" style={{ '--score': `${session.score}%` }}><b>{session.score}</b></span><span>Clarity score</span></div><button className="play-button" onClick={() => setIsPlaying(!isPlaying)} aria-label="Play session">{isPlaying && index === 0 ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}</button><button className="more-button" aria-label="More options"><MoreHorizontal size={18} /></button></div>)}</section>
          <section className="insight-banner"><div className="insight-spark"><Sparkles size={20} /></div><div><p className="eyebrow">A NOTE FROM PARKINSON VOICE</p><h3>Your clearest moments happen when your voice feels relaxed.</h3><p>Morning sessions have a <b>14% higher clarity score</b> this month.</p></div><button className="insight-action" aria-label="Dismiss insight"><X size={17} /></button></section>
          <footer className="footer"><span>Parkinson Voice / personal voice health</span><span><Info size={14} /> Your data is private and encrypted</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App

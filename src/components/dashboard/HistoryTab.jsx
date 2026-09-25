import { useState } from 'react'
import { AudioLines, Calendar, Clock, Download, FileAudio, Filter, Pause, Play, Search, Trash2, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react'
import { useVoiceApp } from '../../context/VoiceAppContext'

export default function HistoryTab() {
  const { sessions, setSessions, currentSession, setCurrentSession } = useVoiceApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('All')
  const [playingId, setPlayingId] = useState(null)

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const handleExportPDF = (session, e) => {
    e.stopPropagation()
    const reportJSON = JSON.stringify(session, null, 2)
    const blob = new Blob([reportJSON], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ParkinsonVoice_Report_${session.id}.json`
    a.click()
  }

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = filterRisk === 'All' || s.riskLevel === filterRisk
    return matchesSearch && matchesRisk
  })

  return (
    <div className="history-container animate-fade-in">
      {/* Header Banner */}
      <div className="history-header glass-panel">
        <div>
          <p className="eyebrow neon-badge neon-badge-purple">CLINICAL AUDIT TRAIL</p>
          <h2 className="history-title">Session History & Export</h2>
          <p className="history-desc">
            Review past voice recordings, track acoustic perturbation over time, and generate exportable clinical JSON summaries.
          </p>
        </div>

        <button
          className="btn-cyber-primary"
          onClick={() => handleExportPDF(currentSession || sessions[0], { stopPropagation: () => {} })}
        >
          <Download size={16} /> Export Active Session Report
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="filter-controls-bar glass-panel">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search sessions by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="risk-filters">
          <Filter size={16} className="filter-icon" />
          {['All', 'Low Risk', 'Mild Variance', 'Elevated Biomarkers'].map((risk) => (
            <button
              key={risk}
              className={`filter-chip ${filterRisk === risk ? 'active' : ''}`}
              onClick={() => setFilterRisk(risk)}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Grid / Table */}
      <div className="history-list glass-panel">
        {filteredSessions.length === 0 ? (
          <div className="empty-history">
            <FileAudio size={40} className="empty-icon" />
            <p>No recording sessions match your query.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isPlaying = playingId === session.id
            const isSelected = currentSession?.id === session.id

            let badgeClass = 'neon-badge-emerald'
            let RiskIcon = CheckCircle2
            if (session.riskLevel === 'Elevated Biomarkers') {
              badgeClass = 'neon-badge-magenta'
              RiskIcon = ShieldAlert
            } else if (session.riskLevel === 'Mild Variance') {
              badgeClass = 'neon-badge-amber'
              RiskIcon = AlertCircle
            }

            return (
              <div
                key={session.id}
                className={`history-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setCurrentSession(session)}
              >
                <div className="card-left">
                  <div className="session-type-icon">
                    <AudioLines size={22} />
                  </div>
                  <div className="title-block">
                    <b className="session-title">{session.title}</b>
                    <small className="session-date-row">
                      <Calendar size={12} /> {session.date} • {session.category}
                    </small>
                  </div>
                </div>

                <div className="card-center">
                  <div className="metric-chip font-mono">
                    <span>Jitter: <b>{(session.metrics.jitter * 100).toFixed(2)}%</b></span>
                    <span>Shimmer: <b>{(session.metrics.shimmer * 100).toFixed(2)}%</b></span>
                    <span>HNR: <b>{session.metrics.hnr.toFixed(1)} dB</b></span>
                  </div>
                  <span className={`neon-badge ${badgeClass}`}>
                    <RiskIcon size={13} /> {session.riskLevel}
                  </span>
                </div>

                <div className="card-right">
                  <div className="duration-pill font-mono">
                    <Clock size={14} /> {session.duration}
                  </div>

                  <button
                    className={`play-btn ${isPlaying ? 'playing' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay(session.id)
                    }}
                    title="Play audio preview"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                  </button>

                  <button
                    className="action-icon-btn"
                    onClick={(e) => handleExportPDF(session, e)}
                    title="Export JSON report"
                  >
                    <Download size={16} />
                  </button>

                  <button
                    className="action-icon-btn danger"
                    onClick={(e) => handleDelete(session.id, e)}
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <style>{`
        .history-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .history-header {
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(15, 20, 38, 0.7), rgba(157, 78, 221, 0.1));
        }

        .history-title {
          font-size: 1.8rem;
          color: #fff;
          font-weight: 800;
        }

        .history-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 600px;
        }

        .filter-controls-bar {
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-dim);
        }

        .search-box input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 8px 16px 8px 40px;
          color: #fff;
          font-size: 0.88rem;
        }

        .risk-filters {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-icon {
          color: var(--text-dim);
        }

        .filter-chip {
          padding: 6px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .filter-chip.active {
          background: rgba(0, 242, 254, 0.15);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
        }

        .history-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty-history {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          gap: 12px;
          color: var(--text-dim);
        }

        .history-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .history-card:hover, .history-card.selected {
          background: rgba(0, 242, 254, 0.08);
          border-color: rgba(0, 242, 254, 0.3);
        }

        .card-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }

        .session-type-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(0, 242, 254, 0.12);
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title-block {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .session-title {
          font-size: 1rem;
          color: #fff;
        }

        .session-date-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: var(--text-dim);
        }

        .card-center {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          justify-content: center;
        }

        .metric-chip {
          display: flex;
          gap: 12px;
          font-size: 0.78rem;
          color: var(--text-muted);
          background: rgba(0, 0, 0, 0.3);
          padding: 6px 12px;
          border-radius: 8px;
        }

        .metric-chip b {
          color: #fff;
        }

        .card-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .duration-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .action-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .action-icon-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }

        .action-icon-btn.danger:hover {
          background: rgba(255, 0, 127, 0.2);
          color: var(--neon-magenta);
          border-color: var(--neon-magenta);
        }
      `}</style>
    </div>
  )
}

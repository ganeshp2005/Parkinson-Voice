import { useEffect, useState } from 'react'
import { AlertCircle, Brain, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function MLPredictionGauge({ session }) {
  const riskScore = session?.riskScore || 14
  const riskLevel = session?.riskLevel || 'Low Risk'
  const clarityScore = session?.clarityScore || 88

  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += 2
      if (current >= riskScore) {
        setAnimatedScore(riskScore)
        clearInterval(interval)
      } else {
        setAnimatedScore(current)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [riskScore])

  // Color selection based on risk
  let colorClass = 'emerald'
  let strokeColor = '#00f5d4'
  let Icon = CheckCircle2

  if (riskScore > 50) {
    colorClass = 'magenta'
    strokeColor = '#ff007f'
    Icon = ShieldAlert
  } else if (riskScore > 25) {
    colorClass = 'amber'
    strokeColor = '#ffb703'
    Icon = AlertCircle
  }

  // SVG Gauge circumference calculations
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="gauge-card glass-panel">
      <div className="gauge-header">
        <div>
          <p className={`eyebrow neon-badge neon-badge-${colorClass}`}>AI RISK INDEX</p>
          <h3 className="gauge-title">Vocal Dysphonia Index</h3>
        </div>
        <Brain size={24} className="brain-icon" />
      </div>

      <div className="gauge-visual-wrap">
        <svg className="radial-gauge-svg" width="180" height="180" viewBox="0 0 180 180">
          {/* Background Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="gauge-bg-circle"
            strokeWidth="12"
          />
          {/* Animated Glow Circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            className="gauge-progress-circle"
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content */}
        <div className="gauge-center-content">
          <span className="gauge-number font-display">{animatedScore}%</span>
          <span className="gauge-label">RISK INDEX</span>
        </div>
      </div>

      {/* Risk Badge & Description */}
      <div className={`risk-result-badge ${colorClass}`}>
        <Icon size={18} />
        <b>{riskLevel}</b>
      </div>

      <p className="gauge-summary">
        {session?.analysisSummary || 'Phonation features show minimal vocal tremor and consistent pitch harmonics.'}
      </p>

      <div className="gauge-footer-stats">
        <div className="stat-col">
          <span>Clarity Score</span>
          <b>{clarityScore}/100</b>
        </div>
        <div className="stat-divider" />
        <div className="stat-col">
          <span>Neural Confidence</span>
          <b>96.4%</b>
        </div>
      </div>

      <style>{`
        .gauge-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .gauge-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .gauge-title {
          font-size: 1.15rem;
          color: #fff;
          font-weight: 700;
          text-align: left;
        }

        .brain-icon {
          color: var(--neon-cyan);
          filter: drop-shadow(0 0 8px var(--neon-cyan));
        }

        .gauge-visual-wrap {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px 0;
        }

        .radial-gauge-svg {
          transform: rotate(-90deg);
        }

        .gauge-bg-circle {
          fill: none;
          stroke: rgba(255, 255, 255, 0.08);
        }

        .gauge-progress-circle {
          fill: none;
          transition: stroke-dashoffset 0.8s ease-out;
          filter: drop-shadow(0 0 10px currentColor);
        }

        .gauge-center-content {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .gauge-number {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }

        .gauge-label {
          font-size: 0.68rem;
          letter-spacing: 1px;
          color: var(--text-muted);
          font-weight: 700;
          margin-top: 4px;
        }

        .risk-result-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          width: 100%;
          justify-content: center;
        }

        .risk-result-badge.emerald {
          background: rgba(0, 245, 212, 0.12);
          color: var(--neon-emerald);
          border: 1px solid rgba(0, 245, 212, 0.35);
        }

        .risk-result-badge.amber {
          background: rgba(255, 183, 3, 0.15);
          color: var(--neon-amber);
          border: 1px solid rgba(255, 183, 3, 0.4);
        }

        .risk-result-badge.magenta {
          background: rgba(255, 0, 127, 0.15);
          color: var(--neon-magenta);
          border: 1px solid rgba(255, 0, 127, 0.4);
        }

        .gauge-summary {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .gauge-footer-stats {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .stat-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-col span {
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .stat-col b {
          font-size: 0.95rem;
          color: #fff;
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

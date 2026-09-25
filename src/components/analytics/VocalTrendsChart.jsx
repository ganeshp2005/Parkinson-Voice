import { Activity, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function VocalTrendsChart() {
  const trendData = [
    { day: 'Mon', score: 82, jitter: 0.32, hnr: 26.2 },
    { day: 'Tue', score: 84, jitter: 0.34, hnr: 26.8 },
    { day: 'Wed', score: 79, jitter: 0.48, hnr: 24.5 },
    { day: 'Thu', score: 88, jitter: 0.28, hnr: 28.1 },
    { day: 'Fri', score: 86, jitter: 0.31, hnr: 27.4 },
    { day: 'Sat', score: 91, jitter: 0.25, hnr: 29.0 },
    { day: 'Sun', score: 89, jitter: 0.29, hnr: 28.2 }
  ]

  return (
    <div className="trends-card glass-panel">
      <div className="trends-header">
        <div>
          <p className="eyebrow neon-badge neon-badge-emerald">LONGITUDINAL VOCAL STABILITY</p>
          <h3 className="trends-title">7-Day Clarity & Phonation Trend</h3>
        </div>
        <div className="trend-stat">
          <TrendingUp size={16} className="trend-icon" />
          <span>+8.4% Phonation Stability</span>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis hide domain={[60, 100]} />
            <Tooltip
              contentStyle={{
                background: 'rgba(10, 13, 26, 0.9)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)'
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#00f2fe"
              strokeWidth={3}
              fill="url(#scoreGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer font-mono">
        <div className="footer-item">
          <Activity size={14} className="icon-cyan" />
          <span>Average Clarity: <b>85.7%</b></span>
        </div>
        <div className="footer-item">
          <span className="dot-emerald" />
          <span>Jitter Variance: <b>Low (0.32%)</b></span>
        </div>
      </div>

      <style>{`
        .trends-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trends-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .trends-title {
          font-size: 1.15rem;
          color: #fff;
          font-weight: 700;
        }

        .trend-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 12px;
          background: rgba(0, 245, 212, 0.12);
          border: 1px solid rgba(0, 245, 212, 0.3);
          color: var(--neon-emerald);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .chart-wrapper {
          width: 100%;
          height: 160px;
        }

        .chart-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .icon-cyan {
          color: var(--neon-cyan);
        }

        .dot-emerald {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--neon-emerald);
          box-shadow: 0 0 6px var(--neon-emerald);
        }
      `}</style>
    </div>
  )
}

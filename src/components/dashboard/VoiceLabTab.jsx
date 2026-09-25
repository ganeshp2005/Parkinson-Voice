import { useState } from 'react'
import { Activity, AudioLines, Cpu, Sliders, Play, Mic, RefreshCw, Volume2, Waves } from 'lucide-react'
import { useVoiceApp } from '../../context/VoiceAppContext'
import AcousticMetricsGrid from '../analytics/AcousticMetricsGrid'
import SpectrogramView from '../analytics/SpectrogramView'
import LiveAudioCanvas from '../voice/LiveAudioCanvas'

export default function VoiceLabTab() {
  const { currentSession, isRecording, setIsRecording, addSession } = useVoiceApp()
  const [activeFilter, setActiveFilter] = useState('raw')
  const [selectedTestPreset, setSelectedTestPreset] = useState('sustained-vowel')

  const testPresets = [
    { id: 'sustained-vowel', name: 'Sustained Phononic /a/ Vowel', desc: 'Hold "Ahhh" at comfortable pitch for 4-5s.', targetMetric: 'Jitter & Shimmer' },
    { id: 'diadochokinetic', name: 'Rapid Syllables (/pa-ta-ka/)', desc: 'Repeat "Pa-Ta-Ka" as fast and evenly as possible.', targetMetric: 'Motor Timing & Pace' },
    { id: 'pitch-glide', name: 'Pitch Sweep (Glissando)', desc: 'Glide voice smoothly from lowest to highest pitch.', targetMetric: 'Fundamental F0 Range' },
  ]

  return (
    <div className="voice-lab-container animate-fade-in">
      {/* Studio Banner */}
      <div className="lab-hero glass-panel">
        <div className="lab-hero-left">
          <p className="eyebrow neon-badge neon-badge-cyan">ACOUSTIC SIGNAL LAB</p>
          <h2 className="lab-title">Neural Phonation Studio</h2>
          <p className="lab-desc">
            Deep-dive acoustic laboratory for signal analysis, tremor extraction, spectral cepstrum mapping, and pitch perturbation.
          </p>
        </div>
        <div className="lab-hero-right">
          <span className="sample-rate-pill font-mono">48,000 Hz • 24-Bit PCM</span>
        </div>
      </div>

      {/* Preset Test Picker Cards */}
      <div className="presets-grid">
        {testPresets.map((preset) => (
          <div
            key={preset.id}
            className={`preset-card glass-panel ${selectedTestPreset === preset.id ? 'active-preset' : ''}`}
            onClick={() => setSelectedTestPreset(preset.id)}
          >
            <div className="preset-top">
              <AudioLines size={18} className="preset-icon" />
              <span className="neon-badge neon-badge-purple">{preset.targetMetric}</span>
            </div>
            <b className="preset-name">{preset.name}</b>
            <p className="preset-desc">{preset.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Studio Console */}
      <div className="studio-console-grid">
        {/* Visualizer Studio */}
        <div className="visualizer-studio glass-panel">
          <div className="studio-header">
            <div>
              <p className="eyebrow neon-badge neon-badge-emerald">REAL-TIME SPECTRAL ENGINE</p>
              <h3 className="studio-heading">Frequency Spectrum Canvas</h3>
            </div>

            {/* Filter Toggle */}
            <div className="filter-toggles">
              <button
                className={`filter-btn ${activeFilter === 'raw' ? 'active' : ''}`}
                onClick={() => setActiveFilter('raw')}
              >
                Raw Audio
              </button>
              <button
                className={`filter-btn ${activeFilter === 'bandpass' ? 'active' : ''}`}
                onClick={() => setActiveFilter('bandpass')}
              >
                Bandpass (80-500Hz)
              </button>
              <button
                className={`filter-btn ${activeFilter === 'tremor' ? 'active' : ''}`}
                onClick={() => setActiveFilter('tremor')}
              >
                Tremor Isolation
              </button>
            </div>
          </div>

          <LiveAudioCanvas isRecording={isRecording} />

          <div className="studio-controls-bar">
            <div className="gain-indicator font-mono">
              <Sliders size={16} /> <span>Gain: <b>+0.0 dB</b></span>
            </div>
            <button
              className={`btn-cyber-danger ${isRecording ? 'pulse' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic size={18} /> {isRecording ? 'Stop Recording' : 'Start Studio Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Acoustic Biomarkers & Spectrogram */}
      <AcousticMetricsGrid metrics={currentSession?.metrics} />
      <SpectrogramView mfcc={currentSession?.mfcc} />

      <style>{`
        .voice-lab-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .lab-hero {
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(157, 78, 221, 0.15), rgba(0, 242, 254, 0.08));
          border-color: rgba(157, 78, 221, 0.3);
        }

        .lab-hero-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lab-title {
          font-size: 1.8rem;
          color: #fff;
          font-weight: 800;
        }

        .lab-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 600px;
        }

        .sample-rate-pill {
          padding: 8px 14px;
          border-radius: 12px;
          background: rgba(0, 242, 254, 0.12);
          border: 1px solid rgba(0, 242, 254, 0.35);
          color: var(--neon-cyan);
          font-size: 0.8rem;
          font-weight: 700;
        }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .presets-grid {
            grid-template-columns: 1fr;
          }
        }

        .preset-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .preset-card.active-preset {
          background: rgba(0, 242, 254, 0.12);
          border-color: var(--neon-cyan);
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
        }

        .preset-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .preset-icon {
          color: var(--neon-cyan);
        }

        .preset-name {
          font-size: 1.05rem;
          color: #fff;
        }

        .preset-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .studio-console-grid {
          display: flex;
          flex-direction: column;
        }

        .visualizer-studio {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .studio-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .studio-heading {
          font-size: 1.25rem;
          color: #fff;
          font-weight: 700;
        }

        .filter-toggles {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .filter-btn {
          padding: 6px 12px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .filter-btn.active {
          background: var(--grad-primary);
          color: #000;
          font-weight: 800;
        }

        .studio-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gain-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}

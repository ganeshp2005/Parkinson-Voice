import { useState } from 'react'
import { Check, Mic, Save, Settings, ShieldCheck, Sliders, User } from 'lucide-react'
import { useVoiceApp } from '../../context/VoiceAppContext'

export default function SettingsTab() {
  const { userProfile, setUserProfile } = useVoiceApp()
  const [name, setName] = useState(userProfile.name)
  const [micDevice, setMicDevice] = useState('Default Built-in Microphone Array')
  const [sensitivity, setSensitivity] = useState(75)
  const [savedNotice, setSavedNotice] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setUserProfile((prev) => ({
      ...prev,
      name,
      avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase() || 'AM'
    }))
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  return (
    <div className="settings-container animate-fade-in">
      {/* Header */}
      <div className="settings-hero glass-panel">
        <div>
          <p className="eyebrow neon-badge neon-badge-cyan">HARDWARE & PREFERENCES</p>
          <h2 className="settings-title">System & Audio Settings</h2>
          <p className="settings-desc">
            Configure microphone audio input devices, acoustic engine threshold sensitivity, and user workspace profile.
          </p>
        </div>
        <Settings size={32} className="cyan-glow-icon" />
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        {/* User Profile Card */}
        <div className="settings-card glass-panel">
          <div className="card-title-row">
            <User size={18} className="icon-cyan" />
            <h3>User Workspace Profile</h3>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="settings-input"
            />
          </div>

          <div className="form-group">
            <label>Current Plan</label>
            <input
              type="text"
              value={userProfile.plan}
              disabled
              className="settings-input disabled"
            />
          </div>
        </div>

        {/* Audio Hardware Card */}
        <div className="settings-card glass-panel">
          <div className="card-title-row">
            <Mic size={18} className="icon-purple" />
            <h3>Microphone Hardware & Sensitivity</h3>
          </div>

          <div className="form-group">
            <label>Input Audio Device</label>
            <select
              value={micDevice}
              onChange={(e) => setMicDevice(e.target.value)}
              className="settings-select"
            >
              <option value="Default Built-in Microphone Array">Default Built-in Microphone Array</option>
              <option value="Studio USB Condenser Microphone">Studio USB Condenser Microphone</option>
              <option value="Wireless Bluetooth Headset">Wireless Bluetooth Headset</option>
            </select>
          </div>

          <div className="form-group">
            <label>Signal Processing Sensitivity Threshold: {sensitivity}%</label>
            <input
              type="range"
              min="20"
              max="100"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="settings-slider"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-cyber-primary">
            <Save size={16} /> Save Preferences
          </button>
          {savedNotice && (
            <span className="saved-badge">
              <Check size={14} /> Settings updated successfully!
            </span>
          )}
        </div>
      </form>

      <style>{`
        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-hero {
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(15, 20, 38, 0.7), rgba(0, 242, 254, 0.08));
        }

        .settings-title {
          font-size: 1.8rem;
          color: #fff;
          font-weight: 800;
        }

        .settings-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 600px;
        }

        .cyan-glow-icon {
          color: var(--neon-cyan);
          filter: drop-shadow(0 0 10px var(--neon-cyan));
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .settings-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-title-row h3 {
          font-size: 1.15rem;
          color: #fff;
          font-weight: 700;
        }

        .icon-cyan {
          color: var(--neon-cyan);
        }

        .icon-purple {
          color: var(--neon-purple);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .settings-input, .settings-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px 16px;
          color: #fff;
          font-size: 0.9rem;
          width: 100%;
          max-width: 440px;
        }

        .settings-input.disabled {
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.02);
          cursor: not-allowed;
        }

        .settings-slider {
          accent-color: var(--neon-cyan);
          max-width: 440px;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .saved-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--neon-emerald);
          font-size: 0.88rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

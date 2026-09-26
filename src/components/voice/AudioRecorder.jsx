import { useEffect, useRef, useState } from 'react'
import { Activity, Mic, RefreshCw, Square } from 'lucide-react'
import { useVoiceApp } from '../../context/VoiceAppContext'
import { extractAcousticFeatures } from '../../utils/audioAnalysis'
import LiveAudioCanvas from './LiveAudioCanvas'

export default function AudioRecorder() {
  const {
    isRecording,
    setIsRecording,
    isAnalyzing,
    setIsAnalyzing,
    patients,
    activePatientId,
    setActiveTab,
    addSession,
  } = useVoiceApp()

  const [timerSeconds, setTimerSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState('')
  const [analyserNode, setAnalyserNode] = useState(null)
  const [recordingError, setRecordingError] = useState('')

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerIntervalRef = useRef(null)
  const audioContextRef = useRef(null)
  const timerSecondsRef = useRef(0)
  const activePatient = patients.find((patient) => patient.id === activePatientId)
  const canRecord = Boolean(activePatient?.audioConsent)

  // Start Mic Recording
  const startRecording = async () => {
    if (!canRecord) return
    setRecordingError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup Web Audio API analyser
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      
      audioContextRef.current = audioCtx
      setAnalyserNode(analyser)

      // MediaRecorder setup
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop())
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        runAcousticPipeline(blob, timerSecondsRef.current)
      }

      mediaRecorder.start(100)
      setIsRecording(true)
      setTimerSeconds(0)
      timerSecondsRef.current = 0

      timerIntervalRef.current = setInterval(() => {
        timerSecondsRef.current += 1
        setTimerSeconds(timerSecondsRef.current)
      }, 1000)
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err)
      setRecordingError('Microphone access was unavailable. Check browser permissions and try again.')
    }
  }

  // Stop Mic Recording & Analyze
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    clearInterval(timerIntervalRef.current)
    setIsRecording(false)
  }

  const runAcousticPipeline = async (blob, elapsedSeconds) => {
    setIsAnalyzing(true)
    setTimeout(async () => {
      const analysisResult = await extractAcousticFeatures(blob)

      const sessionTitle = `Vocal Phonation #${Math.floor(Math.random() * 899 + 100)}`
      addSession({
        title: sessionTitle,
        category: 'Live Mic Phonation',
        patientId: activePatientId,
        duration: formatTime(elapsedSeconds || 1),
        audioUrl,
        ...analysisResult
      })

      setIsAnalyzing(false)
    }, 1500)
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => clearInterval(timerIntervalRef.current)
  }, [])

  return (
    <div className="recorder-card glass-panel">
      {/* Top Banner Status */}
      <div className="recorder-header">
        <div>
          <p className="eyebrow neon-badge neon-badge-cyan">LIVE VOICE SIGNAL CAPTURE</p>
          <h2 className="recorder-title">
            {isRecording ? 'Listening & Extracting Biomarkers...' : 'Record Voice Sample'}
          </h2>
        </div>
        <span className={`live-pill-badge ${isRecording ? 'pulse' : ''}`}>
          <span className={isRecording ? 'status-dot status-dot-recording' : 'status-dot'} />
          {isRecording ? 'RECORDING ACTIVE' : 'READY TO STREAM'}
        </span>
      </div>

      {activePatient ? (
        <p className="recording-patient-label">Selected patient: <b>{activePatient.firstName} {activePatient.lastName}</b></p>
      ) : (
        <button className="btn-glass recording-patient-prompt" type="button" onClick={() => setActiveTab('Patients')}>Choose or register a patient first</button>
      )}
      {activePatient && !activePatient.audioConsent && <p className="recording-error">Recording is disabled until audio consent is recorded in the patient record.</p>}
      {recordingError && <p className="recording-error" role="alert">{recordingError}</p>}

      {/* Interactive Web Audio Canvas Visualizer */}
      <LiveAudioCanvas isRecording={isRecording} analyserNode={analyserNode} />

      {/* Controls & Timer */}
      <div className="controls-row">
        <div className="timer-display font-mono">
          <Activity size={18} className={isRecording ? 'timer-icon recording' : 'timer-icon'} />
          <span>{formatTime(timerSeconds)}</span>
        </div>

        {/* Big Glow Record Button */}
        {!isRecording ? (
          <button
            className="big-record-btn start animate-pulse-glow"
            onClick={startRecording}
            disabled={isAnalyzing || !canRecord}
            title="Start Microphone Recording"
          >
            <Mic size={28} />
          </button>
        ) : (
          <button
            className="big-record-btn stop animate-pulse-record"
            onClick={stopRecording}
            title="Stop & Process Recording"
          >
            <Square size={26} fill="currentColor" />
          </button>
        )}

        <div className="recorder-hint">
          {isRecording ? 'Tap square to analyze voice' : 'Say a sustained "Ahhh" for 4-5 seconds'}
        </div>
      </div>

      {/* Analyzing Overlay */}
      {isAnalyzing && (
        <div className="analyzing-overlay glass-panel-heavy">
          <div className="spinner-wrap">
            <RefreshCw size={36} className="spinner-icon animate-spin-slow" />
          </div>
          <b className="gradient-text">Neural AI Feature Extraction...</b>
          <p>Extracting Jitter (local), Shimmer (local), HNR (dB), & 12 MFCC vectors.</p>
        </div>
      )}

      <style>{`
        .recorder-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }

        .recorder-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .recording-patient-label, .recording-error { color: var(--text-muted); font-size: .82rem; }
        .recording-patient-label b { color: var(--neon-cyan); }
        .recording-error { color: var(--neon-amber); }
        .recording-patient-prompt { align-self: flex-start; }

        .eyebrow {
          margin-bottom: 6px;
        }

        .recorder-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }

        .live-pill-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
        }

        .live-pill-badge.pulse {
          background: rgba(255, 0, 127, 0.15);
          border-color: var(--neon-magenta);
          color: var(--neon-magenta);
        }

        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .timer-display {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
        }

        .timer-icon {
          color: var(--neon-cyan);
        }

        .timer-icon.recording {
          color: var(--neon-magenta);
        }

        .big-record-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-bounce);
        }

        .big-record-btn.start {
          background: var(--grad-primary);
          color: #000;
          box-shadow: var(--glow-cyan);
        }

        .big-record-btn.start:hover {
          transform: scale(1.1);
          box-shadow: 0 0 35px rgba(0, 242, 254, 0.9);
        }

        .big-record-btn.stop {
          background: var(--grad-vibrant);
          color: #fff;
          box-shadow: var(--glow-magenta);
        }

        .recorder-hint {
          font-size: 0.82rem;
          color: var(--text-muted);
          max-width: 160px;
          text-align: right;
        }

        .analyzing-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(7, 9, 19, 0.9);
          border-radius: 20px;
          text-align: center;
          padding: 20px;
        }

        .spinner-icon {
          color: var(--neon-cyan);
        }

        .analyzing-overlay p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}

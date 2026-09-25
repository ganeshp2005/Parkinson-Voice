import { useRef, useState } from 'react'
import { Check, FileAudio, Play, Sparkles, Upload } from 'lucide-react'
import { useVoiceApp } from '../../context/VoiceAppContext'
import { extractAcousticFeatures } from '../../utils/audioAnalysis'

export default function AudioUploader() {
  const { addSession, setIsAnalyzing, SAMPLE_RECORDINGS } = useVoiceApp()
  const fileInputRef = useRef(null)
  const [uploadedName, setUploadedName] = useState('')

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedName(file.name)
    setIsAnalyzing(true)

    try {
      const analysisResult = await extractAcousticFeatures(file)
      addSession({
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Uploaded Audio File',
        duration: analysisResult.duration,
        audioUrl: URL.createObjectURL(file),
        ...analysisResult
      })
    } catch (err) {
      console.warn('File upload parsing error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="uploader-card glass-panel">
      <div className="uploader-header">
        <div>
          <p className="eyebrow neon-badge neon-badge-purple">AUDIO FILE INGESTION</p>
          <h3 className="uploader-title">Upload Speech File</h3>
        </div>
        <FileAudio className="uploader-icon-glow" size={24} />
      </div>

      <p className="uploader-desc">
        Drag & drop any <b>WAV, MP3, or OGG</b> recording for instant high-dimensional acoustic analysis.
      </p>

      <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
        <div className="upload-icon-circle">
          <Upload size={22} />
        </div>
        <div className="dropzone-text">
          <b>Click to browse audio files</b>
          <small>Supports mono/stereo 44.1kHz / 48kHz audio up to 50MB</small>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          hidden
          onChange={handleFileUpload}
        />
      </div>

      {uploadedName && (
        <div className="uploaded-badge">
          <Check size={14} /> <span><b>{uploadedName}</b> processed successfully!</span>
        </div>
      )}

      <style>{`
        .uploader-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .uploader-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .uploader-title {
          font-size: 1.2rem;
          color: #fff;
          font-weight: 700;
        }

        .uploader-icon-glow {
          color: var(--neon-purple);
          filter: drop-shadow(0 0 8px var(--neon-purple));
        }

        .uploader-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .dropzone {
          border: 2px dashed rgba(157, 78, 221, 0.4);
          background: rgba(157, 78, 221, 0.05);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .dropzone:hover {
          border-color: var(--neon-purple);
          background: rgba(157, 78, 221, 0.12);
          box-shadow: 0 0 20px rgba(157, 78, 221, 0.2);
        }

        .upload-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(157, 78, 221, 0.2);
          color: var(--neon-purple);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dropzone-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dropzone-text b {
          color: #fff;
          font-size: 0.92rem;
        }

        .dropzone-text small {
          color: var(--text-dim);
          font-size: 0.75rem;
        }

        .uploaded-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(0, 245, 212, 0.12);
          border: 1px solid rgba(0, 245, 212, 0.3);
          color: var(--neon-emerald);
          font-size: 0.84rem;
        }
      `}</style>
    </div>
  )
}

import { createContext, useContext, useState } from 'react'
import { SAMPLE_RECORDINGS } from '../data/sampleRecordings'

const VoiceAppContext = createContext(null)

export function VoiceAppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [sessions, setSessions] = useState(SAMPLE_RECORDINGS)
  const [currentSession, setCurrentSession] = useState(SAMPLE_RECORDINGS[0])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [activeMetricModal, setActiveMetricModal] = useState(null)
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Morgan',
    role: 'Personal Voice Workspace',
    avatar: 'AM',
    plan: 'Pro AI Health Tier',
    voiceBaseline: 'Stable (92% Phonation Consistency)'
  })

  // Add new analyzed session
  const addSession = (newSessionData) => {
    const sessionObj = {
      id: `session-${Date.now()}`,
      title: newSessionData.title || `Voice Test ${sessions.length + 1}`,
      category: newSessionData.category || 'Live Mic Recording',
      date: 'Just now',
      duration: newSessionData.duration || '01:30',
      audioUrl: newSessionData.audioUrl || '',
      clarityScore: newSessionData.clarityScore || 85,
      riskLevel: newSessionData.riskLevel || 'Low Risk',
      riskScore: newSessionData.riskScore || 15,
      metrics: newSessionData.metrics,
      mfcc: newSessionData.mfcc,
      analysisSummary: newSessionData.analysisSummary || 'Analyzed via ParkinsonVoice AI Web Pipeline.'
    }

    setSessions((prev) => [sessionObj, ...prev])
    setCurrentSession(sessionObj)
  }

  const value = {
    activeTab,
    setActiveTab,
    sessions,
    setSessions,
    currentSession,
    setCurrentSession,
    isRecording,
    setIsRecording,
    recordingTime,
    setRecordingTime,
    audioBlob,
    setAudioBlob,
    uploadedFileName,
    setUploadedFileName,
    isAnalyzing,
    setIsAnalyzing,
    showDisclaimer,
    setShowDisclaimer,
    activeMetricModal,
    setActiveMetricModal,
    userProfile,
    setUserProfile,
    addSession
  }

  return (
    <VoiceAppContext.Provider value={value}>
      {children}
    </VoiceAppContext.Provider>
  )
}

export function useVoiceApp() {
  const context = useContext(VoiceAppContext)
  if (!context) {
    throw new Error('useVoiceApp must be used within a VoiceAppProvider')
  }
  return context
}

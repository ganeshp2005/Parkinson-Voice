import { createContext, useContext, useEffect, useState } from 'react'
import { SAMPLE_RECORDINGS } from '../data/sampleRecordings'

const VoiceAppContext = createContext(null)

export function VoiceAppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [sessions, setSessions] = useState(SAMPLE_RECORDINGS)
  const [currentSession, setCurrentSession] = useState(null)
  const [patientStore, setPatientStore] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('parkinsonvoice-patients')) || { patients: [], activePatientId: '' }
    } catch {
      return { patients: [], activePatientId: '' }
    }
  })
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

  useEffect(() => {
    try {
      localStorage.setItem('parkinsonvoice-patients', JSON.stringify(patientStore))
    } catch (error) {
      console.warn('Patient records could not be saved in this browser:', error)
    }
  }, [patientStore])

  const addPatient = (patientData) => {
    const patient = { ...patientData, id: `patient-${Date.now()}` }
    setPatientStore((prev) => ({ ...prev, patients: [patient, ...prev.patients], activePatientId: patient.id }))
    setCurrentSession(null)
    return patient
  }

  const updatePatient = (patientId, patientData) => {
    setPatientStore((prev) => ({
      ...prev,
      patients: prev.patients.map((patient) => patient.id === patientId ? { ...patient, ...patientData } : patient)
    }))
  }

  const deletePatient = (patientId) => {
    if (currentSession?.patientId === patientId) setCurrentSession(null)
    setPatientStore((prev) => ({
      patients: prev.patients.filter((patient) => patient.id !== patientId),
      activePatientId: prev.activePatientId === patientId ? '' : prev.activePatientId
    }))
    setSessions((prev) => prev.filter((session) => session.patientId !== patientId))
  }

  const setActivePatientId = (patientId) => {
    setPatientStore((prev) => ({ ...prev, activePatientId: patientId }))
    const patientSession = sessions.find((session) => session.patientId === patientId)
    setCurrentSession(patientSession || null)
  }

  // Add new analyzed session
  const addSession = (newSessionData) => {
    const sessionObj = {
      id: `session-${Date.now()}`,
      title: newSessionData.title || `Voice Test ${sessions.length + 1}`,
      category: newSessionData.category || 'Live Mic Recording',
      date: 'Just now',
      duration: newSessionData.duration || '01:30',
      audioUrl: newSessionData.audioUrl || '',
      patientId: newSessionData.patientId || patientStore.activePatientId,
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
    patients: patientStore.patients,
    activePatientId: patientStore.activePatientId,
    addPatient,
    updatePatient,
    deletePatient,
    setActivePatientId,
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

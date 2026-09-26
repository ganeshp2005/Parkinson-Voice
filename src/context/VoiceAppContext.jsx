import { createContext, useContext, useEffect, useState } from 'react'
import {
  authenticateDemoAccount,
  clearDemoSession,
  createDemoAccount,
  getDemoSession,
  loadDemoWorkspace,
  saveDemoWorkspace,
  setDemoSession
} from '../utils/demoAuth'

const VoiceAppContext = createContext(null)

export function VoiceAppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [authUser, setAuthUser] = useState(() => getDemoSession())
  const [workspace, setWorkspace] = useState(() => loadDemoWorkspace(getDemoSession()?.id))
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [activeMetricModal, setActiveMetricModal] = useState(null)
  const [userProfile, setUserProfile] = useState(() => ({
    name: authUser?.name || 'Demo workspace',
    role: 'Local demo account',
    avatar: authUser?.name?.split(/\s+/).map((part) => part[0]).join('').toUpperCase() || 'DM',
    plan: 'Local demo',
    voiceBaseline: 'No baseline recorded'
  }))

  useEffect(() => {
    try {
      if (authUser) saveDemoWorkspace(authUser.id, workspace)
    } catch (error) {
      console.warn('Demo workspace could not be saved in this browser:', error)
    }
  }, [authUser, workspace])

  const beginDemoSession = (account) => {
    setDemoSession(account)
    setAuthUser(account)
    setWorkspace(loadDemoWorkspace(account.id))
    setUserProfile({
      name: account.name,
      role: 'Local demo account',
      avatar: account.name.split(/\s+/).map((part) => part[0]).join('').toUpperCase(),
      plan: 'Local demo',
      voiceBaseline: 'No baseline recorded'
    })
    setActiveTab('Overview')
  }

  const signIn = async (credentials) => beginDemoSession(await authenticateDemoAccount(credentials))
  const signUp = async (details) => beginDemoSession(await createDemoAccount(details))
  const signOut = () => {
    clearDemoSession()
    setAuthUser(null)
    setWorkspace(loadDemoWorkspace(''))
    setUserProfile({ name: 'Demo workspace', role: 'Local demo account', avatar: 'DM', plan: 'Local demo', voiceBaseline: 'No baseline recorded' })
    setActiveTab('Overview')
  }

  const sessions = workspace.sessions
  const currentSession = sessions.find((session) => session.id === workspace.currentSessionId) || null

  const setSessions = (update) => {
    setWorkspace((prev) => ({
      ...prev,
      sessions: typeof update === 'function' ? update(prev.sessions) : update
    }))
  }

  const setCurrentSession = (session) => {
    setWorkspace((prev) => {
      const nextSession = typeof session === 'function' ? session(prev.sessions.find((entry) => entry.id === prev.currentSessionId) || null) : session
      return { ...prev, currentSessionId: nextSession?.id || '' }
    })
  }

  const addPatient = (patientData) => {
    const patient = { ...patientData, id: `patient-${Date.now()}` }
    setWorkspace((prev) => ({ ...prev, patients: [patient, ...prev.patients], activePatientId: patient.id, currentSessionId: '' }))
    return patient
  }

  const updatePatient = (patientId, patientData) => {
    setWorkspace((prev) => ({
      ...prev,
      patients: prev.patients.map((patient) => patient.id === patientId ? { ...patient, ...patientData } : patient)
    }))
  }

  const deletePatient = (patientId) => {
    setWorkspace((prev) => ({
      patients: prev.patients.filter((patient) => patient.id !== patientId),
      activePatientId: prev.activePatientId === patientId ? '' : prev.activePatientId,
      sessions: prev.sessions.filter((session) => session.patientId !== patientId),
      currentSessionId: prev.sessions.find((session) => session.id === prev.currentSessionId)?.patientId === patientId ? '' : prev.currentSessionId
    }))
  }

  const setActivePatientId = (patientId) => {
    setWorkspace((prev) => {
      const patientSession = prev.sessions.find((session) => session.patientId === patientId)
      return { ...prev, activePatientId: patientId, currentSessionId: patientSession?.id || '' }
    })
  }

  // Add new analyzed session
  const addSession = (newSessionData) => {
    const sessionObj = {
      id: `session-${Date.now()}`,
      title: newSessionData.title || `Voice Test ${sessions.length + 1}`,
      category: newSessionData.category || 'Live Mic Recording',
      date: new Date().toLocaleString(),
      duration: newSessionData.duration || '01:30',
      audioUrl: newSessionData.audioUrl || '',
      hasAudio: Boolean(newSessionData.hasAudio || newSessionData.audioUrl),
      patientId: newSessionData.patientId || workspace.activePatientId,
      clarityScore: newSessionData.clarityScore || 85,
      riskLevel: newSessionData.riskLevel || 'Low Risk',
      riskScore: newSessionData.riskScore || 15,
      metrics: newSessionData.metrics,
      mfcc: newSessionData.mfcc,
      analysisSummary: newSessionData.analysisSummary || 'Experimental acoustic estimates generated for demonstration. Not a clinical result.'
    }

    setWorkspace((prev) => ({
      ...prev,
      sessions: [sessionObj, ...prev.sessions],
      currentSessionId: sessionObj.id
    }))
    return sessionObj
  }

  const value = {
    authUser,
    accountId: authUser?.id || '',
    signIn,
    signUp,
    signOut,
    activeTab,
    setActiveTab,
    sessions,
    setSessions,
    currentSession,
    setCurrentSession,
    patients: workspace.patients,
    activePatientId: workspace.activePatientId,
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

import { useState } from 'react'
import { ClipboardPlus, Pencil, Trash2, UserRound, UsersRound } from 'lucide-react'
import { useVoiceApp } from '../../context/VoiceAppContext'

const emptyPatient = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  diagnosis: '',
  diagnosisDate: '',
  symptomOnset: '',
  allergies: '',
  medicalHistory: '',
  medications: '',
  clinician: '',
  notes: '',
  audioConsent: false
}

export default function PatientsTab() {
  const {
    patients,
    activePatientId,
    addPatient,
    updatePatient,
    deletePatient,
    setActivePatientId,
    sessions
  } = useVoiceApp()
  const selectedPatient = patients.find((patient) => patient.id === activePatientId)
  const [form, setForm] = useState(emptyPatient)
  const [editingId, setEditingId] = useState('')

  const changeField = (event) => {
    const { name, value, checked, type } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const resetForm = () => {
    setForm(emptyPatient)
    setEditingId('')
  }

  const savePatient = (event) => {
    event.preventDefault()
    if (editingId) {
      updatePatient(editingId, form)
    } else {
      addPatient(form)
    }
    resetForm()
  }

  const editPatient = (patient) => {
    setForm({ ...emptyPatient, ...patient })
    setEditingId(patient.id)
    setActivePatientId(patient.id)
  }

  const field = (label, name, type = 'text', required = false) => (
    <label className="patient-field" key={name}>
      <span>{label}{required ? ' *' : ''}</span>
      <input name={name} type={type} value={form[name]} onChange={changeField} required={required} />
    </label>
  )

  return (
    <div className="patients-page animate-fade-in">
      <header className="patients-heading">
        <div>
          <p className="eyebrow neon-badge neon-badge-cyan">PATIENT WORKSPACE</p>
          <h1>Patient Records</h1>
          <p>Register a patient, select their record, and link new voice samples to them.</p>
        </div>
        <div className="patient-count"><UsersRound size={18} /> {patients.length} records</div>
      </header>

      <aside className="patient-privacy-note">
        This prototype saves patient details in this browser only. It has no secure server, access controls, or clinical-record safeguards. Do not enter real patient-identifiable or health information.
      </aside>

      <div className="patient-layout">
        <form className="patient-form glass-panel" onSubmit={savePatient}>
          <div className="patient-section-heading">
            <ClipboardPlus size={20} />
            <div><h2>{editingId ? 'Edit patient' : 'Register patient'}</h2><p>Fields marked * are required.</p></div>
          </div>

          <div className="patient-form-grid">
            {field('First name', 'firstName', 'text', true)}
            {field('Last name', 'lastName', 'text', true)}
            {field('Date of birth', 'dateOfBirth', 'date', true)}
            <label className="patient-field"><span>Gender</span><select name="gender" value={form.gender} onChange={changeField}><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
            {field('Phone', 'phone', 'tel')}
            {field('Email', 'email', 'email')}
            <label className="patient-field patient-field-wide"><span>Address</span><input name="address" value={form.address} onChange={changeField} /></label>
            {field('Emergency contact name', 'emergencyContact')}
            {field('Emergency contact phone', 'emergencyPhone', 'tel')}
            <label className="patient-field"><span>Diagnosis / status</span><select name="diagnosis" value={form.diagnosis} onChange={changeField}><option value="">Select</option><option>Not provided</option><option>Parkinson's disease</option><option>Under evaluation</option><option>Other</option></select></label>
            {field('Diagnosis date', 'diagnosisDate', 'date')}
            {field('Symptom onset (if known)', 'symptomOnset', 'date')}
            {field('Clinician / care team', 'clinician')}
            <label className="patient-field patient-field-wide"><span>Allergies</span><textarea name="allergies" rows="2" value={form.allergies} onChange={changeField} /></label>
            <label className="patient-field patient-field-wide"><span>Relevant medical history</span><textarea name="medicalHistory" rows="3" value={form.medicalHistory} onChange={changeField} /></label>
            <label className="patient-field patient-field-wide"><span>Medications</span><textarea name="medications" rows="2" value={form.medications} onChange={changeField} /></label>
            <label className="patient-field patient-field-wide"><span>Notes</span><textarea name="notes" rows="3" value={form.notes} onChange={changeField} /></label>
          </div>

          <label className="patient-consent"><input name="audioConsent" type="checkbox" checked={form.audioConsent} onChange={changeField} required /> Patient has consented to voice recording and audio analysis.</label>
          <div className="patient-form-actions">
            <button type="submit" className="btn-cyber-primary">{editingId ? 'Save changes' : 'Register patient'}</button>
            {editingId && <button type="button" className="btn-glass" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <section className="patient-list glass-panel">
          <div className="patient-section-heading"><UserRound size={20} /><div><h2>Patient list</h2><p>Select a patient before recording or uploading audio.</p></div></div>
          {patients.length === 0 ? <p className="patient-empty">No patients registered yet.</p> : (
            <div className="patient-list-items">
              {patients.map((patient) => (
                <article key={patient.id} className={`patient-list-item ${activePatientId === patient.id ? 'is-selected' : ''}`}>
                  <button type="button" className="patient-select" onClick={() => setActivePatientId(patient.id)}>
                    <span className="patient-avatar">{patient.firstName[0]}{patient.lastName[0]}</span>
                    <span className="patient-name-block"><b>{patient.firstName} {patient.lastName}</b><small>{patient.diagnosis || 'Diagnosis not provided'} · {sessions.filter((session) => session.patientId === patient.id).length} sessions</small></span>
                    {activePatientId === patient.id && <span className="selected-label">ACTIVE</span>}
                  </button>
                  <div className="patient-row-actions">
                    <button type="button" title="Edit patient" onClick={() => editPatient(patient)}><Pencil size={15} /></button>
                    <button type="button" title="Delete patient" onClick={() => { if (window.confirm(`Delete ${patient.firstName} ${patient.lastName} and their linked sessions?`)) deletePatient(patient.id) }}><Trash2 size={15} /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {selectedPatient && <div className="active-patient-summary"><b>Selected patient</b><span>{selectedPatient.firstName} {selectedPatient.lastName}</span><small>{selectedPatient.phone || 'No phone'} · {selectedPatient.email || 'No email'}</small></div>}
        </section>
      </div>

      <style>{`
        .patients-page { display: flex; flex-direction: column; gap: 20px; }
        .patients-heading { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .patients-heading h1 { color: #fff; font-size: 1.8rem; margin: 8px 0 4px; }
        .patients-heading p:not(.eyebrow) { color: var(--text-muted); font-size: .9rem; }
        .patient-count { display: flex; align-items: center; gap: 8px; color: var(--neon-cyan); font-weight: 700; }
        .patient-privacy-note { padding: 13px 16px; border-left: 3px solid var(--neon-amber); background: rgba(255,183,3,.08); color: #f3d68b; font-size: .85rem; line-height: 1.5; }
        .patient-layout { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(300px, .85fr); align-items: start; gap: 18px; }
        .patient-form, .patient-list { padding: 22px; }
        .patient-section-heading { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: var(--neon-cyan); }
        .patient-section-heading h2 { color: #fff; font-size: 1.1rem; }
        .patient-section-heading p { color: var(--text-muted); font-size: .78rem; margin-top: 3px; }
        .patient-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .patient-field { display: flex; flex-direction: column; gap: 6px; color: var(--text-muted); font-size: .8rem; font-weight: 600; }
        .patient-field-wide { grid-column: 1 / -1; }
        .patient-field input, .patient-field select, .patient-field textarea { width: 100%; min-width: 0; border: 1px solid rgba(255,255,255,.14); border-radius: 7px; background: rgba(5,8,18,.72); color: #fff; padding: 10px 11px; font: inherit; }
        .patient-field select option { background: #101525; }
        .patient-field textarea { resize: vertical; }
        .patient-consent { display: flex; gap: 10px; align-items: flex-start; color: var(--text-muted); font-size: .82rem; margin-top: 18px; line-height: 1.45; }
        .patient-consent input { accent-color: var(--neon-cyan); margin-top: 3px; }
        .patient-form-actions { display: flex; align-items: center; gap: 10px; margin-top: 18px; }
        .patient-form-actions .btn-cyber-primary, .patient-form-actions .btn-glass { min-height: 42px; }
        .patient-empty { color: var(--text-muted); font-size: .88rem; padding: 18px 0; }
        .patient-list-items { display: flex; flex-direction: column; gap: 8px; }
        .patient-list-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; }
        .patient-list-item.is-selected { border-color: var(--neon-cyan); background: rgba(0,242,254,.07); }
        .patient-select { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; border: 0; padding: 0; background: none; color: inherit; text-align: left; cursor: pointer; }
        .patient-avatar { display: grid; place-items: center; flex: 0 0 36px; height: 36px; border-radius: 50%; background: rgba(0,242,254,.12); color: var(--neon-cyan); font-weight: 800; font-size: .75rem; }
        .patient-name-block { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .patient-name-block b { color: #fff; font-size: .84rem; }
        .patient-name-block small, .active-patient-summary small { color: var(--text-muted); font-size: .72rem; overflow-wrap: anywhere; }
        .selected-label { color: var(--neon-cyan); font-size: .65rem; font-weight: 800; }
        .patient-row-actions { display: flex; gap: 4px; }
        .patient-row-actions button { display: grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 6px; color: var(--text-muted); background: transparent; cursor: pointer; }
        .patient-row-actions button:hover { color: #fff; background: rgba(255,255,255,.1); }
        .active-patient-summary { display: flex; flex-direction: column; gap: 5px; border-top: 1px solid rgba(255,255,255,.1); margin-top: 16px; padding-top: 14px; font-size: .82rem; color: #fff; }
        @media (max-width: 900px) { .patient-layout { grid-template-columns: 1fr; } }
        @media (max-width: 520px) { .patients-heading { align-items: flex-start; flex-direction: column; } .patient-form-grid { grid-template-columns: 1fr; } .patient-field-wide { grid-column: auto; } .patient-form, .patient-list { padding: 16px; } }
      `}</style>
    </div>
  )
}
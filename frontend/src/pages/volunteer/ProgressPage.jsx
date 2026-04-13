import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { Card, Avatar, Badge, ProgressBar, Button, Modal, Input, Select, Textarea, Spinner, EmptyState } from '../../components/ui/index.jsx';
import { studentAPI, assessmentAPI } from '../../utils/api.js';

const SUBJECT_COLORS = { Math: '#285A48', Science: '#408A71', English: '#408A71', Hindi: '#B0E4CC' };

const SUBJECT_OPTIONS = [
  { value: 'Math',    label: 'Math'    },
  { value: 'Science', label: 'Science' },
  { value: 'English', label: 'English' },
  { value: 'Hindi',   label: 'Hindi'   },
];

export default function ProgressPage({ role }) {
  const [students,    setStudents]    = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedId,  setSelectedId]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [loadingAsmt, setLoadingAsmt] = useState(false);
  const [addOpen,     setAddOpen]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [apiError,    setApiError]    = useState('');
  const [form, setForm] = useState({ period: '', remarks: '', Math: '', Science: '', English: '', Hindi: '' });

  // Load students
  useEffect(() => {
    studentAPI.getAll()
      .then(({ data }) => {
        const studs = data.data || [];
        setStudents(studs);
        if (studs.length > 0) setSelectedId(studs[0]._id);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Load assessments when selected student changes
  const fetchAssessments = useCallback(async (studentId) => {
    if (!studentId) return;
    setLoadingAsmt(true);
    try {
      const { data } = await assessmentAPI.getByStudent(studentId);
      setAssessments((data.data || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (err) {
      console.error('Fetch assessments error:', err);
      setAssessments([]);
    } finally {
      setLoadingAsmt(false);
    }
  }, []);

  useEffect(() => { fetchAssessments(selectedId); }, [selectedId, fetchAssessments]);

  const selected = students.find(s => s._id === selectedId);
  const latest   = assessments[assessments.length - 1];

  const trendData = assessments.map(a => ({
    period: a.period?.replace(' 2024','').replace(' 2025','') || '',
    overall: a.overallScore,
    ...Object.fromEntries((a.subjects || []).map(s => [s.name, s.score])),
  }));

  const radarData = latest?.subjects?.map(s => ({ subject: s.name, score: s.score, fullMark: 100 })) || [];
  const barData   = latest?.subjects?.map(s => ({ subject: s.name, score: s.score })) || [];

  const handleAddAssessment = async () => {
    if (!form.period) { setApiError('Period is required.'); return; }
    setSaving(true);
    setApiError('');
    try {
      const subjects = SUBJECT_OPTIONS.map(s => ({
        name: s.value, score: parseInt(form[s.value]) || 0,
      }));
      await assessmentAPI.create({ student: selectedId, period: form.period, subjects, remarks: form.remarks });
      setAddOpen(false);
      setForm({ period: '', remarks: '', Math: '', Science: '', English: '', Hindi: '' });
      await fetchAssessments(selectedId);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to add assessment.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Student selector */}
      {role !== 'student' && (
        <Card title="Select Student" subtitle="View individual progress">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {students.map(s => {
              const isSelected = s._id === selectedId;
              return (
                <button key={s._id} onClick={() => setSelectedId(s._id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', background: isSelected ? '#E8F4F8' : '#F8FAFC', border: isSelected ? '1px solid #B0E4CC' : '1px solid #E2E8F0', color: isSelected ? '#285A48' : '#64748B', fontWeight: isSelected ? 600 : 400 }}>
                  <Avatar name={s.user?.name || 'Unknown'} size="sm" color={isSelected ? '#285A48' : '#408A71'} />
                  {s.user?.name || 'Unknown'}
                </button>
              );
            })}
            {students.length === 0 && <p style={{ fontSize: 13, color: '#94A3B8' }}>No students assigned.</p>}
          </div>
        </Card>
      )}

      {loadingAsmt ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, gap: 12 }}>
          <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading assessments...</span>
        </div>
      ) : !selected ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
          <EmptyState icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} title="No student selected" description="Select a student above to view their progress." />
        </div>
      ) : (
        <>
          {/* Student overview */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              <Avatar name={selected.user?.name} size="lg" />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>{selected.user?.name}</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>{selected.grade} · {selected.school}</p>
              </div>
              {latest ? (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#285A48', lineHeight: 1 }}>{latest.overallScore}%</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Latest Overall</div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#94A3B8' }}>No assessments yet</div>
              )}
            </div>
            {latest?.subjects && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {latest.subjects.map(s => (
                  <div key={s.name} style={{ background: '#F8FAFC', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 4px' }}>{s.name}</p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>{s.score}%</p>
                    <ProgressBar value={s.score} height={4} color={SUBJECT_COLORS[s.name] || '#285A48'} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {assessments.length === 0 ? (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
              <EmptyState
                icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                title="No assessments yet"
                description="Add the first assessment for this student."
                action={role !== 'student' ? <Button onClick={() => setAddOpen(true)}>Add Assessment</Button> : null}
              />
            </div>
          ) : (
            <>
              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Card title="Progress Over Time" subtitle="Score trend">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      {SUBJECT_OPTIONS.map(s => (
                        <Line key={s.value} type="monotone" dataKey={s.value} stroke={SUBJECT_COLORS[s.value]} strokeWidth={2} dot={{ r: 3 }} />
                      ))}
                      <Line type="monotone" dataKey="overall" name="Overall" stroke="#0F172A" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card title="Subject Radar" subtitle={latest?.period || ''}>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#F1F5F9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Radar dataKey="score" stroke="#285A48" fill="#285A48" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Horizontal bar */}
              {barData.length > 0 && (
                <Card title="Subject Performance" subtitle={latest?.period || ''}>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={barData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                      <XAxis type="number" domain={[0,100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="subject" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={60} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                      <Bar dataKey="score" fill="#285A48" radius={[0,4,4,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Assessment table */}
              <Card title="Assessment History" subtitle="All periods"
                action={role !== 'student' ? <Button size="sm" onClick={() => setAddOpen(true)}
                  icon={<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
                  Add Assessment
                </Button> : null}
                padding="0">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        {['Period', ...(latest?.subjects?.map(s => s.name) || []), 'Overall', 'Change'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((a, i) => {
                        const prev   = assessments[i - 1];
                        const change = prev ? a.overallScore - prev.overallScore : null;
                        return (
                          <tr key={a._id} style={{ borderBottom: i < assessments.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                            <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{a.period}</td>
                            {(a.subjects || []).map(s => <td key={s.name} style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.score}%</td>)}
                            <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 14, fontWeight: 700, color: '#285A48' }}>{a.overallScore}%</span></td>
                            <td style={{ padding: '12px 16px' }}>
                              {change !== null ? (
                                <span style={{ fontSize: 12, fontWeight: 600, color: change >= 0 ? '#22C55E' : '#EF4444' }}>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</span>
                              ) : <span style={{ fontSize: 12, color: '#94A3B8' }}>—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </>
      )}

      {/* Add Assessment Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Assessment"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleAddAssessment} disabled={saving}>{saving ? 'Saving...' : 'Save Assessment'}</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apiError && <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 13, border: '1px solid #FECACA' }}>{apiError}</div>}
          <Input label="Period (e.g. Q1 2025)" required placeholder="Q1 2025" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
          <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: 0 }}>Subject Scores (0–100)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {SUBJECT_OPTIONS.map(s => (
              <Input key={s.value} label={s.label} type="number" placeholder="0–100"
                value={form[s.value]} onChange={e => setForm({ ...form, [s.value]: e.target.value })} />
            ))}
          </div>
          <Textarea label="Remarks" placeholder="Notes about this assessment..." value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} rows={2} />
        </div>
      </Modal>
    </div>
  );
}
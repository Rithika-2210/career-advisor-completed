/**
 * ProfilePage
 * Edit academic details, interests, location
 */
// updategit add ProfilePage.js
import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/services';
import toast from 'react-hot-toast';
import { PageHeader } from '../components/common/Spinner';
import { User, MapPin, GraduationCap, Heart, X, Plus } from 'lucide-react';

const INTERESTS = ['Technology', 'Engineering', 'Medicine', 'Biology', 'Business', 'Finance', 'Economics', 'Entrepreneurship', 'Arts', 'Design', 'Journalism', 'Literature', 'Psychology', 'Politics', 'Social Work', 'Mathematics', 'Physics', 'Chemistry', 'Accounting', 'Management', 'Banking', 'Music', 'History', 'Philosophy', 'Science', 'Research'];

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

export default function ProfilePage() {
  const { user, updateUserState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '',
    careerGoals: user?.careerGoals || '',
    location: { state: user?.location?.state || '', city: user?.location?.city || '', pincode: user?.location?.pincode || '' },
    academicDetails: {
      tenthMarks: user?.academicDetails?.tenthMarks || '',
      tenthBoard: user?.academicDetails?.tenthBoard || '',
      twelfthMarks: user?.academicDetails?.twelfthMarks || '',
      twelfthBoard: user?.academicDetails?.twelfthBoard || '',
      twelfthStream: user?.academicDetails?.twelfthStream || '',
      currentEducation: user?.academicDetails?.currentEducation || '',
      institution: user?.academicDetails?.institution || '',
    },
    interests: user?.interests || [],
    skills: user?.skills || [],
  });
  const [skillInput, setSkillInput] = useState('');

  const setField = (path, value) => {
    setForm(prev => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: value };
      if (parts.length === 2) return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } };
      return prev;
    });
  };

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 10 ? [...prev.interests, interest] : prev.interests
    }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !form.skills.includes(skillInput.trim()) && form.skills.length < 20) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUserState(data.user);
      toast.success('Profile updated successfully!');
    } catch {
      // interceptor handles
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'interests', label: 'Interests & Skills', icon: Heart },
    { id: 'location', label: 'Location', icon: MapPin },
  ];

  const inputStyle = { padding: '0.7rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', width: '100%' };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <PageHeader title="Profile Settings" subtitle="Keep your academic and personal details up to date for better recommendations." />

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'var(--surface-1)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflowX: 'auto' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.55rem 1rem', borderRadius: 'var(--radius-sm)',
                background: activeTab === id ? 'var(--surface-3)' : 'transparent',
                color: activeTab === id ? 'var(--teal-400)' : 'var(--text-muted)',
                border: activeTab === id ? '1px solid var(--border-hover)' : '1px solid transparent',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>

          <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Personal Information</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input style={inputStyle} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input style={inputStyle} value={form.mobile} onChange={e => setField('mobile', e.target.value)} placeholder="10-digit mobile" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select style={inputStyle} value={form.gender} onChange={e => setField('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input style={{ ...inputStyle, opacity: 0.6 }} value={user?.email} disabled />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Career Goals</label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.careerGoals} onChange={e => setField('careerGoals', e.target.value)} placeholder="Describe your career aspirations..." />
                </div>
              </div>
            )}

            {/* Academic Tab */}
            {activeTab === 'academic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Academic Details</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">10th Marks (%)</label>
                    <input type="number" style={inputStyle} min="0" max="100" value={form.academicDetails.tenthMarks} onChange={e => setField('academicDetails.tenthMarks', e.target.value)} placeholder="e.g., 85" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">10th Board</label>
                    <select style={inputStyle} value={form.academicDetails.tenthBoard} onChange={e => setField('academicDetails.tenthBoard', e.target.value)}>
                      <option value="">Select board</option>
                      <option>CBSE</option><option>ICSE</option><option>State Board</option><option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">12th Marks (%)</label>
                    <input type="number" style={inputStyle} min="0" max="100" value={form.academicDetails.twelfthMarks} onChange={e => setField('academicDetails.twelfthMarks', e.target.value)} placeholder="e.g., 78" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">12th Stream</label>
                    <select style={inputStyle} value={form.academicDetails.twelfthStream} onChange={e => setField('academicDetails.twelfthStream', e.target.value)}>
                      <option value="">Select stream</option>
                      <option>Science</option><option>Commerce</option><option>Arts</option><option>Not Applicable</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Education Level</label>
                    <select style={inputStyle} value={form.academicDetails.currentEducation} onChange={e => setField('academicDetails.currentEducation', e.target.value)}>
                      <option value="">Select level</option>
                      <option>10th Studying</option><option>10th Completed</option>
                      <option>12th Studying</option><option>12th Completed</option>
                      <option>UG 1st Year</option><option>UG 2nd Year</option><option>UG 3rd Year</option><option>UG Completed</option>
                      <option>PG Studying</option><option>PG Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution Name</label>
                    <input style={inputStyle} value={form.academicDetails.institution} onChange={e => setField('academicDetails.institution', e.target.value)} placeholder="Your college/school name" />
                  </div>
                </div>
              </div>
            )}

            {/* Interests Tab */}
            {activeTab === 'interests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.35rem' }}>Interests</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Select up to 10 interests (selected: {form.interests.length}/10)</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {INTERESTS.map(interest => (
                      <button key={interest} onClick={() => toggleInterest(interest)} style={{
                        padding: '0.4rem 0.9rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 500,
                        cursor: 'pointer', transition: 'var(--transition)',
                        background: form.interests.includes(interest) ? 'rgba(14, 165, 233, 0.15)' : 'var(--surface-2)',
                        color: form.interests.includes(interest) ? 'var(--teal-300)' : 'var(--text-muted)',
                        border: `1px solid ${form.interests.includes(interest) ? 'rgba(14, 165, 233, 0.4)' : 'var(--border)'}`,
                      }}>
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.35rem' }}>Skills</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Add your skills (e.g., Python, Communication, Drawing)</p>
                  <form onSubmit={addSkill} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input style={{ ...inputStyle, flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Type a skill and press Enter..." />
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Plus size={15} />
                    </button>
                  </form>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {form.skills.map(skill => (
                      <span key={skill} className="badge badge-teal" style={{ gap: '0.4rem', paddingRight: '0.5rem' }}>
                        {skill}
                        <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', padding: 0 }}>
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Location Details</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Used to show nearby colleges and location-specific guidance.</p>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select style={inputStyle} value={form.location.state} onChange={e => setField('location.state', e.target.value)}>
                      <option value="">Select state</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input style={inputStyle} value={form.location.city} onChange={e => setField('location.city', e.target.value)} placeholder="Your city" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input style={inputStyle} value={form.location.pincode} onChange={e => setField('location.pincode', e.target.value)} placeholder="6-digit pincode" />
                  </div>
                </div>
              </div>
            )}

            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

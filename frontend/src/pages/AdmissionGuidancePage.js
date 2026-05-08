/**
 * AdmissionGuidancePage
 * Standalone page covering:
 *  - Stream-wise admission process (Science / Commerce / Arts)
 *  - Step-by-step guidance per stream
 *  - Entrance exam calendar
 *  - Document checklist (downloadable)
 *  - Deadline reminders
 *  - Important links
 */

import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import {
  BookOpen, ClipboardList, Calendar, Link as LinkIcon,
  CheckCircle, ChevronDown, ChevronUp, AlertCircle,
  FileText, Clock, ExternalLink, Bell, Download,
  GraduationCap, Stethoscope, Scale, Briefcase, Palette,
  ArrowRight, Info
} from 'lucide-react';

// ── Data ────────────────────────────────────────────────────

const STREAMS = [
  {
    id: 'science',
    label: 'Science',
    icon: GraduationCap,
    color: 'teal',
    hex: '#0ea5e9',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.25)',
    tagline: 'Engineering, Medicine, Research, Architecture',
    steps: [
      {
        num: '01', title: 'Choose Your Track',
        desc: 'Decide between PCM (Physics, Chemistry, Maths) for Engineering/Architecture, or PCB (Physics, Chemistry, Biology) for Medical. PCM+B is possible for both.',
      },
      {
        num: '02', title: 'Appear for Board Exams',
        desc: 'Score well in 12th boards (CBSE/ICSE/State). Most engineering colleges require 60%+; medical colleges require 50–60%+ in PCB. Boards also serve as eligibility for state counsellings.',
      },
      {
        num: '03', title: 'Register for Entrance Exams',
        desc: 'JEE Main for NITs/IIITs (Jan & Apr sessions). JEE Advanced for IITs (after JEE Main). NEET UG for MBBS/BDS/BAMS. TNEA for Tamil Nadu engineering colleges (no exam — marks-based).',
      },
      {
        num: '04', title: 'Appear for Exams & Get Results',
        desc: 'JEE Main results release in Feb & May. NEET results release in June. TNEA rank list releases in June–July based on 12th marks.',
      },
      {
        num: '05', title: 'Register for Counselling',
        desc: 'JoSAA counselling (July–Aug) for IITs/NITs. State NEET counselling (July–Sept) for medical. TNEA online counselling (July–Aug) for TN engineering.',
      },
      {
        num: '06', title: 'Seat Allotment & Reporting',
        desc: 'Accept allotted seat online, pay admission fee, and physically report to college with original documents by the deadline.',
      },
    ],
    exams: [
      { name: 'JEE Main', conducting: 'NTA', when: 'Jan & Apr', for: 'B.Tech at NITs, IIITs, GFTIs', url: 'https://jeemain.nta.nic.in' },
      { name: 'JEE Advanced', conducting: 'IIT (rotating)', when: 'May–Jun', for: 'B.Tech at IITs', url: 'https://jeeadv.ac.in' },
      { name: 'NEET UG', conducting: 'NTA', when: 'May', for: 'MBBS, BDS, BAMS, BHMS', url: 'https://neet.nta.nic.in' },
      { name: 'TNEA', conducting: 'Anna University', when: 'Jun–Aug', for: 'B.E./B.Tech in Tamil Nadu', url: 'https://www.tneaonline.org' },
      { name: 'BITSAT', conducting: 'BITS Pilani', when: 'May–Jun', for: 'B.Tech at BITS campuses', url: 'https://www.bitsadmission.com' },
      { name: 'NATA', conducting: 'CoA', when: 'Apr–Jun', for: 'B.Arch admissions', url: 'https://www.nata.in' },
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    icon: Briefcase,
    color: 'amber',
    hex: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    tagline: 'Business, Accounting, Finance, Economics, Management',
    steps: [
      {
        num: '01', title: 'Choose Your Specialisation',
        desc: 'Decide between B.Com (Accounting/Finance), BBA/BBM (Management), CA/CMA (Professional), or Economics. Mathematics in 12th opens additional options.',
      },
      {
        num: '02', title: 'Score in 12th Boards',
        desc: 'Most colleges require 50–70%+ in 12th Commerce. For CA Foundation, you need 50% in 12th. Premium BBA programs require 70–85%+.',
      },
      {
        num: '03', title: 'Entrance Exams (if applicable)',
        desc: 'IPMAT for IIM Integrated programs. SET/NPAT for Symbiosis/NMIMS. CUET for central university colleges. CA Foundation (ICAI) for Chartered Accountancy.',
      },
      {
        num: '04', title: 'Apply to Colleges',
        desc: 'Most commerce colleges admit on merit (12th marks). Apply online through DU portal, state common admission portals, or individual college websites.',
      },
      {
        num: '05', title: 'Counselling / Merit List',
        desc: 'DU (Delhi) uses CUET score. Most state universities release merit lists. Private colleges do their own counselling rounds.',
      },
      {
        num: '06', title: 'Document Verification & Joining',
        desc: 'Attend document verification, pay fees, and complete admission formalities at the allotted college before the deadline.',
      },
    ],
    exams: [
      { name: 'CUET UG', conducting: 'NTA', when: 'May–Jun', for: 'Central university admissions (DU, JNU etc.)', url: 'https://cuet.samarth.ac.in' },
      { name: 'IPMAT', conducting: 'IIM Indore/Rohtak', when: 'May', for: 'Integrated BBA+MBA at IIMs', url: 'https://ipmat.iimi.ac.in' },
      { name: 'SET (Symbiosis)', conducting: 'Symbiosis Int. Univ.', when: 'May', for: 'BBA, B.Com, B.Econ', url: 'https://www.set-test.org' },
      { name: 'NPAT', conducting: 'NMIMS', when: 'Jan–May', for: 'BBA, B.Com, B.Sc programs', url: 'https://npat.nmims.edu' },
      { name: 'CA Foundation', conducting: 'ICAI', when: 'Nov (after 12th result)', for: 'Chartered Accountancy program', url: 'https://icai.org' },
      { name: 'TANCET MBA', conducting: 'Anna University', when: 'Mar', for: 'MBA in Tamil Nadu colleges', url: 'https://www.annauniv.edu/TANCET' },
    ],
  },
  {
    id: 'arts',
    label: 'Arts & Humanities',
    icon: Palette,
    color: 'purple',
    hex: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.25)',
    tagline: 'Literature, Design, Journalism, Psychology, Law, Social Sciences',
    steps: [
      {
        num: '01', title: 'Identify Your Field',
        desc: 'Arts covers BA (English, History, Economics, Psychology, Political Science), B.Design, BJMC (Journalism), BFA (Fine Arts), LLB (Law), and Social Work.',
      },
      {
        num: '02', title: 'Complete 12th in Any Stream',
        desc: 'Most arts programs accept students from any stream (Science/Commerce/Arts). BA, LLB, and design programs are open to all. Some colleges prefer Arts background for humanities.',
      },
      {
        num: '03', title: 'Entrance Exams (Stream-Specific)',
        desc: 'CLAT for National Law Universities. NID DAT for product/graphic design. NIFT entrance for fashion. IIMC for journalism. Many BA programs are merit-based (no exam).',
      },
      {
        num: '04', title: 'Apply to Colleges',
        desc: 'Apply through DU, CUET, state university portals, or directly to private colleges. Portfolio required for design colleges. Statement of Purpose for some programs.',
      },
      {
        num: '05', title: 'Counselling & Seat Selection',
        desc: 'CLAT counselling for NLUs (June–July). NID/NIFT conduct separate counselling. State arts colleges use merit-based allocation through state portals.',
      },
      {
        num: '06', title: 'Join College',
        desc: 'Confirm admission by paying fees and submitting documents within the deadline. Attend orientation and complete enrollment formalities.',
      },
    ],
    exams: [
      { name: 'CLAT', conducting: 'Consortium of NLUs', when: 'Dec', for: 'BA LLB / BBA LLB at National Law Universities', url: 'https://consortiumofnlus.ac.in' },
      { name: 'CUET UG', conducting: 'NTA', when: 'May–Jun', for: 'BA, B.Com, BCA at central universities', url: 'https://cuet.samarth.ac.in' },
      { name: 'NID DAT', conducting: 'NID Ahmedabad', when: 'Jan', for: 'B.Des at National Institute of Design', url: 'https://admissions.nid.edu' },
      { name: 'NIFT Entrance', conducting: 'NIFT', when: 'Jan–Feb', for: 'B.Des (Fashion/Textile) at NIFT', url: 'https://nift.ac.in' },
      { name: 'IIMC Entrance', conducting: 'IIMC', when: 'May–Jun', for: 'PG Diploma in Journalism', url: 'https://www.iimc.nic.in' },
      { name: 'TNAET', conducting: 'TNDALU', when: 'Jun', for: 'LLB / BA LLB in Tamil Nadu', url: 'https://tndalu.ac.in' },
    ],
  },
  {
    id: 'medical',
    label: 'Medical / Paramedical',
    icon: Stethoscope,
    color: 'green',
    hex: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    tagline: 'MBBS, BDS, Pharmacy, Nursing, Physiotherapy',
    steps: [
      { num: '01', title: 'Complete 12th with PCB', desc: 'Physics, Chemistry, Biology with 50%+ (40% for reserved categories). English is compulsory. Age must be 17+ by Dec 31 of admission year.' },
      { num: '02', title: 'Register & Prepare for NEET', desc: 'NEET UG is the single entrance for all medical courses in India. Registration opens in Feb–Mar. Exam in May. Minimum score required: 50th percentile (720 marks total).' },
      { num: '03', title: 'Apply for Counselling', desc: 'MCC (Medical Counselling Committee) conducts All India Quota counselling for 15% seats. State Medical counselling for 85% seats. Register separately for each.' },
      { num: '04', title: 'Seat Allotment', desc: 'Seats allotted based on NEET rank, category, and college preference. Multiple rounds (R1, R2, mop-up) are conducted to fill vacant seats.' },
      { num: '05', title: 'Report to College', desc: 'Physically report to college with original documents within the deadline. Complete bond signing, fee payment, and enrollment.' },
      { num: '06', title: 'Paramedical Alternatives', desc: 'For B.Pharm, B.Sc Nursing, BPT (Physiotherapy), BMLT: separate state-level counsellings or direct college admissions. NEET not required for most paramedical courses.' },
    ],
    exams: [
      { name: 'NEET UG', conducting: 'NTA', when: 'May', for: 'MBBS, BDS, BAMS, BHMS, BUMS', url: 'https://neet.nta.nic.in' },
      { name: 'AIIMS MBBS', conducting: 'AIIMS (via NEET)', when: 'Through NEET score', for: 'MBBS at AIIMS institutions', url: 'https://www.aiimsexams.ac.in' },
      { name: 'JIPMER', conducting: 'JIPMER (via NEET)', when: 'Through NEET score', for: 'MBBS at JIPMER Puducherry', url: 'https://jipmer.edu.in' },
      { name: 'State Medical (TN)', conducting: 'TNMGRMU', when: 'Jul–Sep', for: 'MBBS/BDS in Tamil Nadu govt colleges', url: 'https://tnmedicalselection.net' },
    ],
  },
  {
    id: 'law',
    label: 'Law',
    icon: Scale,
    color: 'amber',
    hex: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    tagline: 'BA LLB, BBA LLB, LLB (3-year)',
    steps: [
      { num: '01', title: 'Decide: 5-Year or 3-Year LLB', desc: 'Integrated BA LLB / BBA LLB (5 years) can be pursued after 12th. 3-year LLB requires completion of a UG degree (any stream) first.' },
      { num: '02', title: 'Appear for CLAT / LSAT', desc: 'CLAT (Common Law Admission Test) for NLUs. LSAT India for private law schools. TNAET for Tamil Nadu state law colleges. Score 12th with 45%+ (40% for reserved).' },
      { num: '03', title: 'Register for Counselling', desc: 'CLAT Consortium conducts centralised counselling for 24 NLUs. Register, fill preferences, and participate in seat allotment rounds.' },
      { num: '04', title: 'Direct Admission (State Colleges)', desc: 'Government law colleges in states conduct their own entrance exams or admit on merit. TNAET for Tamil Nadu, DU LLB for Delhi, etc.' },
      { num: '05', title: 'Enrol & Complete AIBE', desc: 'After LLB, enrol with Bar Council of India and clear AIBE (All India Bar Examination) to practice law.' },
      { num: '06', title: 'Judicial Service Option', desc: 'After 3 years of practice, eligible for Judicial Service Exam conducted by state Public Service Commissions for Civil Judge posts.' },
    ],
    exams: [
      { name: 'CLAT', conducting: 'Consortium of NLUs', when: 'Dec', for: '5-year BA LLB / BBA LLB at 24 NLUs', url: 'https://consortiumofnlus.ac.in' },
      { name: 'LSAT India', conducting: 'LSAC', when: 'Jan & Jun', for: 'LLB at private law schools', url: 'https://lsatindia.in' },
      { name: 'DU LLB', conducting: 'Delhi University', when: 'Jun', for: '3-year LLB at DU', url: 'https://du.ac.in' },
      { name: 'TNAET', conducting: 'TNDALU', when: 'Jun', for: 'LLB in Tamil Nadu govt law colleges', url: 'https://tndalu.ac.in' },
      { name: 'AILET', conducting: 'NLU Delhi', when: 'Dec', for: 'BA LLB / LLM at NLU Delhi only', url: 'https://nludelhi.ac.in' },
    ],
  },
];

const DOCUMENTS = [
  { category: 'Academic', color: 'teal', items: ['10th Mark Sheet (Original + 2 Xerox)', '10th Passing Certificate', '12th Mark Sheet (Original + 2 Xerox)', '12th Passing Certificate', 'Semester Mark Sheets (if UG/PG)'] },
  { category: 'Transfer & Conduct', color: 'amber', items: ['Transfer Certificate (TC) from previous institution', 'Conduct Certificate', 'Migration Certificate (for CBSE/ICSE students)', 'Character Certificate from school/college Principal'] },
  { category: 'Identity & Residence', color: 'purple', items: ['Aadhar Card (Original + Xerox)', 'Passport size photographs (6–8 copies)', 'Domicile / Nativity Certificate', 'Date of Birth Certificate or 10th certificate as proof'] },
  { category: 'Category / Income', color: 'green', items: ['Community / Caste Certificate (SC/ST/OBC)', 'Income Certificate (for fee concession/scholarship)', 'Non-Creamy Layer Certificate (for OBC)', 'Disability Certificate (if applicable, for PwD quota)'] },
  { category: 'Admission-Specific', color: 'teal', items: ['Entrance Exam Scorecard / Rank Card', 'Allotment Letter from counselling authority', 'Medical Fitness Certificate', 'Anti-Ragging Undertaking (signed by student + parent)', 'Gap Year Certificate (if applicable)'] },
];

const DEADLINES = [
  { month: 'January – February', events: ['JEE Main Session 1 (Jan)', 'NEET UG Registration opens', 'CLAT Registration opens', 'NID DAT Prelims', 'BITSAT Registration'], color: 'teal' },
  { month: 'March – April', events: ['JEE Main Session 2 (Apr)', 'NEET UG Admit Card', 'CA Foundation Registration deadline', 'IPMAT Registration', 'CUET Registration'], color: 'amber' },
  { month: 'May – June', events: ['NEET UG Exam (May)', 'JEE Advanced (May–Jun)', 'CUET UG Exam', 'CLAT Exam', '12th Board Results (May–Jun)', 'TNEA Registration opens'], color: 'green' },
  { month: 'July – August', events: ['JoSAA Counselling (Jul–Aug)', 'TNEA Counselling', 'NEET UG Results & Counselling', 'State Engineering Counsellings', 'College Admissions close (most)'], color: 'purple' },
  { month: 'September – December', events: ['Mop-up Rounds for unfilled seats', 'CA Foundation Exam (Nov)', 'CLAT (Next year, Dec)', 'NIFT/NID DAT preparations begin', 'JEE Main next year prep'], color: 'teal' },
];

const LINKS = [
  { name: 'JoSAA Counselling', url: 'https://josaa.nic.in', desc: 'IITs, NITs, IIITs seat allocation' },
  { name: 'TNEA Online', url: 'https://www.tneaonline.org', desc: 'TN Engineering Admissions portal' },
  { name: 'NTA (JEE/NEET)', url: 'https://nta.ac.in', desc: 'National Testing Agency – all NTA exams' },
  { name: 'CLAT Consortium', url: 'https://consortiumofnlus.ac.in', desc: 'National Law University admissions' },
  { name: 'CUET UG', url: 'https://cuet.samarth.ac.in', desc: 'Central Universities Entrance Test' },
  { name: 'MCC Counselling', url: 'https://mcc.nic.in', desc: 'Medical Counselling Committee (NEET)' },
  { name: 'National Scholarships', url: 'https://scholarships.gov.in', desc: 'NSP — All Govt scholarships' },
  { name: 'NIRF Rankings', url: 'https://www.nirfindia.org', desc: 'Govt of India college rankings' },
  { name: 'Vidyalakshmi Portal', url: 'https://www.vidyalakshmi.co.in', desc: 'Education loan applications' },
  { name: 'ICAI (CA)', url: 'https://icai.org', desc: 'Chartered Accountancy admissions' },
  { name: 'NID Admissions', url: 'https://admissions.nid.edu', desc: 'National Institute of Design' },
  { name: 'NIFT', url: 'https://nift.ac.in', desc: 'National Institute of Fashion Technology' },
];

// ── Component ────────────────────────────────────────────────

export default function AdmissionGuidancePage() {
  const [activeStream, setActiveStream] = useState('science');
  const [openStep, setOpenStep] = useState(null);
  const [openDocCat, setOpenDocCat] = useState('Academic');
  const [activeTab, setActiveTab] = useState('process');

  const stream = STREAMS.find(s => s.id === activeStream);
  const Icon = stream.icon;

  const handleDownloadChecklist = () => {
    const lines = [
      'CAREER ADVISOR — ADMISSION DOCUMENT CHECKLIST',
      '================================================',
      '',
      ...DOCUMENTS.flatMap(cat => [
        `${cat.category.toUpperCase()}`,
        ...cat.items.map(i => `  [ ]  ${i}`),
        '',
      ]),
      'Generated: ' + new Date().toLocaleString('en-IN'),
      'CareerAdvisor — Your Personalized Career Guide',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Admission_Document_Checklist.txt';
    a.click(); URL.revokeObjectURL(url);
  };

  const TABS = [
    { id: 'process', label: 'Admission Process', icon: ClipboardList },
    { id: 'docs', label: 'Document Checklist', icon: FileText },
    { id: 'calendar', label: 'Exam Calendar', icon: Calendar },
    { id: 'links', label: 'Official Links', icon: LinkIcon },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '2rem 0' }}>
        <div className="container">

          {/* ── Page Header ── */}
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-teal" style={{ marginBottom: '0.75rem', display: 'inline-flex', gap: '0.3rem' }}>
              <GraduationCap size={12} /> Admission Guidance
            </span>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Admission Guidance</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: 560 }}>
              Step-by-step admission process, document checklists, exam calendars, and official links for every stream.
            </p>
          </div>

          {/* ── Stream Selector ── */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {STREAMS.map(s => {
              const SI = s.icon;
              const active = activeStream === s.id;
              return (
                <button key={s.id} onClick={() => setActiveStream(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${active ? s.hex : 'var(--border)'}`,
                  background: active ? s.bg : 'var(--surface-1)',
                  color: active ? s.hex : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: active ? 600 : 400,
                  fontSize: '0.875rem', transition: 'var(--transition)',
                }}>
                  <SI size={15} />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* ── Stream Hero Banner ── */}
          <div style={{
            padding: '1.5rem 1.75rem', borderRadius: 'var(--radius-lg)',
            background: stream.bg, border: `1px solid ${stream.border}`,
            marginBottom: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 'var(--radius-md)',
              background: `${stream.hex}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={26} color={stream.hex} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '0.2rem', color: stream.hex }}>
                {stream.label} Stream
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{stream.tagline}</p>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={{
            display: 'flex', gap: '0.25rem', marginBottom: '1.75rem',
            background: 'var(--surface-1)', padding: '0.25rem',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
            overflowX: 'auto',
          }}>
            {TABS.map(({ id, label, icon: TI }) => (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap',
                background: activeTab === id ? 'var(--surface-3)' : 'transparent',
                color: activeTab === id ? stream.hex : 'var(--text-muted)',
                border: `1px solid ${activeTab === id ? stream.hex + '55' : 'transparent'}`,
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: activeTab === id ? 600 : 400,
                transition: 'var(--transition)',
              }}>
                <TI size={14} />{label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════ */}
          {/* TAB: ADMISSION PROCESS                        */}
          {/* ══════════════════════════════════════════════ */}
          {activeTab === 'process' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {stream.steps.map((step, i) => {
                  const open = openStep === i;
                  return (
                    <div key={i} className="card" style={{
                      padding: 0, overflow: 'hidden',
                      border: `1px solid ${open ? stream.border : 'var(--border)'}`,
                      background: open ? stream.bg : 'var(--surface-1)',
                      transition: 'var(--transition)',
                    }}>
                      <button onClick={() => setOpenStep(open ? null : i)} style={{
                        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.4rem',
                        textAlign: 'left',
                      }}>
                        {/* Step number circle */}
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                          background: open ? stream.hex : 'var(--surface-2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem',
                          color: open ? 'white' : 'var(--text-muted)',
                          transition: 'var(--transition)',
                        }}>
                          {step.num}
                        </div>
                        <span style={{ flex: 1, fontWeight: 600, fontSize: '0.95rem', color: open ? stream.hex : 'var(--text-primary)' }}>
                          {step.title}
                        </span>
                        {open
                          ? <ChevronUp size={16} color={stream.hex} />
                          : <ChevronDown size={16} color="var(--text-muted)" />
                        }
                      </button>
                      {open && (
                        <div style={{ padding: '0 1.4rem 1.2rem 4.4rem', animation: 'fadeIn 0.2s ease' }}>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                            {step.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tip box */}
              <div style={{
                padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-md)',
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)',
                display: 'flex', gap: '0.75rem',
              }}>
                <Info size={16} color="var(--amber-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  <strong style={{ color: 'var(--amber-400)' }}>Pro Tip:</strong> Always keep both originals and certified xerox copies of every document.
                  Start gathering documents 1 month before counselling to avoid last-minute stress.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* TAB: DOCUMENT CHECKLIST                       */}
          {/* ══════════════════════════════════════════════ */}
          {activeTab === 'docs' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.2rem' }}>
                    Complete Document Checklist
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Applicable for most college admissions in India. Verify specific requirements with your institution.
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={handleDownloadChecklist}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Download size={14} /> Download Checklist
                </button>
              </div>

              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {DOCUMENTS.map(cat => (
                  <button key={cat.category} onClick={() => setOpenDocCat(cat.category)} style={{
                    padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 500,
                    cursor: 'pointer', transition: 'var(--transition)',
                    background: openDocCat === cat.category ? `rgba(${cat.color === 'teal' ? '14,165,233' : cat.color === 'amber' ? '245,158,11' : cat.color === 'green' ? '16,185,129' : '139,92,246'}, 0.15)` : 'var(--surface-2)',
                    color: openDocCat === cat.category ? `var(--${cat.color}-400)` : 'var(--text-muted)',
                    border: `1px solid ${openDocCat === cat.category ? `var(--${cat.color}-400)` : 'var(--border)'}`,
                  }}>
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* Doc items */}
              {DOCUMENTS.filter(cat => cat.category === openDocCat).map(cat => (
                <div key={cat.category} className="card" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {cat.items.map((item, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ marginTop: 3, accentColor: `var(--${cat.color}-400)`, width: 16, height: 16, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{
                marginTop: '1.25rem', padding: '1rem 1.25rem',
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.6rem',
              }}>
                <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#f87171' }}>Important:</strong> Original documents must be produced during physical reporting.
                  Keep original + 2 attested xerox copies of each document. Some colleges also require notarized copies.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* TAB: EXAM CALENDAR                            */}
          {/* ══════════════════════════════════════════════ */}
          {activeTab === 'calendar' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {/* Stream entrance exams */}
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem', color: stream.hex }}>
                Entrance Exams for {stream.label}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                {stream.exams.map(exam => (
                  <div key={exam.name} className="card" style={{
                    padding: '1.1rem',
                    borderLeft: `3px solid ${stream.hex}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{exam.name}</h4>
                      <span className="badge" style={{
                        background: stream.bg, color: stream.hex,
                        border: `1px solid ${stream.border}`, fontSize: '0.7rem',
                      }}>
                        <Clock size={10} style={{ marginRight: 3 }} />{exam.when}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{exam.conducting}</p>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', lineHeight: 1.5 }}>{exam.for}</p>
                    <a href={exam.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: stream.hex, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      Official Website <ExternalLink size={11} />
                    </a>
                  </div>
                ))}
              </div>

              {/* Annual timeline */}
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>
                Annual Admission Timeline (India)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {DEADLINES.map((period, i) => (
                  <div key={i} className="card" style={{ padding: '1.1rem', display: 'flex', gap: '1rem' }}>
                    <div style={{
                      flexShrink: 0, width: 4, borderRadius: 2,
                      background: `var(--${period.color}-400)`,
                      alignSelf: 'stretch',
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: `var(--${period.color}-400)`, marginBottom: '0.5rem' }}>
                        {period.month}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {period.events.map(ev => (
                          <span key={ev} style={{
                            fontSize: '0.78rem', padding: '0.2rem 0.6rem',
                            background: 'var(--surface-2)', borderRadius: '99px',
                            color: 'var(--text-secondary)', border: '1px solid var(--border)',
                          }}>
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', padding: '0.9rem 1.1rem', background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '0.5rem' }}>
                <Bell size={15} color="var(--teal-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Dates are approximate and change every year. Always check the official NTA / exam authority website for exact dates and schedule.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* TAB: OFFICIAL LINKS                           */}
          {/* ══════════════════════════════════════════════ */}
          {activeTab === 'links' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Verified official portals for admissions, counselling, scholarships, and rankings.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {LINKS.map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem 1.1rem', cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-1)'; }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                        background: 'rgba(14,165,233,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <ExternalLink size={16} color="var(--teal-400)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--teal-300)', marginBottom: '0.15rem' }}>{link.name}</p>
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{link.desc}</p>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Scholarship highlight */}
              <div style={{
                marginTop: '1.5rem', padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(14,165,233,0.05))',
                border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-lg)',
                display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: 'var(--green-400)', marginBottom: '0.35rem' }}>💡 Don't miss scholarships!</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    The National Scholarship Portal (NSP) lists hundreds of central and state government scholarships.
                    Apply within the deadline — most open in July–October each year.
                  </p>
                </div>
                <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary btn-sm" style={{ flexShrink: 0, alignSelf: 'center' }}>
                  View Scholarships <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

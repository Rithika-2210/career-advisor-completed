/**
 * PDF Generator — Career Recommendation Report
 * Uses jsPDF (pure JS, no canvas needed) for structured PDF output
 * Renders a multi-page professional PDF with all recommendation data
 */

/**
 * Load jsPDF dynamically from CDN (avoids npm install for demo)
 * In production, add jspdf to package.json
 */
const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// ─── Colour palette (RGB) ───────────────────────────────────
const C = {
  navy:    [6,  13,  26],
  navyMid: [13, 27,  51],
  teal:    [14, 165, 233],
  tealDark:[8,  145, 178],
  amber:   [245,158,11],
  green:   [16, 185,129],
  purple:  [139,92, 246],
  white:   [241,245,249],
  muted:   [100,116,139],
  border:  [30, 58,  95],
  text:    [203,213,225],
};

// ─── Helpers ────────────────────────────────────────────────
const rgb = (c) => `rgb(${c.join(',')})`;

class PDFBuilder {
  constructor(jsPDF) {
    this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    this.W = 210; this.H = 297;
    this.margin = 18;
    this.y = 0;
    this.page = 1;
  }

  setFill(c)   { this.doc.setFillColor(...c); }
  setDraw(c)   { this.doc.setDrawColor(...c); }
  setTxt(c)    { this.doc.setTextColor(...c); }
  setFont(sz, style='normal', font='helvetica') {
    this.doc.setFont(font, style);
    this.doc.setFontSize(sz);
  }
  rect(x, y, w, h) { this.doc.rect(x, y, w, h, 'F'); }
  line(x1, y1, x2, y2, c=C.border) {
    this.setDraw(c); this.doc.setLineWidth(0.3);
    this.doc.line(x1, y1, x2, y2);
  }
  text(txt, x, y, opts={}) { this.doc.text(txt, x, y, opts); }
  addPage() { this.doc.addPage(); this.page++; this.y = 0; }

  checkPage(needed=20) {
    if (this.y + needed > this.H - 20) this.addPage();
  }

  // ── Cover gradient (simulated with rectangles) ──
  drawCoverBg() {
    for (let i = 0; i < 297; i++) {
      const t = i / 297;
      const r = Math.round(6  + t * 7);
      const g = Math.round(13 + t * 14);
      const b = Math.round(26 + t * 25);
      this.setFill([r,g,b]);
      this.rect(0, i, 210, 1.1);
    }
  }

  // ── Section header bar ──
  sectionHeader(title, color=C.teal, y=null) {
    if (y !== null) this.y = y;
    this.checkPage(16);
    this.setFill([...color, 0.15].slice(0,3));
    // subtle left accent bar
    this.setFill(color);
    this.rect(this.margin, this.y, 3, 7);
    this.setTxt(color);
    this.setFont(12, 'bold');
    this.text(title, this.margin + 6, this.y + 5.5);
    this.y += 11;
    this.line(this.margin, this.y, this.W - this.margin, this.y, color);
    this.y += 4;
  }

  // ── Info row (label : value) ──
  infoRow(label, value, valColor=C.white) {
    if (!value) return;
    this.checkPage(8);
    this.setTxt(C.muted); this.setFont(8.5);
    this.text(String(label), this.margin, this.y);
    this.setTxt(valColor); this.setFont(8.5, 'bold');
    this.text(String(value), this.margin + 55, this.y);
    this.y += 6;
  }

  // ── Tag pill ──
  tag(txt, x, y, bg=C.teal, fg=C.white) {
    const tw = this.doc.getTextWidth(txt) + 6;
    this.setFill(bg); this.doc.roundedRect(x, y - 3.5, tw, 5.5, 1.5, 1.5, 'F');
    this.setTxt(fg); this.setFont(7, 'bold');
    this.text(txt, x + 3, y);
    return tw + 2;
  }

  // ── Progress bar ──
  progressBar(x, y, w, pct, color=C.teal) {
    this.setFill(C.border); this.doc.roundedRect(x, y, w, 3, 1, 1, 'F');
    this.setFill(color); this.doc.roundedRect(x, y, w * (pct/100), 3, 1, 1, 'F');
  }

  // ── Horizontal divider ──
  divider() {
    this.checkPage(6);
    this.line(this.margin, this.y, this.W - this.margin, this.y, C.border);
    this.y += 5;
  }

  // ── Page footer ──
  footer() {
    const pages = this.doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      this.doc.setPage(p);
      this.setFill(C.navyMid);
      this.rect(0, 285, 210, 12);
      this.setTxt(C.muted); this.setFont(7);
      this.text('CareerAdvisor — Personalized Career & Education Guidance', this.margin, 291);
      this.text(`Page ${p} of ${pages}`, 190, 291, { align: 'right' });
      this.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}`, 105, 291, { align: 'center' });
    }
  }
}

// ─── MAIN EXPORT ────────────────────────────────────────────
export const downloadRecommendationPDF = async (recommendation, user) => {
  const jsPDF = await loadJsPDF();
  const pdf = new PDFBuilder(jsPDF);
  const m = pdf.margin;

  // ════════════════════════════════════════════
  // PAGE 1 — COVER
  // ════════════════════════════════════════════
  pdf.drawCoverBg();

  // Accent top stripe
  pdf.setFill(C.teal);
  pdf.rect(0, 0, 210, 2);

  // Logo area
  pdf.setFill(C.teal);
  pdf.doc.roundedRect(m, 28, 14, 14, 3, 3, 'F');
  pdf.setTxt(C.white); pdf.setFont(10, 'bold');
  pdf.text('CA', m + 3, 37.5);

  pdf.setTxt(C.white); pdf.setFont(18, 'bold');
  pdf.text('CareerAdvisor', m + 19, 37.5);
  pdf.setTxt(C.teal); pdf.setFont(9);
  pdf.text('Personalized Career & Education Guidance', m + 19, 44);

  // Title block
  pdf.setFill(C.teal);
  pdf.doc.roundedRect(m, 62, pdf.W - m*2, 2, 1, 1, 'F');

  pdf.setTxt(C.white); pdf.setFont(26, 'bold');
  pdf.text('Career Recommendation', m, 85);
  pdf.setTxt(C.teal); pdf.setFont(26, 'bold');
  pdf.text('Report', m, 97);

  pdf.setTxt(C.text); pdf.setFont(10);
  pdf.text('Your personalized academic and career guidance', m, 108);
  pdf.text('based on aptitude assessment and interest mapping.', m, 115);

  // Student info card
  pdf.setFill(C.navyMid);
  pdf.doc.roundedRect(m, 128, pdf.W - m*2, 55, 4, 4, 'F');
  pdf.setFill(C.teal); pdf.rect(m, 128, 3, 55);

  pdf.setTxt(C.muted); pdf.setFont(8);
  pdf.text('PREPARED FOR', m + 8, 137);
  pdf.setTxt(C.white); pdf.setFont(14, 'bold');
  pdf.text(user?.name || 'Student', m + 8, 146);

  pdf.setTxt(C.muted); pdf.setFont(8);
  pdf.text('Email', m + 8, 155);
  pdf.text('Education', m + 80, 155);
  pdf.text('Location', m + 145, 155);
  pdf.setTxt(C.text); pdf.setFont(8.5);
  pdf.text(user?.email || '—', m + 8, 161);
  pdf.text(user?.academicDetails?.currentEducation || '—', m + 80, 161);
  pdf.text(user?.location?.state || '—', m + 145, 161);

  pdf.setTxt(C.muted); pdf.setFont(8);
  pdf.text('Top Interests', m + 8, 171);
  pdf.setTxt(C.teal); pdf.setFont(8.5);
  pdf.text((user?.interests?.slice(0,4).join('  •  ')) || '—', m + 8, 177);

  // Basis metrics
  const basis = recommendation.recommendationBasis || {};
  const metrics = [
    { label: 'Academic\nScore', value: basis.academicScore ? `${basis.academicScore}%` : 'N/A', color: C.green },
    { label: 'Aptitude\nScore', value: basis.aptitudeScore ? `${basis.aptitudeScore}%` : 'N/A', color: C.teal },
    { label: 'Interest\nAlignment', value: `${basis.interestAlignment || 0}%`, color: C.amber },
    { label: 'Engine', value: 'Rule-Based\nv1', color: C.purple },
  ];
  const bx = m, by = 198, bw = (pdf.W - m*2) / 4;
  metrics.forEach((met, i) => {
    pdf.setFill(C.navyMid);
    pdf.doc.roundedRect(bx + i*bw + 1, by, bw - 2, 28, 3, 3, 'F');
    pdf.setTxt(met.color); pdf.setFont(12, 'bold');
    pdf.text(met.value.split('\n')[0], bx + i*bw + (bw/2), by + 11, { align:'center' });
    if (met.value.includes('\n')) {
      pdf.text(met.value.split('\n')[1], bx + i*bw + (bw/2), by + 17, { align:'center' });
    }
    pdf.setTxt(C.muted); pdf.setFont(7);
    met.label.split('\n').forEach((ln, li) => {
      pdf.text(ln, bx + i*bw + (bw/2), by + 22 + li*4, { align:'center' });
    });
  });

  // Generation date
  pdf.setTxt(C.muted); pdf.setFont(8);
  pdf.text(`Report generated: ${new Date().toLocaleString('en-IN')}`, m, 240);

  // Bottom accent bar
  pdf.setFill(C.teal); pdf.rect(0, 280, 210, 2);
  pdf.setFill(C.amber); pdf.rect(0, 282, 70, 2);
  pdf.setFill(C.green); pdf.rect(70, 282, 70, 2);
  pdf.setFill(C.purple); pdf.rect(140, 282, 70, 2);

  // ════════════════════════════════════════════
  // PAGE 2 — STREAM RECOMMENDATIONS
  // ════════════════════════════════════════════
  pdf.addPage();
  pdf.setFill(C.navy); pdf.rect(0, 0, 210, 297);
  pdf.setFill(C.navyMid); pdf.rect(0, 0, 210, 16);
  pdf.setTxt(C.teal); pdf.setFont(8, 'bold');
  pdf.text('CAREER RECOMMENDATION REPORT', m, 10);
  pdf.setTxt(C.muted); pdf.setFont(7);
  pdf.text(user?.name || '', pdf.W - m, 10, { align: 'right' });
  pdf.y = 24;

  pdf.sectionHeader('RECOMMENDED ACADEMIC STREAMS', C.teal);

  (recommendation.recommendedStreams || []).forEach((s, idx) => {
    pdf.checkPage(42);
    const isTop = s.rank === 1;
    // card bg
    pdf.setFill(isTop ? [8, 40, 70] : C.navyMid);
    pdf.doc.roundedRect(m, pdf.y, pdf.W - m*2, 36, 3, 3, 'F');
    if (isTop) { pdf.setFill(C.teal); pdf.doc.roundedRect(m, pdf.y, 3, 36, 1, 1, 'F'); }

    // rank badge
    pdf.setFill(isTop ? C.amber : C.border);
    pdf.doc.circle(m + 18, pdf.y + 10, 6, 'F');
    pdf.setTxt(isTop ? C.navy : C.muted); pdf.setFont(9, 'bold');
    pdf.text(`#${s.rank}`, m + 18, pdf.y + 12.5, { align: 'center' });

    // stream name
    pdf.setTxt(isTop ? C.white : C.text); pdf.setFont(13, 'bold');
    pdf.text(s.stream, m + 30, pdf.y + 9);
    if (isTop) {
      pdf.tag('⭐ Top Pick', m + 30 + pdf.doc.getTextWidth(s.stream) + 4, pdf.y + 9.5, C.amber, C.navy);
    }

    // confidence bar
    pdf.setTxt(C.muted); pdf.setFont(7);
    pdf.text(`Match: ${s.confidence}%`, m + 30, pdf.y + 16);
    pdf.progressBar(m + 30, pdf.y + 18, 100, s.confidence, isTop ? C.teal : C.muted);

    // justification
    pdf.setTxt(C.text); pdf.setFont(8);
    const lines = pdf.doc.splitTextToSize(s.justification || '', pdf.W - m*2 - 36);
    lines.slice(0,2).forEach((ln, li) => pdf.text(ln, m + 30, pdf.y + 26 + li*4.5));

    pdf.y += 40;
  });

  pdf.y += 4;
  pdf.sectionHeader('RECOMMENDED DEGREE PROGRAMS', C.amber);

  const degreeCols = 2;
  const dw = (pdf.W - m*2 - 4) / degreeCols;
  let col = 0, rowY = pdf.y;

  (recommendation.recommendedDegrees || []).forEach((d, i) => {
    const x = m + col * (dw + 4);
    const cardH = 40;
    pdf.checkPage(cardH + 4);
    if (col === 0 && i > 0) rowY = pdf.y;

    pdf.setFill(C.navyMid);
    pdf.doc.roundedRect(x, pdf.y, dw, cardH, 3, 3, 'F');
    pdf.setFill(C.amber); pdf.doc.roundedRect(x, pdf.y, dw, 2, 1, 1, 'F');

    pdf.setTxt(C.white); pdf.setFont(9, 'bold');
    const titleLines = pdf.doc.splitTextToSize(d.name, dw - 8);
    titleLines.slice(0,2).forEach((ln, li) => pdf.text(ln, x + 4, pdf.y + 8 + li*5));

    pdf.setTxt(C.amber); pdf.setFont(7.5, 'bold');
    pdf.text(d.duration || '', x + 4, pdf.y + 20);

    pdf.setTxt(C.muted); pdf.setFont(7);
    const descLines = pdf.doc.splitTextToSize(d.description || '', dw - 8);
    descLines.slice(0,2).forEach((ln, li) => pdf.text(ln, x + 4, pdf.y + 26 + li*4));

    if (d.eligibility) {
      pdf.setTxt(C.text); pdf.setFont(6.5);
      pdf.text(`Eligibility: ${d.eligibility}`, x + 4, pdf.y + 36);
    }

    col++;
    if (col >= degreeCols) { col = 0; pdf.y += cardH + 4; }
  });
  if (col > 0) pdf.y += 44;

  // ════════════════════════════════════════════
  // PAGE 3 — CAREER PATHS
  // ════════════════════════════════════════════
  pdf.addPage();
  pdf.setFill(C.navy); pdf.rect(0, 0, 210, 297);
  pdf.setFill(C.navyMid); pdf.rect(0, 0, 210, 16);
  pdf.setTxt(C.teal); pdf.setFont(8, 'bold');
  pdf.text('CAREER PATH MAPPING', m, 10);
  pdf.setTxt(C.muted); pdf.setFont(7);
  pdf.text(user?.name || '', pdf.W - m, 10, { align: 'right' });
  pdf.y = 24;

  pdf.sectionHeader('CAREER PATH MAPPING', C.purple);

  (recommendation.careerPaths || []).forEach((cp, idx) => {
    pdf.checkPage(72);
    const colors = [C.teal, C.green, C.amber, C.purple];
    const col = colors[idx % colors.length];

    pdf.setFill(C.navyMid);
    pdf.doc.roundedRect(m, pdf.y, pdf.W - m*2, 66, 3, 3, 'F');
    pdf.setFill(col); pdf.rect(m, pdf.y, 3, 66);

    // Title + salary
    pdf.setTxt(C.white); pdf.setFont(11, 'bold');
    pdf.text(cp.title, m + 8, pdf.y + 8);
    if (cp.averageSalary) {
      pdf.setTxt(C.green); pdf.setFont(8, 'bold');
      pdf.text(cp.averageSalary, pdf.W - m - 2, pdf.y + 8, { align:'right' });
    }
    pdf.setTxt(C.text); pdf.setFont(7.5);
    const descL = pdf.doc.splitTextToSize(cp.description || '', pdf.W - m*2 - 12);
    descL.slice(0,2).forEach((ln, li) => pdf.text(ln, m + 8, pdf.y + 14 + li*4.5));

    // Entry roles
    pdf.setTxt(col); pdf.setFont(7, 'bold');
    pdf.text('ENTRY ROLES', m + 8, pdf.y + 26);
    pdf.setTxt(C.text); pdf.setFont(7);
    (cp.entryRoles || []).slice(0,3).forEach((r, ri) => pdf.text(`→ ${r}`, m + 8, pdf.y + 31 + ri*4.5));

    // Growth roles
    pdf.setTxt(C.amber); pdf.setFont(7, 'bold');
    pdf.text('GROWTH PATH', m + 95, pdf.y + 26);
    pdf.setTxt(C.text); pdf.setFont(7);
    (cp.growthRoles || []).slice(0,3).forEach((r, ri) => pdf.text(`↑ ${r}`, m + 95, pdf.y + 31 + ri*4.5));

    // Exams
    if (cp.relatedExams?.length) {
      pdf.setTxt(C.muted); pdf.setFont(7, 'bold');
      pdf.text('KEY EXAMS:', m + 8, pdf.y + 52);
      let tx = m + 8 + pdf.doc.getTextWidth('KEY EXAMS: ') + 1;
      cp.relatedExams.slice(0,5).forEach(e => {
        if (tx > pdf.W - m - 30) return;
        tx += pdf.tag(e, tx, pdf.y + 52.5, C.border, C.muted) + 1;
      });
    }

    // Skills
    if (cp.skills?.length) {
      let sx = m + 8;
      cp.skills.slice(0,6).forEach(sk => {
        if (sx > pdf.W - m - 25) return;
        sx += pdf.tag(sk, sx, pdf.y + 59.5, [14,60,90], C.teal) + 1;
      });
    }

    pdf.y += 70;
  });

  // ════════════════════════════════════════════
  // PAGE 4 — NEXT STEPS
  // ════════════════════════════════════════════
  pdf.addPage();
  pdf.setFill(C.navy); pdf.rect(0, 0, 210, 297);
  pdf.setFill(C.navyMid); pdf.rect(0, 0, 210, 16);
  pdf.setTxt(C.teal); pdf.setFont(8, 'bold');
  pdf.text('NEXT STEPS & GUIDANCE', m, 10);
  pdf.y = 24;

  pdf.sectionHeader('RECOMMENDED ACTION PLAN', C.green);

  const steps = [
    { num: '01', title: 'Complete Your Profile', desc: 'Ensure all academic details, interests, and location are updated for better college matching.', color: C.teal },
    { num: '02', title: 'Research Your Top Stream', desc: `Focus on ${recommendation.recommendedStreams?.[0]?.stream || 'your recommended stream'}. Explore subjects, entrance exams, and career paths within it.`, color: C.amber },
    { num: '03', title: 'Prepare for Entrance Exams', desc: 'Identify key exams (JEE, NEET, CLAT, TNEA, CAT etc.) relevant to your stream and start preparation early.', color: C.green },
    { num: '04', title: 'Explore Matching Colleges', desc: 'Use CareerAdvisor\'s College Discovery tool filtered by your state, stream, and eligibility criteria.', color: C.purple },
    { num: '05', title: 'Apply for Scholarships', desc: 'Check National Scholarship Portal (scholarships.gov.in), college-specific scholarships, and state government schemes.', color: C.teal },
    { num: '06', title: 'Seek Guidance', desc: 'Talk to a school counselor, attend college fairs, and connect with students in your target programs.', color: C.amber },
  ];

  steps.forEach(s => {
    pdf.checkPage(22);
    pdf.setFill(C.navyMid);
    pdf.doc.roundedRect(m, pdf.y, pdf.W - m*2, 18, 3, 3, 'F');
    pdf.setFill(s.color); pdf.doc.circle(m + 9, pdf.y + 9, 5.5, 'F');
    pdf.setTxt(C.navy); pdf.setFont(8, 'bold');
    pdf.text(s.num, m + 9, pdf.y + 11.2, { align:'center' });
    pdf.setTxt(C.white); pdf.setFont(9, 'bold');
    pdf.text(s.title, m + 20, pdf.y + 7);
    pdf.setTxt(C.text); pdf.setFont(7.5);
    const dl = pdf.doc.splitTextToSize(s.desc, pdf.W - m*2 - 24);
    dl.slice(0,2).forEach((ln, li) => pdf.text(ln, m + 20, pdf.y + 12 + li*4));
    pdf.y += 22;
  });

  pdf.y += 6;
  pdf.sectionHeader('IMPORTANT RESOURCES', C.teal);

  const resources = [
    { name: 'NIRF Rankings', url: 'nirfindia.org', desc: 'National Institutional Rankings by Govt of India' },
    { name: 'TNEA Admissions', url: 'tneaonline.org', desc: 'TN Engineering Admissions – Anna University' },
    { name: 'JoSAA Counseling', url: 'josaa.nic.in', desc: 'Joint Seat Allocation for IITs, NITs, IIITs' },
    { name: 'National Scholarships', url: 'scholarships.gov.in', desc: 'NSP – All government scholarships in one place' },
    { name: 'NEET', url: 'nta.ac.in/neet', desc: 'National Eligibility cum Entrance Test (Medical)' },
    { name: 'CLAT', url: 'consortiumofnlus.ac.in', desc: 'Common Law Admission Test (Law)' },
  ];

  const rcols = 2;
  const rw = (pdf.W - m*2 - 4) / rcols;
  let rc = 0;

  resources.forEach((r, i) => {
    if (rc === 0) pdf.checkPage(18);
    const rx = m + rc * (rw + 4);
    pdf.setFill(C.navyMid);
    pdf.doc.roundedRect(rx, pdf.y, rw, 14, 2, 2, 'F');
    pdf.setTxt(C.teal); pdf.setFont(8, 'bold');
    pdf.text(r.name, rx + 4, pdf.y + 5);
    pdf.setTxt(C.muted); pdf.setFont(6.5);
    pdf.text(r.url, rx + 4, pdf.y + 10);
    pdf.setTxt(C.text); pdf.setFont(6.5);
    pdf.text(r.desc, rx + rw - 4, pdf.y + 7.5, { align:'right' });
    rc++;
    if (rc >= rcols) { rc = 0; pdf.y += 17; }
  });
  if (rc > 0) pdf.y += 17;

  // Disclaimer
  pdf.y += 6;
  pdf.setFill([8, 25, 50]);
  pdf.doc.roundedRect(m, pdf.y, pdf.W - m*2, 22, 3, 3, 'F');
  pdf.setTxt(C.muted); pdf.setFont(7, 'bold');
  pdf.text('DISCLAIMER', m + 5, pdf.y + 6);
  pdf.setFont(6.5, 'normal');
  const disc = 'This report is generated by CareerAdvisor\'s rule-based recommendation engine using the profile and assessment data provided. It is intended as guidance only. Cutoffs, fees, and admission requirements change annually — always verify from official college websites and government portals before making decisions.';
  const dlines = pdf.doc.splitTextToSize(disc, pdf.W - m*2 - 10);
  dlines.forEach((ln, li) => pdf.text(ln, m + 5, pdf.y + 11 + li*4));

  // Add footer to all pages
  pdf.footer();

  // ── Save ──
  const fileName = `CareerAdvisor_Report_${(user?.name || 'Student').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
  pdf.doc.save(fileName);

  return fileName;
};
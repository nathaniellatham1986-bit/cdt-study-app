// Official domains & weight ranges (% ranges) from NBC CDT Examination Handbook, rev. 3/1/2026, pp.21-28,
// and Digital Workflow Job Task Outline (rev. June 2022). See PLAN.md / sources/.
const H = 'NBC CDT Examination Handbook (rev. 3/1/2026)';
const d = (id, name, lo, hi, note) => ({ id, name, lo, hi, ...(note ? { note } : {}) });
export const EXAMS = [
  { id: 'comprehensive', name: 'Comprehensive (General)', questions: 160, minutes: 165, src: H + ' p.21-22',
    weightNote: '% of general-knowledge questions. Each of the 6 original specialties is also 16-18% of the specialty-specific questions.',
    domains: [d('A','Dental Lab Industry Regulations & Scope of Practice',8,10), d('B','Anatomy',17,19), d('C','Terminology & Principles',6,8),
      d('D','Articulation',6,8), d('E','Dental Lab Materials: types, processes, properties, handling',34,36), d('F','Impressions & Models',10,12),
      d('G','Safe Working Practices',12,14)] },
  { id: 'ceramics', name: 'Ceramics', questions: 80, minutes: 90, src: H + ' p.22-23', domains: [
    d('A','Preliminary & Diagnostic Work Up',10,12), d('B','Manufacture Master Cast',9,11), d('C','Manufacture Substructure for Ceramics',18,20),
    d('D','Ceramic Application & Contouring',36,38), d('E','Materials & Equipment for Ceramics',21,23)] },
  { id: 'complete-dentures', name: 'Complete Dentures', questions: 80, minutes: 90, src: H + ' p.23-24', domains: [
    d('A','Master Casts from Stock/Custom Tray Impressions',15,17), d('B','Record Base Plate & Occlusal Rim',5,7), d('C','Select & Arrange Artificial Teeth',16,18),
    d('D','Process the Denture',14,16), d('E','Finish & Polish Complete Denture',15,17), d('F','Repairs & Alterations',13,15),
    d('G','Materials & Equipment for Removable Prosthetics',14,16)] },
  { id: 'crown-bridge', name: 'Crown & Bridge', questions: 80, minutes: 90, src: H + ' p.24-25', domains: [
    d('A','Preliminary & Diagnostic Work Up',9,11), d('B','Manufacture Master Cast',10,12), d('C','Design & Manufacture Patterns',17,19),
    d('D','Manufacture Restoration',11,13), d('E','Finish & Polish the Restoration',24,26), d('F','Materials & Equipment for Crown & Bridge',21,23)] },
  { id: 'orthodontics', name: 'Orthodontics', questions: 80, minutes: 90, src: H + ' p.25-26', domains: [
    d('A','Growth & Development',11,13), d('B','Orthodontic Treatment & Appliances',16,18), d('C','Wire Components & Auxiliaries',21,23),
    d('D','Acrylics, Composites, Plastics',14,16), d('E','Soldering & Welding',14,16), d('F','Materials & Equipment for Orthodontics',16,18)] },
  { id: 'partial-dentures', name: 'Partial Dentures', questions: 80, minutes: 90, src: H + ' p.26-27', domains: [
    d('A','Master Casts from Stock/Custom Tray Impressions',6,8), d('B','Survey, Design & Preparation for Framework',25,27,'weight assigned by elimination (PDF layout)'),
    d('C','Manufacture Refractory Cast',3,5), d('D','Manufacture Partial Denture Frameworks',10,12), d('E','Select & Arrange Teeth and Process',9,11),
    d('F','Finish & Polish Partial Denture Base',9,11), d('G','Repairs & Alterations',11,13), d('H','Materials & Equipment',18,20)] },
  { id: 'implants', name: 'Implants', questions: 80, minutes: 90, src: H + ' p.27-28', domains: [
    d('A','Preliminary & Diagnostic Work Up',20,22), d('B','Manufacture the Master Cast',10,12), d('C','Manufacture Removable Prosthesis',8,10),
    d('D','Manufacture Bar/Substructure',15,17), d('E','Screw-Retained Fixed or Removable (Hybrid)',16,18), d('F','Abutment & Cement-Retained Restoration',14,16),
    d('G','Materials & Equipment',9,11)] },
  { id: 'digital-workflow', name: 'Digital Workflow', questions: 80, minutes: 90, src: 'NBC Digital Workflow Job Task Outline (2022); ' + H + ' p.28', domains: [
    d('A','Data Acquisition',21,25), d('B','Design Indications',30,34), d('C','Fabricating Restorations',22,26), d('D','Maintaining Digital Equipment',20,24)] },
];

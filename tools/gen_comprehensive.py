"""Generates content/comprehensive.json. Every card paraphrases text that was read from the cited source."""
import json
AF="AFPAM 47-103 Vol 1 (restored ed., dentaltechnology.org)"
U="https://dentaltechnology.org/en/reference-library/air-force-dental-laboratory-manual/volume-1/chapter-0%d"
def af(ch,para): return {"ref":AF,"loc":f"para {para}","url":U%ch}
BBP={"ref":"OSHA Fact Sheet: Bloodborne Pathogens Standard (29 CFR 1910.1030)","url":"https://www.osha.gov/sites/default/files/publications/bbfact01.pdf"}
SDS={"ref":"OSHA Brief: Hazard Communication Standard Safety Data Sheets (OSHA 3514)","url":"https://www.osha.gov/sites/default/files/publications/OSHA3514.pdf"}
PIC={"ref":"OSHA QuickCard: Hazard Communication Standard Pictogram (OSHA 3491)","url":"https://www.osha.gov/sites/default/files/publications/OSHA3491QuickCardPictogram.pdf"}
FDAC={"ref":"FDA: Classify Your Medical Device","url":"https://www.fda.gov/medical-devices/overview-device-regulation/classify-your-medical-device"}
QMSR={"ref":"FDA: Quality Management System Regulation (QMSR)","url":"https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-management-system-regulation-qmsr"}
C=[]
def f(d,q,a,src): C.append((d,q,a,src))
# ---- A Regulations
f('A',"Under the FDA scheme, what are the three medical device classes and their controls?","Class I: General Controls. Class II: General + Special Controls. Class III: General Controls + Premarket Approval.",FDAC)
f('A',"Which FDA device class carries the lowest risk, and which the greatest?","Class I is lowest risk; Class III is greatest risk.",FDAC)
f('A',"Which FDA requirements apply to every medical device class?","General Controls — the baseline FD&C Act requirements apply to Class I, II and III.",FDAC)
f('A',"For a non-exempt Class I or II device, what premarket submission is generally required?","A 510(k) premarket notification.",FDAC)
f('A',"What two things does FDA device classification depend on (besides risk)?","The device's intended use and its indications for use.",FDAC)
f('A',"When did FDA's Quality Management System Regulation (QMSR) take effect?","February 2, 2026 (amending 21 CFR Part 820 device CGMP).",QMSR)
f('A',"Which international standard does the FDA QMSR incorporate by reference?","ISO 13485:2016 — Medical devices, quality management systems.",QMSR)
f('A',"Who must supply the technician with specific written directions for each case?","The dentist, via the prescription; the dentist must also be available to answer the technician's questions.",af(1,'1.4.1'))
f('A',"How closely must a technician follow the dentist's prescription?","Exactly.",af(1,'1.4.2'))
f('A',"How should a technician treat what they learn about a patient's dental condition or personal life?","As privileged information — not repeated outside professional conversation.",af(1,'1.4.3.3'))
f('A',"To whom does the AFPAM say the technician's moral responsibility lies?","The patient.",af(1,'1.4.3.2'))
f('A',"Under OSHA's BBP standard, how often must the written exposure control plan be updated?","At least annually (also documenting consideration of safer devices and frontline worker input).",BBP)
f('A',"Which OSHA standard is the Bloodborne Pathogens standard (CFR citation)?","29 CFR 1910.1030.",BBP)
# ---- B Anatomy
f('B',"What is the origin and insertion of the masseter?","Origin: zygomatic arch. Insertion: lateral surface of the mandibular ramus.",af(3,'3.21.1'))
f('B',"Primary action of the masseter?","Elevates (closes) the mandible; may aid protrusion.",af(3,'3.21.1.3'))
f('B',"Where does the temporalis insert?","On the coronoid process of the mandible.",af(3,'3.21.2.2'))
f('B',"Besides closing the jaw, what important movement does the temporalis produce?","Retrusion — pulling the mandible back.",af(3,'3.21.2.3'))
f('B',"Where does the medial pterygoid insert?","Medial (internal) surface of the mandibular ramus.",af(3,'3.21.3.2'))
f('B',"Where does the lateral pterygoid insert?","Neck of the condyloid process of the mandible.",af(3,'3.21.4.2'))
f('B',"What happens when both lateral pterygoids contract together?","The mandible is pulled forward into protrusion (opening slightly).",af(3,'3.21.4.3'))
f('B',"What do the paired mylohyoid muscles form?","The floor of the mouth (attached to the mylohyoid lines on the inner mandible).",af(3,'3.22.1'))
f('B',"What does the orbicularis oris do, and what is unusual about its origin?","Closes the lips; it has no real bony origin — it is rimmed by insertions of other facial muscles.",af(3,'3.24'))
f('B',"Which muscle forms the innermost muscle wall of the cheek?","The buccinator.",af(3,'3.32.1'))
f('B',"Primary functions of the buccinator?","Pulls the mouth corners laterally and holds food between the teeth while chewing.",af(3,'3.32.4'))
f('B',"What is the maxillary tuberosity?","The most distal (posterior) portion of the maxillary alveolar ridge.",af(3,'3.37.2'))
f('B',"What is the hamular (pterygomaxillary) notch used for?","A deep depression behind the tuberosity; a guide to the posterior border of a maxillary denture.",af(3,'3.37.3'))
f('B',"Hard vs soft palate: what proportion of the palatal vault is each?","Hard: anterior two-thirds (bone-supported). Soft: posterior one-third (muscular, mobile).",af(3,'3.37.4'))
f('B',"What does the incisive papilla cover?","The incisive foramen, in the midline just behind the central incisors.",af(3,'3.37.5'))
f('B',"Where are the rugae found?","Irregular fibrous ridges in the anterior one-third of the hard palate.",af(3,'3.37.6'))
f('B',"What is the vibrating line?","The line of flexion between the hard and soft palates, usually between the hamular notches near the foveae.",af(3,'3.37.8'))
f('B',"What forms the palatine foveae?","Groupings of minor palatine salivary glands (two depressions beside the midline near the vibrating line).",af(3,'3.37.9'))
f('B',"Name two reasons the retromolar pads matter in denture work.","They guide the plane of occlusion (position stays constant after extraction) and give distal support to a mandibular denture.",af(3,'3.38.2'))
f('B',"Where is the mental foramen normally located?","Buccal surface, between and slightly below the root tips of the first and second premolars.",af(3,'3.38.4.1'))
f('B',"What is the glenoid fossa?","A deep hollow on the undersurface of the zygomatic process of the temporal bone, housing the condyle in hinge movement.",af(3,'3.43'))
f('B',"What does the condyle do during protrusive movement?","Both condyles leave the fossae and move onto the articular eminences.",af(3,'3.44'))
f('B',"What is the articular disc made of, and what is its role?","Tough flexible fibrocartilage between condyle and fossa; a shock absorber that travels with the condyle.",af(3,'3.46'))
f('B',"How many anterior and posterior teeth are in one permanent arch?","Six anteriors (canine to canine) and ten posteriors.",af(4,'4.1.3.2'))
f('B',"What tissue forms the bulk of a tooth?","Dentin.",af(4,'4.4.2'))
f('B',"Through what opening do nerves and vessels enter the tooth?","The apical foramen, at or near the root apex.",af(4,'4.4.4'))
f('B',"What is the lamina dura?","A thin, dense layer of bone lining the tooth socket — a continuation of the cortical plate.",af(4,'4.5.1.2'))
f('B',"What suspends a tooth in its socket?","The periodontal ligament.",af(4,'4.5.2'))
f('B',"Which tissue is part of both the tooth and the periodontium?","Cementum.",af(4,'4.5.3'))
f('B',"Free vs attached gingiva?","Free gingiva can be displaced (crest to sulcus bottom); attached gingiva is firmly fixed to underlying bone.",af(4,'4.5.4'))
# ---- C Terminology
f('C',"In the Universal system, which tooth is #1 and which is #17?","#1 = upper right third molar; #17 = lower left third molar.",af(4,'4.3'))
f('C',"Universal numbers 1–16 vs 17–32?","1–16 maxillary arch; 17–32 mandibular arch.",af(4,'4.3'))
f('C',"Which plane divides the body into right and left parts?","The sagittal plane.",af(3,'3.3.1'))
f('C',"Which plane divides the body into anterior and posterior parts?","The frontal plane.",af(3,'3.3.2'))
f('C',"Which plane divides the body into upper and lower parts?","The transverse (horizontal) plane.",af(3,'3.3.3'))
f('C',"Medial and lateral are synonyms for what?","Medial = internal; lateral = external (relative to the midsagittal plane).",af(3,'3.2.2'))
f('C',"Mesial vs distal surface?","Mesial: proximal surface closest to the arch midline. Distal: proximal surface away from it.",af(4,'4.7.1'))
f('C',"Incisal vs occlusal?","Incisal: cutting edge of an anterior tooth. Occlusal: chewing surface of a posterior tooth.",af(4,'4.7.4-4.7.5'))
f('C',"What is a line angle, and how many per tooth?","The junction of two crown surfaces; eight per tooth.",af(4,'4.7.8'))
f('C',"What is a point angle, and how many per tooth?","The junction of three crown surfaces; four per tooth.",af(4,'4.7.9'))
f('C',"What is an embrasure?","A space diverging from the contacting proximal surfaces of two adjacent teeth.",af(4,'4.11.2.1'))
f('C',"What is 'gauge' a measure of?","Thickness — e.g., wire/wire-wax diameter or sheet wax/metal thickness.",af(2,'2.21.2.2'))
# ---- D Articulation
f('D',"Define centric occlusion.","The occlusion of teeth when the mandible is in centric relation; may or may not coincide with MI.",af(5,'5.4'))
f('D',"In MI, how far forward of centric relation are most people's condyles?","About 1.25 mm ± 1 mm.",af(5,'5.3.1'))
f('D',"Vertical vs horizontal overlap?","Vertical: maxillary teeth extend over mandibular vertically in MI. Horizontal: projection beyond antagonists horizontally.",af(5,'5.5'))
f('D',"Angle Class II: where is the MB cusp of the upper first molar?","Anterior to the buccal groove of the lower first molar (retrognathic profile).",af(5,'5.6.2'))
f('D',"Angle Class III: molar relationship and profile?","Upper first molar MB cusp falls posterior to the lower buccal groove; prognathic profile.",af(5,'5.6.3'))
f('D',"Which cusps are stamp cusps?","Lingual cusps of the upper and buccal cusps of the lower.",af(5,'5.7.1'))
f('D',"Typical difference between occlusal vertical dimension and physiologic rest?","OVD is 2–4 mm less than the rest measurement.",af(5,'5.15'))
f('D',"What is Christensen's phenomenon?","The space between opposing occlusal surfaces during protrusion; anteriors disclude the posteriors.",af(5,'5.29'))
f('D',"In group function, what contacts on the nonworking side?","No contact between upper and lower teeth.",af(5,'5.25.3'))
f('D',"Mutually protected articulation: anterior overlaps in MI?","Horizontal 0.0–0.5 mm; vertical 2 mm or more.",af(5,'5.26.1'))
f('D',"What teeth contact on the working side in canine-guided articulation?","Only the upper and lower canines.",af(5,'5.26.5'))
f('D',"What are the three articulator categories by adjustability?","Nonadjustable, semiadjustable, fully adjustable.",af(6,'6.3.3'))
f('D',"What movements can a hinge-type articulator make?","Only opening and closing — no lateral or protrusive excursions.",af(6,'6.4.1'))
f('D',"Which articulator category is most used in the Dental Services, and for what?","Semiadjustable: all removable prostheses and moderately complex fixed work.",af(6,'6.5.3'))
f('D',"Where does the data for a fully adjustable articulator come from?","Mandibular movement tracings — pantographic or stereographic recordings.",af(6,'6.6.2'))
f('D',"What does 'arcon' stand for and describe?","ARticulator + CONdyle: condyle elements on the lower member, fossae on the upper, as in anatomy.",af(6,'6.7'))
f('D',"What does a facebow transfer do?","Mounts the maxillary cast relating it to the articulator condyles as the maxilla relates to the TMJs.",af(6,'6.13.1'))
# ---- E Materials
E=[
("Effect of more water (higher W:P) on gypsum crushing strength?","Lowers strength — more porosity, fewer crystals per volume.",'2.5.1'),
("Effect of overmixing gypsum on strength?","Breaks forming crystals and reduces crushing strength (mixing up to ~1 min increases it).",'2.5.2'),
("Effect of more water on gypsum setting time?","Lengthens setting time.",'2.6.1'),
("Name two gypsum accelerators and three retarders.","Accelerators: potassium sulfate, table salt. Retarders: vinegar, potassium citrate, borax.",'2.6.4.2'),
("Why never add chemical accelerators/retarders to casting or soldering investments?","They also reduce setting expansion and crushing strength.",'2.6.4.3'),
("What is slurry water used for?","Accelerating plaster/stone set, e.g. in cast mounting.",'2.6.4.4'),
("Thick mix and long mixing time — effect on setting expansion?","Both increase setting expansion.",'2.7'),
("Allowed setting expansion range for model plaster?","0.2–0.3 percent (0.3% maximum).",'2.8.1.3'),
("How is dental stone manufactured vs plaster?","Gypsum is autoclaved under pressure (plaster is heated in open vats), giving more regular prismatic particles.",'2.10.2'),
("Typical initial and final set of dental stone?","Initial 8–15 minutes; final about 45 minutes.",'2.10.3'),
("Setting expansion of die (improved) stone?","0.08–0.18 percent.",'2.11.1'),
("How are improved stones made?","Gypsum boiled in 30% calcium chloride solution before autoclaving.",'2.11.2'),
("What are investments composed of?","A refractory (cristobalite or quartz) plus a binder (gypsum, phosphate or silicate).",'2.12'),
("Cristobalite vs quartz investments — which expands more?","Cristobalite.",'2.12.1'),
("About how much does gold alloy shrink on solidifying?","About 1.4% (±0.2%) — the mold must be enlarged to compensate.",'2.13.2'),
("Why can't a soldering investment be used for casting?","Its quartz refractory gives minimal expansion — not enough to offset gold shrinkage.",'2.14'),
("High-heat chrome-alloy investment: components?","Quartz powder with ethyl silicate liquid (for 2700–2800 °F chrome alloys).",'2.15.1'),
("Powder into water or water into powder for gypsum?","Always add powder to water.",'2.17.3'),
("How long to hold a phosphate-bonded investment under vacuum, and why?","30 seconds — it releases ammonia gas; vacuum removes gas and air.",'2.17.6'),
("Should you add powder or water to a gypsum mix in progress?","Never — start a new mix; adding weakens and distorts.",'2.17.7'),
("When must a batch of investment be discarded for slow set?","If initial set takes more than 20 minutes.",'2.18.1.4'),
("Three groups of dental waxes?","Impression, pattern, processing.",'2.21'),
("Main components of baseplate wax?","Beeswax, paraffin, coloring.",'2.22.1'),
("Hard vs medium baseplate wax — when used?","Hard for warmer climates (resists flow); medium for cooler conditions.",'2.22.3'),
("Inlay wax Type B vs Type C?","Type B: direct (intraoral) technique. Type C: indirect (laboratory) technique.",'2.23.3'),
("Role of carnauba in inlay wax?","Controls the softening point and hardness.",'2.23.1'),
("Key property of sticky wax?","Breaks under pressure instead of bending — natural resin gives adhesiveness/hardness.",'2.26'),
("Main laboratory use of utility wax?","Beading impressions before pouring the cast.",'2.27'),
("What is boxing wax used for?","Boxing impressions; strips about 1½ × 12 in.",'2.28'),
("What is undercut (blockout) wax made of?","Beeswax, resin and kaolin.",'2.30'),
("What is disclosing wax used for?","Detecting points of unequal pressure when seating castings.",'2.31'),
("Temperature for a beeswax dip to seal refractory casts?","280–300 °F (cast heated and dehydrated first).",'2.32'),
("Heat-cured denture resin: powder and liquid are?","Powder = polymer; liquid = monomer (with inhibitor; flammable, irritant).",'2.42'),
("Why are self-curing resins preferred for denture repair?","The denture need not undergo high curing temperature.",'2.44.2'),
("Which soft liners are the most truly elastic?","Silicone resin liners.",'2.48.2'),
("How does the ADA classify alloys?","By percentage of noble metals.",'2.58.1'),
("Name the noble metals.","Gold and the platinum group: platinum, palladium, ruthenium, rhodium, osmium, iridium.",'2.58.1'),
("Why do silver-containing metal-ceramic alloys risk problems?","Silver can green the porcelain and contaminate the furnace muffle.",'2.62.2.3'),
("What casting problem rises with palladium content?","Hydrogen gas absorption, making casting harder.",'2.62.3.3'),
("ADA minimum for chromium+cobalt+nickel in cast chrome alloys?","At least 85% by weight.",'2.63.1.1'),
("Specific gravity of chrome alloys vs gold?","About half — lighter castings.",'2.63.2'),
("Role of fluxes (K, Na, Ca oxides) in porcelain?","Lower the softening temperature and increase thermal expansion.",'2.70.2.1'),
("Most common intermediate oxide in porcelain and its effect?","Aluminum oxide — increases hardness and viscosity.",'2.70.3'),
("Common porcelain opacifiers?","Cerium, titanium and zirconium oxides.",'2.70.4.2'),
("Tinfoil thickness for the stone cast vs the waxed denture?","0.001 in on the cast; 0.003 in over the waxed denture.",'2.77.1.2'),
("What are tinfoil substitutes made of?","Sodium or potassium alginate in distilled water.",'2.77.2.1'),
("Which flux form is best for casting?","Powdered flux.",'2.80.2'),
("Give a common antiflux.","Pencil lead (graphite).",'2.81'),
("Why isn't isopropyl alcohol recommended for the torch?","It smokes badly when applied to wax.",'2.86'),
("Sulfuric acid's advantage over hydrochloric as a pickle?","No objectionable fumes.",'2.90'),
("Composition of aqua regia?","3 parts hydrochloric acid : 1 part nitric acid; dissolves gold and platinum.",'2.94'),
("Hydrofluoric acid: lab use and first-aid item to keep nearby?","Dissolving porcelain off metal; magnesium oxide ointment.",'2.93'),
("Which polishing agent is not recommended for acrylic, and why?","Rouge — collects in crevices around denture teeth.",'2.100.2'),
("What is Carborundum?","Silicon carbide.",'2.100.9'),
("Hardest abrasive known?","Diamond.",'2.100.10'),
("Typical melting range of chrome alloys, and a suitable flame?","Over 2600 °F; oxyacetylene.",'2.102.4.2'),
]
for q,a,p in E: f('E',q,a,af(2,p))
# ---- F Impressions & Models
F=[
("How is impression compound softened and hardened?","Softened by heat; hardened by cooling.",'2.34.1'),
("Need a separator when pouring gypsum into compound?","No.",'2.34.4'),
("How should a low-fusing wax impression be rinsed?","Carefully with room-temperature water, without touching the tissue side.",'2.35.2'),
("Principal ingredients of impression paste?","Zinc oxide and eugenol (or lauric acid).",'2.36.1'),
("Most accurate elastomeric impression materials?","Polyethers and polysiloxanes.",'2.37.4'),
("Why pour condensation silicones promptly?","Shrinkage occurs after about 30 minutes.",'2.37.2.3'),
("Pour polysulfide and condensation silicone impressions within?","25 minutes.",'2.38.1'),
("Why can't polyether impressions be die-plated?","Highly hydrophilic; water sorption changes dimensions.",'2.38.2'),
("Agar vs alginate hydrocolloid?","Agar is reversible; alginate is irreversible.",'2.40'),
("What happens to gelled hydrocolloid exposed to water or air?","It changes dimensions.",'2.40.2.3.1'),
("Effect of hydrocolloid exudate on gypsum?","Makes the gypsum surface soft and chalky.",'2.40.2.3.2'),
]
for q,a,p in F: f('F',q,a,af(2,p))
f('F',"How are alginate impressions disinfected?","Spray, then sealed plastic bag — not immersed.",af(1,'1.25.2'))
f('F',"Pour alginate impressions within how long?","12 minutes.",af(1,'1.25.3'))
f('F',"Which disinfectant should addition silicone/polysulfide NOT be immersed in?","Neutral glutaraldehyde.",af(1,'1.26'))
f('F',"How are polyether impressions disinfected?","Like hydrocolloids — spray, not immersion; chlorine-based, short time.",af(1,'1.27'))
f('F',"How can a contaminated stone cast be disinfected?","0.5% sodium hypochlorite in clear SDS, 30-minute soak.",af(1,'1.32.2'))
f('F',"From what is slurry dihydrate solution prepared?","Freshly set stone never poured against a contaminated impression.",af(1,'1.31'))
# ---- G Safe Working Practices
G=[
(1,"Maximum compressed air pressure for cleaning?","30 lb/in².",'1.19.2'),
(1,"Recommended Bunsen burner flame height?","About 3 inches.",'1.16.3'),
(1,"Rule for eye protection?","Wear glasses/goggles whenever any possibility of eye damage exists.",'1.10'),
(1,"Sharp vs dull instruments — which is more dangerous?","Dull.",'1.14'),
(1,"Rule about running lathes?","Never leave unattended; turn off when not in use.",'1.15.1'),
(1,"Where to use acids with toxic fumes?","Under a power exhaust hood.",'1.17'),
(1,"Hepatitis B risk for lab technicians?","Almost three times the general population.",'1.21.2'),
(1,"Key infection control concept in the lab?","Clean and disinfect contaminated items before reaching the production area.",'1.20.2'),
(1,"What is the receiving area?","A separate engineering control for disinfecting incoming items.",'1.23.1'),
(1,"PPE in the receiving area?","Gloves, mask, eye protection, smocks.",'1.24'),
(1,"Disinfecting incoming prostheses?","Rinse/scrub, ultrasonic cleaner, then tuberculocidal disinfectant.",'1.28.2'),
(1,"How is a finished prosthesis returned?","Cleaned, disinfected, bagged.",'1.30'),
]
for ch,q,a,p in G: f('G',q,a,af(ch,p))
f('G',"Universal precautions mean?","Treat all human blood and OPIM as infectious.",BBP)
f('G',"Hepatitis B vaccine: when must it be offered?","After BBP training, within 10 days of initial assignment to a job with occupational exposure.",BBP)
f('G',"Define exposure incident.","Eye, mouth, mucous membrane, non-intact skin or parenteral contact with blood/OPIM.",BBP)
f('G',"How often is BBP training?","At assignment, annually, and when tasks change.",BBP)
f('G',"How many SDS sections, and which is first-aid?","16; Section 4.",SDS)
f('G',"Which SDS section covers PPE?","Section 8.",SDS)
f('G',"HazCom pictogram format?","A symbol on a white background framed by a red border.",PIC)
f('G',"Pictogram for skin corrosion or corrosive to metals?","Corrosion.",PIC)
f('G',"Pictogram for gases under pressure?","Gas cylinder.",PIC)
cards=[]
cnt={}
for d,q,a,s in C:
    cnt[d]=cnt.get(d,0)+1
    cards.append({"id":f"comp-{d}-{cnt[d]:03d}","exam":"comprehensive","domain":d,"type":"flash","verified":False,"front":q,"back":a,"source":s})
json.dump(cards,open('content/comprehensive.json','w'),indent=1)
print(cnt,len(cards))

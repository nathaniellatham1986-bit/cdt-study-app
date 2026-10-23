AF1="AFPAM 47-103 Vol 1 (restored ed., dentaltechnology.org)"
AF2="AFPAM 47-103 Vol 2 (restored ed., dentaltechnology.org)"
B="https://dentaltechnology.org/en/reference-library/air-force-dental-laboratory-manual/volume-%d/chapter-%02d"
WEB={
"BBP":{"ref":"OSHA Fact Sheet: Bloodborne Pathogens Standard (29 CFR 1910.1030)","url":"https://www.osha.gov/sites/default/files/publications/bbfact01.pdf"},
"SDS":{"ref":"OSHA Brief: Hazard Communication Standard Safety Data Sheets (OSHA 3514)","url":"https://www.osha.gov/sites/default/files/publications/OSHA3514.pdf"},
"PIC":{"ref":"OSHA QuickCard: Hazard Communication Standard Pictogram (OSHA 3491)","url":"https://www.osha.gov/sites/default/files/publications/OSHA3491QuickCardPictogram.pdf"},
"FDAC":{"ref":"FDA: Classify Your Medical Device","url":"https://www.fda.gov/medical-devices/overview-device-regulation/classify-your-medical-device"},
"QMSR":{"ref":"FDA: Quality Management System Regulation (QMSR)","url":"https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-management-system-regulation-qmsr"}}
def src(s):
    """'1.2:2.5.1' = Vol 1 ch 2 para 2.5.1 ; 'BBP' = web source"""
    if s in WEB: return dict(WEB[s])
    vc,para=s.split(':'); v,c=map(int,vc.split('.'))
    return {"ref":AF1 if v==1 else AF2,"loc":"para "+para,"url":B%(v,c)}
import random
def mcqs(rows,exam,prefix):
    out=[];n={}
    for d,stem,ok,wrong,s in rows:
        w=[x.strip() for x in wrong.split(';')]; assert len(w)==3,(stem,w)
        r=random.Random(stem); opts=w[:]; i=r.randrange(4); opts.insert(i,ok)
        n[d]=n.get(d,0)+1; S=src(s)
        out.append({"id":f"{prefix}-{d}-{n[d]:03d}","exam":exam,"domain":d,"type":"mcq","verified":False,
          "stem":stem,"options":opts,"answer":i,"explanation":f"Correct: {ok}. ({S.get('loc','see source')})","source":S})
    return out,n
def flashes(rows,exam,prefix):
    out=[];n={}
    for d,q,a,s in rows:
        n[d]=n.get(d,0)+1
        out.append({"id":f"{prefix}-{d}-{n[d]:03d}","exam":exam,"domain":d,"type":"flash","verified":False,"front":q,"back":a,"source":src(s)})
    return out,n

"""Build content/<exam>.json from tools/items/<exam>.txt.
Line formats (| separated):  F|domain|src|front|back   M|domain|src|stem|correct|wrong1;wrong2;wrong3
src: 'V.C:para' (AFPAM 47-103 vol V chapter C) or a WEB key in srcs.py. Lines starting with # are ignored."""
import json,sys,os
sys.path.insert(0,os.path.dirname(__file__)); from srcs import mcqs,flashes
exam,prefix=sys.argv[1],sys.argv[2]
F=[];M=[]
for ln in open(os.path.join(os.path.dirname(__file__),'items',exam+'.txt')):
    ln=ln.strip()
    if not ln or ln.startswith('#'):continue
    p=[x.strip() for x in ln.split('|')]
    if p[0]=='F': F.append((p[1],p[3],p[4],p[2]))
    elif p[0]=='M': M.append((p[1],p[3],p[4],p[5],p[2]))
    else: raise SystemExit('bad line: '+ln)
f,nf=flashes(F,exam,prefix+'f'); m,nm=mcqs(M,exam,prefix+'q')
out=sys.argv[3] if len(sys.argv)>3 else exam
json.dump(f+m,open(os.path.join(os.path.dirname(__file__),'..','content',out+'.json'),'w'),indent=1,ensure_ascii=False)
print(exam,'flash',len(f),dict(sorted(nf.items())),'mcq',len(m),dict(sorted(nm.items())))

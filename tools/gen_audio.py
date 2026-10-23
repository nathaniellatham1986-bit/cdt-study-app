#!/usr/bin/env python3
"""Pre-generate natural TTS clips with Piper (en_US-lessac-high) -> audio/<exam>/*.mp3.
Incremental: clip names include a hash of the spoken text; existing clips are reused, orphans removed.
Writes audio/<exam>/index.json: {id: [questionFile, answerFile]}.
Run: /workspace/pvenv/bin/python tools/gen_audio.py  (needs ffmpeg; MODEL env to override voice)."""
import glob, hashlib, json, os, re, subprocess, sys, wave, io
from concurrent.futures import ProcessPoolExecutor
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.environ.get('MODEL', '/workspace/piper/en_US-lessac-high.onnx')
L = 'ABCD'

def extra(c):  # explanation beyond the restated answer, minus citation parentheticals
    e = re.sub(r'\((see source|para[^)]*|section[^)]*)\)', '', c.get('explanation', '')).strip()
    e = re.sub(r'^Correct:\s*' + re.escape(c['options'][c['answer']].rstrip('.')) + r'\.?', '', e).strip()
    return e

def parts(c):  # keep in sync with speechParts in js/quiz.js
    if c['type'] == 'mcq':
        q = c['stem'] + ' ' + ' '.join(f"{L[i]}: {o}." for i, o in enumerate(c['options']))
        a = f"The answer is {L[c['answer']]}: {c['options'][c['answer']]}."
        x = extra(c)
        return [q, a + (' ' + x if x else '')]
    return [c['front'], c['back']]

def speakable(t):  # light pronunciation help; does not change the hash key
    t = re.sub(r'(\d)\s*°\s*C', r'\1 degrees Celsius', t); t = re.sub(r'(\d)\s*°\s*F', r'\1 degrees Fahrenheit', t)
    t = t.replace('°', ' degrees').replace('µm', ' microns').replace('μm', ' microns').replace(' mm', ' millimeters')
    t = re.sub(r'\bvs\.', 'versus', t); t = re.sub(r'\be\.g\.', 'for example', t); t = re.sub(r'\bi\.e\.', 'that is', t)
    return t

_voice = None
def synth(job):
    global _voice
    text, out = job
    if _voice is None:
        import onnxruntime as ort
        _IS = ort.InferenceSession
        def IS(path, sess_options=None, **kw):  # one thread per worker; workers = cores
            o = sess_options or ort.SessionOptions(); o.intra_op_num_threads = 1; o.inter_op_num_threads = 1
            return _IS(path, sess_options=o, **kw)
        ort.InferenceSession = IS
        from piper import PiperVoice
        _voice = PiperVoice.load(MODEL)
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        _voice.synthesize_wav(speakable(text), w)
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'pipe:0', '-ac', '1', '-ar', '22050',
                        '-c:a', 'libmp3lame', '-b:a', '40k', out + '.tmp.mp3'], input=buf.getvalue())
    if p.returncode: raise RuntimeError(out)
    os.replace(out + '.tmp.mp3', out)
    return out

def main():
    items = [x for f in sorted(glob.glob(os.path.join(ROOT, 'content/*.json'))) for x in json.load(open(f))]
    idx, jobs, keep = {}, [], set()
    for c in items:
        d = os.path.join(ROOT, 'audio', c['exam']); os.makedirs(d, exist_ok=True)
        names = []
        for k, t in zip('qa', parts(c)):
            n = f"{c['id']}-{k}-{hashlib.sha1(t.encode()).hexdigest()[:8]}.mp3"
            p = os.path.join(d, n); names.append(n); keep.add(p)
            if not os.path.exists(p): jobs.append((t, p))
        idx.setdefault(c['exam'], {})[c['id']] = names
    print(f'{len(keep)} clips, {len(jobs)} to generate', flush=True)
    with ProcessPoolExecutor(int(os.environ.get('JOBS', os.cpu_count()))) as ex:
        for i, _ in enumerate(ex.map(synth, jobs, chunksize=4)):
            if i % 200 == 0: print(i, flush=True)
    for p in glob.glob(os.path.join(ROOT, 'audio/*/*.mp3')):
        if p not in keep: os.remove(p)
    for e, m in idx.items():
        json.dump(m, open(os.path.join(ROOT, 'audio', e, 'index.json'), 'w'), separators=(',', ':'))
    print('done')

if __name__ == '__main__': main()

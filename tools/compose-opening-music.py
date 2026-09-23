"""Original, deterministic instrumental sketches; no samples or external services."""
from pathlib import Path
import json
import wave
import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parents[1] / 'assets' / 'music' / 'opening-demos'
OUT.mkdir(parents=True, exist_ok=True)
RNG = np.random.default_rng(230926)

def voice(note, seconds, kind):
    t = np.arange(int(seconds * SR)) / SR
    f = 440 * 2 ** ((note - 69) / 12)
    result = np.zeros(len(t))
    if kind == 'pluck':
        for h in range(1, 8):
            result += np.sin(2*np.pi*f*h*t + .035*h) * (1/h**1.8) * np.exp(-t*(1.35+.55*h))
        result *= 1-np.exp(-t*200)
    elif kind == 'piano':
        for h, weight in enumerate([1, .27, .13, .055, .028], 1):
            partial = f*h*(1+.00005*h*h)
            result += weight*np.sin(2*np.pi*partial*t)*np.exp(-t*(.7+.22*h))
        result *= 1-np.exp(-t*130)
    elif kind == 'pad':
        for detune in [-.0015, .0015]:
            result += .45*np.sin(2*np.pi*f*(1+detune)*t)
            result += .08*np.sin(2*np.pi*f*2*(1+detune)*t)
        result *= np.minimum(t/.9, 1) * np.minimum((seconds-t)/1.3, 1)
    else:
        result = np.sin(2*np.pi*f*t)*np.exp(-t*1.1)*(1-np.exp(-t*65))
    # No abrupt note endings, even when a tail crosses the loop boundary.
    release = min(int(.12*SR), len(t))
    result[-release:] *= np.linspace(1, 0, release)
    return result

def render(spec):
    beat = 60/spec['bpm']
    seconds = spec['bars']*4*beat
    total = round(seconds*SR)
    mix = np.zeros((total, 2), dtype=np.float64)
    def add(note, start, length, level, kind, pan=0):
        mono = voice(note, length, kind)*level
        left, right = np.sqrt((1-pan)/2), np.sqrt((1+pan)/2)
        index = (np.arange(len(mono)) + round(start*SR)) % total
        np.add.at(mix[:,0], index, mono*left)
        np.add.at(mix[:,1], index, mono*right)
    for bar in range(spec['bars']):
        start = bar*4*beat
        chord = spec['chords'][bar % len(spec['chords'])]
        # Quiet bass and open arpeggios leave room for reading.
        add(chord[0]-12, start, 3*beat, .105, 'bass', -.05)
        pattern = [0, 2, 1, 3] if spec['sparse'] else [0, 2, 1, 3, 2, 1]
        times = [0, 1.5, 2.5, 3.5] if spec['sparse'] else [0, .75, 1.5, 2, 2.75, 3.5]
        for j, when in enumerate(times):
            add(chord[pattern[j]], start+when*beat, 3.3, .105 if j else .13, 'pluck', -.34)
        for n in chord[1:3]:
            add(n, start, 4.6*beat, spec['pad'], 'pad', .18)
        for offset, note, duration in spec['melody'][bar % len(spec['melody'])]:
            add(note, start+offset*beat, min(duration*beat+1,5), .185, 'piano', .22)
    # Circular, very soft room reflections keep tails continuous on repeat.
    dry=mix.copy()
    for delay,level in [(.083,.10),(.137,.075),(.229,.055),(.347,.04),(.491,.025)]:
        mix += np.roll(dry[:,::-1], round(delay*SR), axis=0)*level
    mix -= mix.mean(axis=0)
    rms = np.sqrt(np.mean(mix**2))
    gain = min(10**(-21/20)/max(rms,1e-9), .70/max(np.max(np.abs(mix)),1e-9))
    mix *= gain
    # Tiny fades remove discontinuities in players which don't loop sample-exactly.
    ramp=round(.012*SR)
    mix[:ramp] *= np.linspace(0,1,ramp)[:,None]
    mix[-ramp:] *= np.linspace(1,0,ramp)[:,None]
    path=OUT/(spec['file']+'.wav')
    assert not path.exists(), f'Refusing to overwrite {path}'
    pcm=(np.clip(mix,-1,1)*32767).astype('<i2')
    with wave.open(str(path),'wb') as out:
        out.setnchannels(2);out.setsampwidth(2);out.setframerate(SR);out.writeframes(pcm.tobytes())
    return {'file':path.name,'title':spec['title'],'seconds':round(seconds,2),'bpm':spec['bpm'],
            'peak_dbfs':round(float(20*np.log10(np.max(np.abs(mix)))),2),
            'rms_dbfs':round(float(20*np.log10(np.sqrt(np.mean(mix**2)))),2),
            'bytes':path.stat().st_size,'scene':spec['scene']}

D=[50,57,62,66]; A=[45,57,61,64]; B=[47,54,59,62]; G=[43,55,59,62]
tracks=[
 dict(file='01-coming-home',title='Coming Home',bpm=64,bars=16,sparse=True,pad=.018,
      chords=[D,A,B,G,D,A,G,G],
      melody=[[(1,69,1),(2.5,66,1)],[(1,64,2)],[(.5,66,1),(2,62,2)],[],
              [(1,66,1),(2.5,69,1)],[(.5,73,1),(2.5,69,1)],[(1,67,1),(2.5,66,1)],[(1,64,2)]],
      scene='Sea reveal through thoughts of Lola; fade out at conductor call.'),
 dict(file='02-small-kindness',title='A Small Kindness',bpm=68,bars=8,sparse=False,pad=.014,
      chords=[G,D,A,D,G,B,A,D],
      melody=[[(.5,67,1),(2,69,1)],[(1,66,2)],[(.5,64,1),(2.5,61,1)],[(1,62,2)],
              [(.5,67,1),(2,71,1)],[(1,69,1),(2.5,66,1)],[(1,64,2)],[(.5,66,1),(2,62,2)]],
      scene='Driver waives the fare through drop-off and “Ingat.”'),
 dict(file='03-old-neighborhood',title='The Old Neighborhood',bpm=60,bars=16,sparse=True,pad=.023,
      chords=[D,G,B,A,D,G,A,G],
      melody=[[(.5,66,1),(2,69,1)],[(1,67,1),(2.5,62,1)],[(1,66,2)],[(1,64,2)],
              [(.5,62,1),(2,66,1),(3,69,.7)],[(1,71,1),(2.5,67,1)],[(1,69,1),(2.5,64,1)],[]],
      scene='Hill, childhood memories, both grief choices and neighbor visit; stop before hammer.'),
 dict(file='04-rowan-reunion',title='A Familiar Door',bpm=62,bars=16,sparse=True,pad=.028,
      chords=[D,A,B,G,D,G,A,G],
      melody=[[(0,69,2),(2.5,66,1)],[(1,64,2)],[(.5,66,1),(2,69,1)],[(1,67,2)],
              [(.5,66,1),(2,69,1),(3,74,.8)],[(1,71,2)],[(1,69,1),(2.5,64,1)],[(1,66,2)]],
      scene='Rowan looks up in the special CG; hold softly on his recognition.')
]
if __name__=='__main__':
    report=[render(track) for track in tracks]
    (OUT/'track-details.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

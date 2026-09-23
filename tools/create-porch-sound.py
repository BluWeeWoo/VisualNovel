"""Original synthesized porch ambience and hammer taps; no recorded samples."""
from pathlib import Path
import wave
import json
import numpy as np

SR=44100
SECONDS=24
rng=np.random.default_rng(20260923)
out=Path(__file__).resolve().parents[1]/'assets'/'audio'/'porch'
out.mkdir(parents=True,exist_ok=True)
n=SR*SECONDS
t=np.arange(n)/SR

def colored_noise(exponent):
    frequencies=np.fft.rfftfreq(n,1/SR)
    spectrum=np.fft.rfft(rng.normal(size=n))
    spectrum*=np.maximum(frequencies,45)**(-exponent)
    spectrum[frequencies<55]=0
    spectrum[frequencies>7500]=0
    noise=np.fft.irfft(spectrum,n)
    return noise/np.std(noise)

wind=colored_noise(.85)*(.006+.002*np.sin(2*np.pi*t/10))
sea=colored_noise(.45)*(.003+.002*(.5+.5*np.sin(2*np.pi*t/8))**2)
bed=np.column_stack([wind+sea, np.roll(wind,800)+np.roll(sea,2000)])

def insert(track, sound, start, level=1, pan=0):
    first=round(start*SR);count=min(len(sound),len(track)-first)
    if count<=0:return
    track[first:first+count,0]+=sound[:count]*level*np.sqrt((1-pan)/2)
    track[first:first+count,1]+=sound[:count]*level*np.sqrt((1+pan)/2)

# Short, distant bird calls with no sustained musical pitch.
for start in [1.1,8.8,16.5,21.3]:
    for offset in [0,.21]:
        u=np.arange(int(.14*SR))/SR
        f=2300+900*np.sin(np.pi*u/.14)+rng.uniform(-220,220)
        phase=2*np.pi*np.cumsum(f)/SR
        chirp=np.sin(phase)*np.sin(np.pi*u/.14)**2
        insert(bed,chirp,start+offset,.009,.65)

hammer=np.zeros_like(bed)
for start,level in [(2,.62),(2.58,.72),(3.18,.66),(7.0,.68),(7.65,.60),(12.3,.64),(12.93,.73),(13.61,.61)]:
    u=np.arange(int(.65*SR))/SR
    strike=np.zeros_like(u)
    # Inharmonic wood/body resonances with a small metal contact click.
    for frequency,decay,amplitude in [(175,26,.75),(337,36,.43),(592,49,.22),(1125,65,.08),(2680,110,.04)]:
        strike+=amplitude*np.sin(2*np.pi*frequency*rng.uniform(.98,1.02)*u)*np.exp(-u*decay)
    noise=rng.normal(size=len(u))
    strike+=noise*np.exp(-u*190)*.28
    strike*=(1-np.exp(-u*3500))
    insert(hammer,strike,start,level*.25,-.16)
    insert(hammer,strike,start+.061,level*.025,.35)
    insert(hammer,strike,start+.112,level*.011,-.4)

# A brief tool scrape between the hammer clusters.
u=np.arange(int(.48*SR))/SR
scrape=rng.normal(size=len(u))
scrape=np.convolve(scrape,np.ones(9)/9,mode='same')
scrape*=np.sin(np.pi*u/.48)**2*(.7+.3*np.sin(2*np.pi*37*u))
insert(hammer,scrape,5.3,.021,-.16)

mix=bed+hammer
fade=round(.7*SR)
mix[:fade]*=np.linspace(0,1,fade)[:,None]
mix[-fade:]*=np.linspace(1,0,fade)[:,None]
assert np.isfinite(mix).all()
assert np.max(np.abs(mix))<.95
path=out/'hammer-and-seaside-outdoors.wav'
assert not path.exists(),'Do not overwrite an existing take'
pcm=(mix*32767).astype('<i2')
with wave.open(str(path),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes(pcm.tobytes())
report={'file':str(path),'seconds':SECONDS,'sample_rate':SR,'channels':2,
        'peak_dbfs':round(float(20*np.log10(np.max(np.abs(mix)))),2),
        'source':'Original procedural synthesis; no external samples; no music',
        'hammer_times_seconds':[2,2.58,3.18,7,7.65,12.3,12.93,13.61]}
(out/'sound-details.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=True))

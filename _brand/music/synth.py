"""Original royalty-free background tracks, synthesized from scratch (no samples). python3 synth.py name bpm seconds key mood"""
import numpy as np, sys, subprocess
from scipy.signal import butter, lfilter
SR=44100
def env(n,a,d,s,r,sl):
    a,d,r=int(a*SR),int(d*SR),int(r*SR); e=np.ones(n)*s
    e[:a]=np.linspace(0,1,a); e[a:a+d]=np.linspace(1,s,len(e[a:a+d]))
    if r: e[-r:]*=np.linspace(1,0,r)
    return e
def lp(x,f): b,a=butter(2,f/(SR/2)); return lfilter(b,a,x)
def hp(x,f): b,a=butter(2,f/(SR/2),'high'); return lfilter(b,a,x)
def saw(f,n,det=0): t=np.arange(n)/SR; return sum(2*((t*f*(1+d))%1)-1 for d in (-det,0,det))/3
def mtof(m): return 440*2**((m-69)/12)
def track(name,bpm,secs,root,prog,style):
    N=int(secs*SR); out=np.zeros((N,)); beat=60/bpm; rng=np.random.default_rng(len(name))
    def add(sig,t0):
        i=int(t0*SR); j=min(N,i+len(sig));
        if i<N: out[i:j]+=sig[:j-i]
    bars=int(secs/(4*beat))+1
    for b in range(bars):
        ch=prog[b%len(prog)]; t_bar=b*4*beat
        # pad
        n=int(4*beat*SR); pad=sum(saw(mtof(root+12+c),n,0.004) for c in ch)/len(ch)
        pad=lp(pad,1400 if style=='energetic' else 900)*env(n,0.25,0.3,0.8,0.4,0)*0.16; add(pad,t_bar)
        # bass
        for k in range(8 if style=='energetic' else 4):
            st=t_bar+k*beat*(0.5 if style=='energetic' else 1); m=root-12+ch[0]
            nn=int(beat*0.45*SR); bs=np.sin(2*np.pi*mtof(m)*np.arange(nn)/SR)+0.3*saw(mtof(m),nn)
            add(lp(bs,500)*env(nn,0.005,0.1,0.6,0.08,0)*0.32,st)
        # arp pluck
        steps=16 if style=='energetic' else 8; pat=[0,1,2,1,2,0,2,1]
        for k in range(steps):
            st=t_bar+k*4*beat/steps; m=root+24+ch[pat[k%8]%len(ch)]+(12 if k%8==6 else 0)
            nn=int(0.25*SR); pl=saw(mtof(m),nn,0.002); pl=lp(pl,3000)*np.exp(-np.arange(nn)/SR*14)*0.09; add(pl,st)
        # drums
        for k in range(4):
            st=t_bar+k*beat; nn=int(0.35*SR); t=np.arange(nn)/SR
            f=50+90*np.exp(-t*30); kick=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*0.6; add(kick,st)
            if k%2==1:
                nn2=int(0.2*SR); cl=hp(rng.standard_normal(nn2),900)*np.exp(-np.arange(nn2)/SR*22)*(0.22 if style=='energetic' else 0.12); add(cl,st)
        for k in range(8 if style!='energetic' else 16):
            st=t_bar+k*4*beat/(8 if style!='energetic' else 16); nn=int(0.05*SR)
            hh=hp(rng.standard_normal(nn),7000)*np.exp(-np.arange(nn)/SR*80)*(0.10 if k%2 else 0.05); add(hh,st)
    # sidechain-ish pump
    t=np.arange(N)/SR; ph=(t%beat)/beat; out*=0.65+0.35*np.minimum(1,ph*4)
    out=np.tanh(out*1.4); out/=np.max(np.abs(out))*1.12
    st=np.stack([out,np.roll(out,int(0.012*SR))*0.96],1)
    wav=f'{name}.wav'; import wave
    w=wave.open(wav,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype('<i2').tobytes()); w.close()
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wav,'-b:a','192k',f'{name}.mp3']); import os; os.remove(wav)
if __name__=='__main__':
    # A: energetic, bright (BF offers). B: calm tech, steady (checklists / explainers)
    track('levin-neon-pulse',122,16,57,[[0,4,7],[ -3,0,4],[5,9,12],[7,11,14]],'energetic')
    track('levin-clear-ledger',100,16,60,[[0,4,7,11],[9,12,16],[5,9,12,16],[7,11,14]],'calm')

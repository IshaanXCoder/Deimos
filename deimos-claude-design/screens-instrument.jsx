// screens-instrument.jsx — "Instrument" direction: dark/light, mono-first, terminal/oscilloscope feel
// Uses monospace display, ticker strips, labeled readouts. Think Bloomberg Terminal / Braun / Teenage Engineering.

const SI = {}; // namespace

SI.Mono = (p) => <span style={{fontFamily:'"JetBrains Mono",ui-monospace,monospace', ...(p.style||{})}}>{p.children}</span>;

// ── Shared chrome ───────────────────────────────────────────────
SI.Bar = ({theme, title, onBack, right}) => (
  <div style={{
    display:'flex',alignItems:'center',padding:'14px 20px',gap:12,
    borderBottom:`1px solid ${theme.border}`,
    background: theme.bg,
  }}>
    {onBack ? (
      <button onClick={onBack} style={{background:'none',border:'none',color:theme.text,padding:4,cursor:'pointer',display:'flex'}}><Icon name="back" size={20}/></button>
    ) : (
      <div style={{width:8,height:8,background:theme.accent}}/>
    )}
    <div style={{flex:1,fontFamily:'"JetBrains Mono",monospace',fontSize:11,letterSpacing:2,textTransform:'uppercase',color:theme.textDim}}>
      {title}
    </div>
    {right}
  </div>
);

SI.Tag = ({children, theme, invert, accent}) => (
  <span style={{
    display:'inline-flex',alignItems:'center',gap:4,
    padding:'3px 8px',
    fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1.5,textTransform:'uppercase',
    border:`1px solid ${accent?theme.accent:theme.border}`,
    color: invert?theme.onChip:(accent?theme.accent:theme.textDim),
    background: invert?theme.chip:'transparent',
  }}>{children}</span>
);

SI.BigNum = ({value, unit, theme, color}) => (
  <div style={{display:'flex',alignItems:'baseline',gap:6,lineHeight:1}}>
    <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:52,fontWeight:500,letterSpacing:-2,color:color||theme.text,fontVariantNumeric:'tabular-nums'}}>{value}</span>
    <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:14,color:theme.textDim}}>{unit}</span>
  </div>
);

SI.KV = ({k, v, theme, mono=true}) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px dashed ${theme.border}`}}>
    <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,letterSpacing:1,textTransform:'uppercase',color:theme.textDim}}>{k}</span>
    <span style={{fontFamily: mono?'"JetBrains Mono",monospace':'"Inter Tight",sans-serif',fontSize:13,color:theme.text,fontVariantNumeric:'tabular-nums'}}>{v}</span>
  </div>
);

// Tiny sparkline
SI.Spark = ({points, theme, color, w=80, h=22}) => {
  const max = Math.max(...points), min = Math.min(...points);
  const path = points.map((p,i)=>{
    const x = (i/(points.length-1))*w;
    const y = h - ((p-min)/(max-min||1))*h;
    return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return <svg width={w} height={h} style={{overflow:'visible'}}>
    <path d={path} fill="none" stroke={color||theme.accent} strokeWidth="1.5"/>
  </svg>;
};

// ─── Onboarding ──────────────────────────────────────────────
SI.Onboarding = ({theme, onDone}) => (
  <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text,padding:'24px 24px 20px',fontFamily:'"Inter Tight",sans-serif'}}>
    {/* Corner marks */}
    {[[0,0],[1,0],[0,1],[1,1]].map(([a,b],i)=>(
      <div key={i} style={{position:'absolute',top:a?'auto':32,bottom:a?32:'auto',left:b?'auto':24,right:b?24:'auto',
        width:14,height:14,borderTop:a?'none':`1px solid ${theme.text}`,borderBottom:a?`1px solid ${theme.text}`:'none',
        borderLeft:b?'none':`1px solid ${theme.text}`,borderRight:b?`1px solid ${theme.text}`:'none'}}/>
    ))}

    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:20}}>
      <SI.Mono style={{fontSize:10,letterSpacing:2,textTransform:'uppercase',color:theme.textDim}}>DEIMOS · v1.0.0</SI.Mono>
      <SI.Mono style={{fontSize:10,letterSpacing:2,color:theme.textDim}}>SM-M315F</SI.Mono>
    </div>

    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'flex-start',gap:20}}>
      {/* ASCII-ish logo mark */}
      <div style={{
        fontFamily:'"JetBrains Mono",monospace',fontSize:11,lineHeight:1.1,color:theme.textDim,whiteSpace:'pre',
      }}>{`╔═══════╗
║ ▓ ░ ▓ ║
║ ░ ▓ ░ ║
║ ▓ ░ ▓ ║
╚═══════╝`}</div>

      <div>
        <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:40,fontWeight:500,letterSpacing:-1.5,lineHeight:1,color:theme.text}}>DEIMOS</div>
        <div style={{fontSize:16,marginTop:10,color:theme.textDim,maxWidth:280,lineHeight:1.4}}>
          A precision instrument for measuring zero-knowledge proof performance on mobile silicon.
        </div>
      </div>

      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
        <SI.Tag theme={theme}>Poseidon2</SI.Tag>
        <SI.Tag theme={theme}>SHA256</SI.Tag>
        <SI.Tag theme={theme}>Keccak</SI.Tag>
        <SI.Tag theme={theme}>EdDSA</SI.Tag>
        <SI.Tag theme={theme}>+6 more</SI.Tag>
      </div>
    </div>

    <div>
      <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1.5,color:theme.textDim,marginBottom:10,textTransform:'uppercase'}}>── 01/01 CALIBRATE DEVICE ──</div>
      <button onClick={onDone} style={{
        width:'100%',padding:'18px 20px',background:theme.text,color:theme.bg,border:'none',
        fontFamily:'"JetBrains Mono",monospace',fontSize:13,letterSpacing:2,textTransform:'uppercase',
        display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'
      }}>
        <span>▸ Initialize</span>
        <span>→</span>
      </button>
      <div style={{marginTop:14,textAlign:'center',fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1,color:theme.textMuted}}>
        OSS · MIT · BlocSoc IITR
      </div>
    </div>
  </div>
);

// ─── Home / Configurator ────────────────────────────────────
SI.Home = ({theme, state, setState, onRun, onNav}) => {
  const fw = DATA.FRAMEWORKS.find(f=>f.id===state.fw);
  const circ = DATA.CIRCUITS.find(c=>c.id===state.circuit);
  const canRun = state.fw && state.circuit && state.input;

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text,fontFamily:'"Inter Tight",sans-serif'}}>
      {/* Top bar */}
      <div style={{padding:'18px 20px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:`1px solid ${theme.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:24,height:24,background:theme.text,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:8,height:8,background:theme.accent}}/>
          </div>
          <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:14,letterSpacing:1,fontWeight:500}}>DEIMOS</div>
        </div>
        <div style={{display:'flex',gap:4}}>
          <button onClick={()=>onNav('history')} style={{background:'none',border:`1px solid ${theme.border}`,color:theme.text,padding:'6px 10px',fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1.5,cursor:'pointer'}}>HIST</button>
          <button onClick={()=>onNav('compare')} style={{background:'none',border:`1px solid ${theme.border}`,color:theme.text,padding:'6px 10px',fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1.5,cursor:'pointer'}}>CMP</button>
          <button onClick={()=>onNav('device')} style={{background:'none',border:`1px solid ${theme.border}`,color:theme.text,padding:'6px 8px',cursor:'pointer',display:'flex'}}><Icon name="cpu" size={16}/></button>
        </div>
      </div>

      {/* ticker */}
      <div style={{padding:'6px 20px',borderBottom:`1px solid ${theme.border}`,display:'flex',alignItems:'center',gap:16,overflow:'hidden',whiteSpace:'nowrap'}}>
        <SI.Mono style={{fontSize:10,letterSpacing:1.5,color:theme.accent}}>● LIVE</SI.Mono>
        <SI.Mono style={{fontSize:10,color:theme.textDim}}>POSEIDON2·ARKWORKS 179ms</SI.Mono>
        <SI.Mono style={{fontSize:10,color:theme.textDim}}>SHA256·NOIR 690ms</SI.Mono>
        <SI.Mono style={{fontSize:10,color:theme.textDim}}>RESCUE·BBERG 1.98s</SI.Mono>
      </div>

      <div style={{flex:1,overflow:'auto',padding:'20px'}}>
        <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:2,color:theme.textDim,textTransform:'uppercase',marginBottom:4}}>── New Benchmark ──</div>
        <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:28,fontWeight:500,letterSpacing:-1,lineHeight:1.05,marginBottom:24}}>
          Configure<br/>run parameters.
        </div>

        <SI.ConfigRow theme={theme} step="01" label="Framework" value={fw?.name} sub={fw?`${fw.type} · ${fw.lang}`:'Select backend'} onClick={()=>setState({...state, picker:'fw'})}/>
        <SI.ConfigRow theme={theme} step="02" label="Circuit"   value={circ?.name} sub={circ?`${circ.family}`:(state.fw?'Select algorithm':'Select framework first')} disabled={!state.fw} onClick={()=>state.fw && setState({...state, picker:'circuit'})}/>
        <SI.ConfigRow theme={theme} step="03" label="Input"     value={state.input} sub={state.input?'Field vector':(state.circuit?'Select vector':'Select circuit first')} disabled={!state.circuit} onClick={()=>state.circuit && setState({...state, picker:'input'})}/>

        {/* Summary */}
        <div style={{marginTop:24,padding:16,border:`1px solid ${theme.border}`,background:theme.surface}}>
          <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:2,color:theme.textDim,marginBottom:10,textTransform:'uppercase'}}>Run Manifest</div>
          <SI.KV theme={theme} k="Framework" v={fw?.name||'—'}/>
          <SI.KV theme={theme} k="Circuit"   v={circ?.name||'—'}/>
          <SI.KV theme={theme} k="Input"     v={state.input||'—'}/>
          <SI.KV theme={theme} k="Target"    v="SM-M315F"/>
          <SI.KV theme={theme} k="Trials"    v="1"/>
        </div>
      </div>

      {/* CTA */}
      <div style={{padding:'12px 20px 16px',borderTop:`1px solid ${theme.border}`,background:theme.bg,display:'flex',gap:8}}>
        <button disabled={!canRun} onClick={onRun} style={{
          flex:1,padding:'16px',background:canRun?theme.text:theme.surface2,color:canRun?theme.bg:theme.textMuted,
          border:'none',fontFamily:'"JetBrains Mono",monospace',fontSize:12,letterSpacing:2,textTransform:'uppercase',
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,cursor:canRun?'pointer':'not-allowed'
        }}>▸ Execute</button>
        <button onClick={()=>onNav('compare')} style={{
          padding:'16px',background:'transparent',color:theme.text,
          border:`1px solid ${theme.border}`,fontFamily:'"JetBrains Mono",monospace',fontSize:12,letterSpacing:2,textTransform:'uppercase',cursor:'pointer'
        }}>Run All</button>
      </div>
    </div>
  );
};

SI.ConfigRow = ({theme, step, label, value, sub, onClick, disabled}) => (
  <div onClick={disabled?null:onClick} style={{
    padding:'16px 0',borderBottom:`1px solid ${theme.border}`,display:'flex',alignItems:'center',gap:14,
    cursor:disabled?'default':'pointer',opacity:disabled?0.4:1,
  }}>
    <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:theme.textDim,width:22}}>{step}</div>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:2,color:theme.textDim,textTransform:'uppercase'}}>{label}</div>
      <div style={{fontSize:20,fontFamily:'"JetBrains Mono",monospace',fontWeight:500,color:value?theme.text:theme.textMuted,marginTop:2}}>
        {value || '—— ——'}
      </div>
      <div style={{fontSize:12,color:theme.textDim,marginTop:2}}>{sub}</div>
    </div>
    <Icon name="chevronRight" size={16} color={theme.textDim}/>
  </div>
);

// ─── Bottom sheet picker ─────────────────────────────────────
SI.Picker = ({theme, state, setState}) => {
  if(!state.picker) return null;
  const type = state.picker;
  const items = type==='fw' ? DATA.FRAMEWORKS : type==='circuit' ? DATA.CIRCUITS : DATA.INPUTS.map(i=>({id:i,name:i,icon:'code',family:'Vector'}));
  const key = type==='fw' ? 'fw' : type==='circuit' ? 'circuit' : 'input';
  const titleText = type==='fw'?'SELECT FRAMEWORK':type==='circuit'?'SELECT CIRCUIT':'SELECT INPUT';

  return (
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',zIndex:10,display:'flex',alignItems:'flex-end'}} onClick={()=>setState({...state,picker:null})}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'100%',background:theme.bg,color:theme.text,maxHeight:'75%',
        borderTop:`1px solid ${theme.border}`,display:'flex',flexDirection:'column'
      }}>
        <div style={{padding:'16px 20px',borderBottom:`1px solid ${theme.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <SI.Mono style={{fontSize:11,letterSpacing:2,color:theme.textDim}}>{titleText}</SI.Mono>
          <button onClick={()=>setState({...state,picker:null})} style={{background:'none',border:'none',color:theme.text,cursor:'pointer',display:'flex'}}><Icon name="close" size={18}/></button>
        </div>
        <div style={{overflowY:'auto'}}>
          {items.map((it,i)=>{
            const active = state[key]=== (type==='input'?it.id:it.id);
            return (
              <div key={it.id} onClick={()=>setState({...state, [key]: it.id, picker:null})} style={{
                padding:'14px 20px',display:'flex',alignItems:'center',gap:14,
                borderBottom:`1px solid ${theme.border}`,cursor:'pointer',
                background: active?theme.surface2:'transparent'
              }}>
                <SI.Mono style={{fontSize:11,color:theme.textDim,width:28}}>{String(i+1).padStart(2,'0')}</SI.Mono>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:15,fontWeight:500}}>{it.name}</div>
                  {it.lang && <div style={{fontSize:12,color:theme.textDim}}>{it.type} · {it.lang}</div>}
                  {it.family && !it.lang && <div style={{fontSize:12,color:theme.textDim}}>{it.family}</div>}
                </div>
                {active && <div style={{width:8,height:8,background:theme.accent}}/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Running ────────────────────────────────────────────────
SI.Running = ({theme, state, progress}) => {
  const cols = 28, filled = Math.floor(progress*cols);
  const bar = Array.from({length:cols}).map((_,i)=>i<filled?'█':'░').join('');
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text,padding:20}}>
      <SI.Bar theme={theme} title="// RUN · 0x7A3F"/>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:32,padding:'0 4px'}}>
        <div>
          <SI.Mono style={{fontSize:10,letterSpacing:2,color:theme.textDim,textTransform:'uppercase'}}>STATUS</SI.Mono>
          <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:26,fontWeight:500,letterSpacing:-1,marginTop:6,color:theme.accent}}>
            GENERATING PROOF
          </div>
          <div style={{fontSize:14,color:theme.textDim,marginTop:4}}>Constraints compile → witness gen → prove.</div>
        </div>

        <div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <SI.Mono style={{fontSize:10,letterSpacing:2,color:theme.textDim}}>PROGRESS</SI.Mono>
            <SI.Mono style={{fontSize:10,color:theme.text}}>{(progress*100).toFixed(0)}%</SI.Mono>
          </div>
          <SI.Mono style={{fontSize:16,letterSpacing:1,color:theme.accent,display:'block',lineHeight:1}}>{bar}</SI.Mono>
        </div>

        <div style={{border:`1px solid ${theme.border}`,padding:14,background:theme.surface}}>
          <SI.KV theme={theme} k="Framework" v={DATA.FRAMEWORKS.find(f=>f.id===state.fw)?.name || '—'}/>
          <SI.KV theme={theme} k="Circuit"   v={DATA.CIRCUITS.find(c=>c.id===state.circuit)?.name || '—'}/>
          <SI.KV theme={theme} k="Elapsed"   v={`${(progress*179).toFixed(0)}ms`}/>
          <SI.KV theme={theme} k="RAM"       v={`${(progress*4.04).toFixed(2)} MB`}/>
          <SI.KV theme={theme} k="CPU"       v={`${(60+progress*38).toFixed(1)}%`}/>
        </div>

        <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:theme.textDim,lineHeight:1.6}}>
          <div>▸ init framework …ok</div>
          <div>▸ load circuit …ok</div>
          <div>▸ r1cs compile …ok</div>
          <div>▸ witness ←  {progress>0.4?'ok':'…'}</div>
          <div>▸ prove    ←  {progress>0.8?'ok':(progress>0.4?'running':'pending')}</div>
          <div>▸ verify   ←  {progress>=1?'ok':'pending'}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Results ───────────────────────────────────────────────
SI.Results = ({theme, state, onBack, onNav}) => {
  const fw = DATA.FRAMEWORKS.find(f=>f.id===state.fw);
  const circ = DATA.CIRCUITS.find(c=>c.id===state.circuit);
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text}}>
      <SI.Bar theme={theme} title={`${fw?.name||'—'} · ${circ?.name||'—'}`} onBack={onBack} right={
        <div style={{display:'flex',gap:6}}>
          <button style={{background:'none',border:`1px solid ${theme.border}`,color:theme.text,padding:'4px 8px',fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1.5,cursor:'pointer'}}>SHARE</button>
          <button style={{background:'none',border:`1px solid ${theme.border}`,color:theme.text,padding:'4px 8px',fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1.5,cursor:'pointer'}}>SAVE</button>
        </div>
      }/>
      <div style={{flex:1,overflow:'auto',padding:'20px'}}>
        <div style={{padding:'8px 0 20px'}}>
          <SI.Mono style={{fontSize:10,letterSpacing:2,color:theme.accent}}>● COMPLETE · 10:17:42</SI.Mono>
          <div style={{marginTop:10,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:11,color:theme.textDim,letterSpacing:1.5,textTransform:'uppercase'}}>Total Time</div>
              <SI.BigNum value="179" unit="ms" theme={theme}/>
            </div>
            <SI.Spark theme={theme} points={[20,45,30,65,40,85,95,75,90,100,98]} w={90} h={36}/>
          </div>
        </div>

        {/* Dual readout */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:`1px solid ${theme.border}`,background:theme.surface}}>
          <div style={{padding:14,borderRight:`1px solid ${theme.border}`}}>
            <SI.Mono style={{fontSize:10,color:theme.textDim,letterSpacing:1.5,textTransform:'uppercase'}}>Proof Gen</SI.Mono>
            <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:28,fontWeight:500,color:theme.accent,marginTop:4}}>163<span style={{fontSize:14,color:theme.textDim,marginLeft:4}}>ms</span></div>
            <div style={{fontSize:11,color:theme.success,marginTop:4,display:'flex',alignItems:'center',gap:4}}><Icon name="check" size={10}/>verified</div>
          </div>
          <div style={{padding:14}}>
            <SI.Mono style={{fontSize:10,color:theme.textDim,letterSpacing:1.5,textTransform:'uppercase'}}>Verify</SI.Mono>
            <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:28,fontWeight:500,color:theme.accent2,marginTop:4}}>16<span style={{fontSize:14,color:theme.textDim,marginLeft:4}}>ms</span></div>
            <div style={{fontSize:11,color:theme.success,marginTop:4,display:'flex',alignItems:'center',gap:4}}><Icon name="check" size={10}/>verified</div>
          </div>
        </div>

        {/* Metrics list */}
        <div style={{marginTop:20,border:`1px solid ${theme.border}`,padding:14,background:theme.surface}}>
          <SI.Mono style={{fontSize:10,letterSpacing:2,color:theme.textDim,textTransform:'uppercase'}}>Metrics</SI.Mono>
          <div style={{marginTop:6}}>
            <SI.KV theme={theme} k="Proof Size" v="3.59 KB"/>
            <SI.KV theme={theme} k="Peak RAM"   v="4.04 MB"/>
            <SI.KV theme={theme} k="Peak Load"  v="98.1%"/>
            <SI.KV theme={theme} k="Battery Δ"  v="0%"/>
            <SI.KV theme={theme} k="Circuit Sz" v="1,024 gates"/>
            <SI.KV theme={theme} k="Witness"    v="2.1 KB"/>
          </div>
        </div>

        {/* Comparison vs median */}
        <div style={{marginTop:20,border:`1px solid ${theme.border}`,padding:14,background:theme.surface}}>
          <SI.Mono style={{fontSize:10,letterSpacing:2,color:theme.textDim,textTransform:'uppercase'}}>Vs · Median</SI.Mono>
          <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:8}}>
            {[['Arkworks',179,true],['Rapidsnark',232,false],['Barretenberg',1790,false],['RISC Zero',6520,false]].map(([n,v,hi])=>(
              <div key={n} style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:80,fontSize:11,fontFamily:'"JetBrains Mono",monospace',color:hi?theme.text:theme.textDim}}>{n}</div>
                <div style={{flex:1,height:10,background:theme.bg,border:`1px solid ${theme.border}`,position:'relative'}}>
                  <div style={{position:'absolute',inset:0,width:`${Math.min(100,(v/6520)*100)}%`,background:hi?theme.accent:theme.textMuted}}/>
                </div>
                <SI.Mono style={{fontSize:11,color:theme.text,width:54,textAlign:'right'}}>{v<1000?`${v}ms`:`${(v/1000).toFixed(1)}s`}</SI.Mono>
              </div>
            ))}
          </div>
        </div>

        <button onClick={()=>onNav('proof')} style={{
          width:'100%',marginTop:20,padding:14,background:theme.text,color:theme.bg,border:'none',
          fontFamily:'"JetBrains Mono",monospace',fontSize:12,letterSpacing:2,textTransform:'uppercase',cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'space-between'
        }}>
          <span>▸ View Proof Data</span><span>→</span>
        </button>
      </div>
    </div>
  );
};

// ─── Proof data ─────────────────────────────────────────────
SI.Proof = ({theme, onBack}) => (
  <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text}}>
    <SI.Bar theme={theme} title="// PROOF CALLDATA" onBack={onBack} right={
      <button style={{background:'none',border:`1px solid ${theme.border}`,color:theme.text,padding:'4px 8px',fontFamily:'"JetBrains Mono",monospace',fontSize:10,letterSpacing:1.5,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}><Icon name="copy" size={11}/>COPY</button>
    }/>
    <div style={{flex:1,overflow:'auto',padding:20}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
        <div style={{border:`1px solid ${theme.border}`,padding:10}}>
          <SI.Mono style={{fontSize:9,color:theme.textDim,letterSpacing:1.5}}>PROTOCOL</SI.Mono>
          <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:15,marginTop:2}}>groth16</div>
        </div>
        <div style={{border:`1px solid ${theme.border}`,padding:10}}>
          <SI.Mono style={{fontSize:9,color:theme.textDim,letterSpacing:1.5}}>CURVE</SI.Mono>
          <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:15,marginTop:2}}>bn128</div>
        </div>
      </div>
      <div style={{border:`1px solid ${theme.border}`,background:theme.surface,padding:14,fontFamily:'"JetBrains Mono",monospace',fontSize:11,lineHeight:1.55,color:theme.text,whiteSpace:'pre-wrap',wordBreak:'break-all'}}>
        {DATA.PROOF_SAMPLE}
      </div>
      <div style={{marginTop:16,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <button style={{padding:12,background:theme.surface,border:`1px solid ${theme.border}`,color:theme.text,fontFamily:'"JetBrains Mono",monospace',fontSize:11,letterSpacing:1.5,cursor:'pointer'}}>EXPORT JSON</button>
        <button style={{padding:12,background:theme.surface,border:`1px solid ${theme.border}`,color:theme.text,fontFamily:'"JetBrains Mono",monospace',fontSize:11,letterSpacing:1.5,cursor:'pointer'}}>SHARE</button>
      </div>
    </div>
  </div>
);

// ─── History ────────────────────────────────────────────────
SI.History = ({theme, onBack}) => (
  <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text}}>
    <SI.Bar theme={theme} title="// RUN LOG" onBack={onBack} right={<SI.Mono style={{fontSize:10,color:theme.textDim}}>{DATA.HISTORY.length} runs</SI.Mono>}/>
    <div style={{flex:1,overflow:'auto'}}>
      {DATA.HISTORY.map((r,i)=>(
        <div key={r.id} style={{padding:'14px 20px',borderBottom:`1px solid ${theme.border}`,display:'flex',alignItems:'center',gap:12}}>
          <SI.Mono style={{fontSize:10,color:theme.textDim,width:30}}>#{String(DATA.HISTORY.length-i).padStart(3,'0')}</SI.Mono>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:14,fontWeight:500}}>{r.circuit}</span>
              <span style={{fontSize:11,color:theme.textDim}}>·</span>
              <span style={{fontSize:12,color:theme.textDim,fontFamily:'"JetBrains Mono",monospace'}}>{r.fw}</span>
            </div>
            <SI.Mono style={{fontSize:10,color:theme.textMuted,letterSpacing:1}}>{r.date.toUpperCase()} · {r.input.toUpperCase()}</SI.Mono>
          </div>
          {r.status==='ok' ? (
            <div style={{textAlign:'right'}}>
              <SI.Mono style={{fontSize:14,color:theme.text,fontWeight:500}}>{r.total<1000?`${r.total}ms`:`${(r.total/1000).toFixed(2)}s`}</SI.Mono>
              <div style={{fontSize:10,color:theme.textDim,fontFamily:'"JetBrains Mono",monospace'}}>P{r.gen} V{r.ver}</div>
            </div>
          ) : (
            <SI.Tag theme={theme} accent><span style={{color:theme.accent}}>FAIL</span></SI.Tag>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── Compare (Run all) ─────────────────────────────────────
SI.Compare = ({theme, onBack}) => (
  <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text}}>
    <SI.Bar theme={theme} title="// CROSS-FRAMEWORK" onBack={onBack}/>
    <div style={{flex:1,overflow:'auto',padding:20}}>
      <SI.Mono style={{fontSize:10,letterSpacing:2,color:theme.textDim,textTransform:'uppercase'}}>POSEIDON2 · INPUT 1F</SI.Mono>
      <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:22,fontWeight:500,letterSpacing:-0.5,marginTop:6,marginBottom:20}}>
        5 frameworks benched.
      </div>

      {DATA.COMPARE.map((r,i)=>{
        const fw = DATA.FRAMEWORKS.find(f=>f.id===r.fw);
        const max = Math.max(...DATA.COMPARE.map(x=>x.total));
        const w = (r.total/max)*100;
        const winner = r.rank===1;
        return (
          <div key={r.fw} style={{marginBottom:14,padding:'12px 14px',border:`1px solid ${winner?theme.accent:theme.border}`,background:theme.surface}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <SI.Mono style={{fontSize:11,color:winner?theme.accent:theme.textDim,letterSpacing:1}}>#{r.rank}</SI.Mono>
                <span style={{fontFamily:'"JetBrains Mono",monospace',fontSize:15,fontWeight:500}}>{fw?.name}</span>
                {winner && <SI.Tag theme={theme} invert>FASTEST</SI.Tag>}
              </div>
              <SI.Mono style={{fontSize:14,color:theme.text,fontWeight:500}}>{r.total<1000?`${r.total}ms`:`${(r.total/1000).toFixed(2)}s`}</SI.Mono>
            </div>
            <div style={{height:4,background:theme.bg,border:`1px solid ${theme.border}`,position:'relative'}}>
              <div style={{position:'absolute',inset:0,width:`${w}%`,background:winner?theme.accent:theme.text}}/>
            </div>
            <div style={{display:'flex',gap:14,marginTop:8}}>
              <SI.Mono style={{fontSize:10,color:theme.textDim}}>GEN {r.gen}ms</SI.Mono>
              <SI.Mono style={{fontSize:10,color:theme.textDim}}>VER {r.ver}ms</SI.Mono>
              <SI.Mono style={{fontSize:10,color:theme.textDim}}>MEM {r.mem}MB</SI.Mono>
              <SI.Mono style={{fontSize:10,color:theme.textDim}}>PROOF {r.proof}KB</SI.Mono>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Device ────────────────────────────────────────────────
SI.Device = ({theme, onBack}) => (
  <div style={{height:'100%',display:'flex',flexDirection:'column',background:theme.bg,color:theme.text}}>
    <SI.Bar theme={theme} title="// DEVICE · 0xM315F" onBack={onBack}/>
    <div style={{flex:1,overflow:'auto',padding:20}}>
      <div style={{padding:'16px 0 20px',borderBottom:`1px solid ${theme.border}`}}>
        <SI.Mono style={{fontSize:10,color:theme.textDim,letterSpacing:2,textTransform:'uppercase'}}>Target</SI.Mono>
        <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:24,fontWeight:500,marginTop:4}}>SM-M315F</div>
        <div style={{fontSize:13,color:theme.textDim}}>Samsung · Android 12 · 8-core</div>
      </div>

      <div style={{padding:'16px 0',borderBottom:`1px solid ${theme.border}`}}>
        <SI.Mono style={{fontSize:10,color:theme.textDim,letterSpacing:2,textTransform:'uppercase',marginBottom:8,display:'block'}}>Hardware</SI.Mono>
        <SI.KV theme={theme} k="Chipset"    v="Helio G80"/>
        <SI.KV theme={theme} k="Cores"      v="8"/>
        <SI.KV theme={theme} k="RAM"        v="5.44 GB"/>
        <SI.KV theme={theme} k="Storage"    v="128 GB"/>
        <SI.KV theme={theme} k="OS"         v="Android 12"/>
        <SI.KV theme={theme} k="Build"      v="SP1A.210812.016"/>
      </div>

      <div style={{padding:'16px 0',borderBottom:`1px solid ${theme.border}`}}>
        <SI.Mono style={{fontSize:10,color:theme.textDim,letterSpacing:2,textTransform:'uppercase',marginBottom:8,display:'block'}}>Live</SI.Mono>
        <SI.KV theme={theme} k="Battery"    v="45%"/>
        <SI.KV theme={theme} k="Temp"       v="34°C"/>
        <SI.KV theme={theme} k="Free RAM"   v="2.1 GB"/>
        <SI.KV theme={theme} k="Throttle"   v="none"/>
      </div>

      <div style={{padding:'16px 0'}}>
        <SI.Mono style={{fontSize:10,color:theme.textDim,letterSpacing:2,textTransform:'uppercase',marginBottom:8,display:'block'}}>Preferences</SI.Mono>
        <SI.KV theme={theme} k="Trials"     v="1"/>
        <SI.KV theme={theme} k="Warm-up"    v="off"/>
        <SI.KV theme={theme} k="Telemetry"  v="anonymous"/>
        <SI.KV theme={theme} k="Submit"     v="ask"/>
      </div>
    </div>
  </div>
);

window.SI = SI;

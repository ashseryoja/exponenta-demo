import React, { useEffect, useRef, useState } from 'react';
import '@fontsource-variable/noto-sans-armenian';
import { ArrowUpRight, ArrowDown, ArrowRight, ArrowCounterClockwise, Hand, InstagramLogo, Plus, Minus } from '@phosphor-icons/react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const A=import.meta.env.BASE_URL+'assets/';
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function ProductScene({onReady, intro, spin, reset, interactive}) {
 const mount=useRef(null), values=useRef({intro,spin,reset,interactive});
 values.current={intro,spin,reset,interactive};
 useEffect(()=>{
  let renderer, model, alive=true, raf, dragging=false, previous=0, dragY=0, gestureTravel=0, flourishStart=-10000, flourishTurns=0, lastReset=0, start=performance.now();
  const el=mount.current;
  try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'}); } catch { onReady('error'); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7)); renderer.setClearColor(0x000000,0); renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.12;
  el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(32,1,.1,100); camera.position.set(0,0,5.7);
  const pmrem=new THREE.PMREMGenerator(renderer), room=new RoomEnvironment(); const env=pmrem.fromScene(room,.04); scene.environment=env.texture; room.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff,0xe8cadd,2.5));
  const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,4,5);scene.add(key);
  const pink=new THREE.DirectionalLight(0xffbde0,1.2);pink.position.set(-4,0,2);scene.add(pink);
  const group=new THREE.Group();scene.add(group);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();};
  resize(); const observer=new ResizeObserver(resize);observer.observe(el);
  new GLTFLoader().load(A+'exponenta.glb',gltf=>{
   if(!alive){gltf.scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});return;}
   model=gltf.scene; const box=new THREE.Box3().setFromObject(model); const center=box.getCenter(new THREE.Vector3()); model.position.sub(center);
   model.traverse(o=>{if(o.isMesh){o.material.metalness=0; o.material.roughness=.6; o.material.envMapIntensity=.55; o.material.side=THREE.FrontSide;}});
   group.add(model);start=performance.now();onReady('ready');
  },undefined,()=>alive&&onReady('error'));
  const down=e=>{if(!values.current.interactive)return;dragging=true;gestureTravel=0;previous=e.clientX;el.setPointerCapture(e.pointerId);};
  const move=e=>{if(dragging){gestureTravel+=Math.abs(e.clientX-previous);dragY+=(e.clientX-previous)*.012;previous=e.clientX;}};
  const flourish=()=>{if(reduced())return;flourishStart=performance.now();flourishTurns+=Math.PI*2;};
  const up=()=>{if(dragging&&gestureTravel<6)flourish();dragging=false;};
  const keydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flourish();}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();dragY+=e.key==='ArrowLeft'?-.25:.25;}};el.addEventListener('keydown',keydown);
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  const pointer={x:0,y:0};const mouse=e=>{pointer.x=e.clientX/window.innerWidth-.5;pointer.y=e.clientY/window.innerHeight-.5;};window.addEventListener('pointermove',mouse);
  // Each keyframe is a distinct product pose. Motion begins at scroll zero.
  const poses=[
   {at:0,x:.85,y:0,z:-.16,rx:.03,ry:.12,scale:1.06},
   {at:.28,x:.96,y:.12,z:-.5,rx:.16,ry:1.7,scale:1.13},
   {at:.65,x:.15,y:-.08,z:.34,rx:-.16,ry:4.1,scale:.98},
   {at:1.05,x:-1.05,y:.04,z:.14,rx:.03,ry:Math.PI*2+.12,scale:1.06},
   {at:1.55,x:-1.1,y:.08,z:-.18,rx:.12,ry:Math.PI*2-.45,scale:1.12},
   {at:2.05,x:-.93,y:-.04,z:.26,rx:-.08,ry:Math.PI*4+.2,scale:1.02},
   {at:2.8,x:-.2,y:1,z:-.5,rx:.2,ry:Math.PI*5,scale:.65}
  ];
  let sy=0, autoAngle=0, previousFrame=performance.now(), previousIntro=true, revealStart=performance.now();
  const render=()=>{
   if(!alive)return;raf=requestAnimationFrame(render);
   const now=performance.now(), dt=Math.min((now-previousFrame)/1000,.05);previousFrame=now;
   const t=(now-start)/1000, small=window.innerWidth<760, calm=reduced();
   const target=window.scrollY/window.innerHeight;
   sy+=(target-sy)*(1-Math.exp(-dt*14));
   let i=0;while(i<poses.length-2 && sy>poses[i+1].at)i++;
   const a=poses[i],b=poses[i+1],q=THREE.MathUtils.clamp((sy-a.at)/(b.at-a.at),0,1);
   const mix=k=>THREE.MathUtils.lerp(a[k],b[k],q);
   const fade=THREE.MathUtils.smoothstep(sy,small?.86:2.35,small?1.1:2.8);
   el.style.opacity=1-fade;el.style.pointerEvents=fade>.8?'none':'auto';
   // The interactive region follows the cup; generous bounds avoid clipping during spins.
   const center=50+mix('x')/(2*5.7*Math.tan(THREE.MathUtils.degToRad(16))*(el.clientWidth/el.clientHeight))*100;
   el.style.clipPath=small?'inset(0 0 0 0)':`inset(1% ${Math.max(0,100-center-21)}% 1% ${Math.max(0,center-21)}%)`;
   if(lastReset!==values.current.reset){dragY=0;autoAngle=0;flourishTurns=0;flourishStart=-10000;lastReset=values.current.reset;}
   if(previousIntro && !values.current.intro) revealStart=now;
   previousIntro=values.current.intro;
   const opening=values.current.intro?0:Math.min(1,(now-revealStart)/2200);
   const entrance=calm?1:1-Math.pow(1-opening,3);
   const tapProgress=THREE.MathUtils.clamp((now-flourishStart)/1350,0,1);
   const tapAngle=flourishTurns-Math.PI*2*(1-(1-Math.pow(1-tapProgress,3)));
   const tapLift=Math.sin(tapProgress*Math.PI)*.24;
   if(values.current.spin&&!calm)autoAngle+=dt*.8;
   const idle=calm||dragging?0:1;
   group.position.x=(small?Math.sin(sy*3)*.13:mix('x'))+Math.sin(t*.72)*.065*idle;
   group.position.y=(calm?0:mix('y'))+Math.sin(t*1.45)*.105*idle+tapLift-(1-entrance)*.65;
   group.rotation.z=(calm?-.12:mix('z'))+Math.sin(t*.93)*.065*idle+(calm?0:pointer.x*.13);
   group.rotation.x=(calm?0:mix('rx')+pointer.y*.24+Math.sin(t*.67)*.08*idle);
   group.rotation.y=(calm?.12:mix('ry'))+dragY+autoAngle+tapAngle+Math.sin(t*.72)*.28*idle+(calm?0:pointer.x*.42)+(1-entrance)*Math.PI*2;
   const scale=(small?.92:mix('scale'))*(.58+.42*entrance)*(1+Math.sin(tapProgress*Math.PI)*.07);
   group.scale.setScalar(scale);
   if(fade<.999 || values.current.intro)renderer.render(scene,camera);
  };render();
  return()=>{alive=false;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('pointermove',mouse);el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.removeEventListener('keydown',keydown);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){for(const v of Object.values(o.material))if(v?.isTexture)v.dispose();o.material.dispose();}});env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="product-canvas" ref={mount} aria-label="Exponenta-ի եռաչափ մոդել։ Պտտելու համար քաշեք կամ օգտագործեք սլաքները։ Հպվեք՝ պտտելու համար։" role="img" tabIndex={0} />;
}

export function App(){
 const [loaded,setLoaded]=useState('loading'), [intro,setIntro]=useState(true), [introKey,setIntroKey]=useState(0), [spin,setSpin]=useState(false), [reset,setReset]=useState(0), [info,setInfo]=useState(false), [progress,setProgress]=useState(0);
 const introRef=useRef(null);
 useEffect(()=>{const scroll=()=>{document.documentElement.style.setProperty('--scroll',window.scrollY+'px');const max=document.documentElement.scrollHeight-window.innerHeight;setProgress(max?window.scrollY/max:0);};window.addEventListener('scroll',scroll,{passive:true});scroll();return()=>window.removeEventListener('scroll',scroll);},[]);
 useEffect(()=>{if(!intro)return;document.body.style.overflow='hidden';introRef.current?.focus();const duration=reduced()?300:2900;let timer;if(loaded!=='loading')timer=setTimeout(()=>setIntro(false),duration);const timeout=setTimeout(()=>setIntro(false),10000);return()=>{clearTimeout(timer);clearTimeout(timeout);document.body.style.overflow='';};},[intro,loaded,introKey]);
 useEffect(()=>{const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('revealed');}),{threshold:.15});document.querySelectorAll('.reveal').forEach(e=>obs.observe(e));return()=>obs.disconnect();},[]);
 const replay=()=>{window.scrollTo({top:0,behavior:'instant'});setIntroKey(v=>v+1);setIntro(true);};
 const skip=()=>setIntro(false);
 const showModel=()=>{if(innerWidth<760)window.scrollTo({top:0,behavior:'smooth'});};
 return <>
  <a className="skip-link" href="#taste">Անցնել ըմպելիքին</a>
  <div className="reading-progress" style={{transform:`scaleX(${progress})`}} />
  <header className="header"><a className="brand" href="#home" aria-label="Exponenta — գլխավոր էջ"><img src={A+'brand-logo.jpg'} alt=""/><span>EXPONENTA<span className="brand-sub">ՆՈՐ ՄԱԿԱՐԴԱԿ։ ԱՄԵՆ ՕՐ։</span></span></a><nav aria-label="Նավարկում"><a href="#taste">Բացահայտիր համը</a><a href="#rhythm">Քո ռիթմը</a></nav><a className="social-link" href="https://www.instagram.com/exponenta.am/" target="_blank" rel="noreferrer">Մենք Instagram-ում <ArrowUpRight size={19}/></a></header>
  <main>
  <div className="product-stage">
   {loaded!=='error'&&<ProductScene onReady={setLoaded} intro={intro} spin={spin} reset={reset} interactive={!intro}/>}
   {loaded==='error'&&<div className="model-fallback"><img src={A+'03-lifestyle.webp'} alt="Exponenta HIGH-PRO ազնվամորի–բանան"/><span>Այս դիտարկիչում 3D-ն հասանելի չէ</span></div>}
   <section id="home" className="hero">
    <div className="hero-topline"><span className="edition">ՍՊԻՏԱԿՈՒՑ՝ ՀԱՃՈՒՅՔՈՎ։</span><span className="coordinates">ԵՐԵՎԱՆ, ՀԱՅԱՍՏԱՆ · ԱՄԵՆ ՕՐ</span></div>
    <div className="hero-heading"><h1><span>ԶԳԱ</span><span>ՔՈ</span><span className="outlined">ՈՒԺԸ։</span></h1><span className="heading-note">ՔՈ ՀԱՄԸ։<br/>ՔՈ ԷՆԵՐԳԻԱՆ։</span></div>
    <div className="hero-note"><span className="note-line"/><p>Համ, որը ոգեշնչում է։<br/>Սպիտակուց՝ ամեն օրվա համար։</p><a href="#taste" className="round-cta" aria-label="Բացահայտել համը"><ArrowDown size={25}/></a></div>
    <div className="hero-badge"><strong>30<span>գ</span></strong><span>ՍՊԻՏԱԿՈՒՑ<br/>ՄԵԿ ԲԱԺԱԿՈՒՄ</span></div>
    <div className="hero-bottom"><span className="flavor-index">01 / <b>ԱԶՆՎԱՄՈՐԻ — ԲԱՆԱՆ</b></span><span className="drag-hint"><Hand size={17}/> Պտտիր կամ հպվիր</span><span className="scroll-hint">ԹԵՐԹԻՐ։ ԶԳԱ։ <ArrowDown size={15}/></span></div>
   </section>
   <section id="taste" className="taste">
    <div className="taste-top"><span>01 — ՀԱՄԻ ՄԱՍԻՆ</span><span>HIGH-PRO ՇԱՐՔ</span></div>
    <div className="taste-copy reveal"><span className="small-label">ԱԶՆՎԱՄՈՐԻ + ԲԱՆԱՆ</span><h2>ՍԵՐ՝ ԱՌԱՋԻՆ<br/><em>ԿՈՒՄԻՑ։</em></h2><p>Բուրավետ ազնվամորի։ Նուրբ բանան։<br/>Քո փոքրիկ համեղ ծեսը՝<br/>ամեն օր։</p><div className="facts"><div><strong>30<small>գ</small></strong><span>սպիտակուց մեկ բաժակում</span></div><div><strong>Առանց</strong><span>ավելացված շաքարի</span></div></div><button className="details-button" onClick={()=>setInfo(!info)} aria-expanded={info}>Ավելին ըմպելիքի մասին {info?<Minus size={20}/>:<Plus size={20}/>}</button>{info&&<div className="product-details">HIGH-PRO · Ազնվամորի–բանան։ Պատրաստի սպիտակուցային ըմպելիք՝ հարմար բաժակով։ 30 գ սպիտակուց մեկ բաժակում։ Առանց ավելացված շաքարի։</div>}<div className="model-controls"><button className={spin?'active':''} onClick={()=>{setSpin(!spin);showModel();}} aria-pressed={spin}><ArrowCounterClockwise size={17}/>{spin?'Կանգնեցնել':'Պտտել 360°'}</button><button onClick={()=>{setReset(v=>v+1);setSpin(false);showModel();}}>Սկզբնական դիրք</button></div></div>
    <span className="taste-bigword" aria-hidden="true">Ի՜ՆՉ ՀԱՄ։</span><span className="taste-foot">ԼԱՎ ՕՐԸ ՍԿՍՎՈՒՄ Է ՀԱՄԻՑ։</span>
   </section>
  </div>
  <div className="marquee" aria-hidden="true"><div>{Array.from({length:4},(_,i)=><span key={i}>ԱՎԵԼԻ ՀԱՄԵՂ <span className="marquee-star">✳</span> ԱՎԵԼԻ ՔՈՆԸ <span className="marquee-star">✳</span> </span>)}</div></div>
  <section id="rhythm" className="rhythm"><div className="rhythm-heading reveal"><div><span className="small-label">02 — ՔՈ ՌԻԹՄՈՎ</span><h2>ԱՄԵՆ ՕՐ։<br/><em>ՔՈ ՌԻԹՄՈՎ։</em></h2></div><p>Մարզումից հետո։ Հանդիպումների միջև։<br/>Պարզապես, որովհետև համեղ է։<br/><b>Քո օրվա ամեն պահի համար։</b></p></div><div className="photo-grid"><figure className="photo-card photo-one reveal"><img src={A+'01-pink-fitness.webp'} alt="Exponenta-ի վարդագույն բաժակը՝ մարզական պարագաների կողքին" loading="lazy"/><figcaption><span>01 / ՇԱՐԺՎԻՐ</span><strong>Շարժման մեջ։</strong><ArrowUpRight size={32}/></figcaption></figure><figure className="photo-card photo-two reveal"><img src={A+'03-lifestyle.webp'} alt="Աղջիկը՝ Exponenta ազնվամորի–բանան ըմպելիքով" loading="lazy"/><figcaption><span>02 / ՎԱՅԵԼԻՐ ՊԱՀԸ</span><strong>Քո պահին։</strong><ArrowUpRight size={32}/></figcaption></figure></div></section>
  <section className="closing"><span className="small-label">EXPONENTA ՀԱՅԱՍՏԱՆ</span><h2>ՔՈ ՀԱՋՈՐԴ<br/><em>ՀԱՄԵՂ ՊԱՀԸ։</em></h2><a href="https://www.instagram.com/exponenta.am/" target="_blank" rel="noreferrer" className="instagram-cta"><InstagramLogo size={24}/> @exponenta.am <ArrowUpRight size={25}/></a><footer><span>© EXPONENTA · 2026</span><button onClick={replay}><ArrowCounterClockwise size={16}/> Նորից սկզբից</button><span>ՍՏԵՂԾՎԱԾ Է ՎԱՅԵԼԵԼՈՒ ՀԱՄԱՐ։</span></footer></section>
  </main>
  <div key={introKey} className={`intro ${intro?'':'intro-exit'}`} aria-hidden={!intro} inert={!intro?true:undefined}><div className="intro-top"><span>EXPONENTA</span><span>ՀԱՅԱՍՏԱՆ</span></div><div className="intro-center"><img className="intro-logo" src={A+'brand-logo.jpg'} alt="Exponenta-ի տարբերանշանը"/><div className="intro-title">EXPONENTA</div><span className="intro-tag">ՔՈ ԱՄԵՆՕՐՅԱ ՀԱՄԵՂ ՊԱՀԸ։</span></div><div className="intro-bottom"><span>{loaded==='loading'?'Պատրաստում ենք քո համեղ օրը…':'Քո նոր մակարդակը։'}</span><button ref={introRef} onClick={skip}>Բաց թողնել <ArrowRight size={16}/></button></div><div className={`intro-meter ${loaded!=='loading'?'complete':''}`}/></div>
 </>;
}

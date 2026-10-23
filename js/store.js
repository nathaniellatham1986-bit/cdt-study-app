// Review state in localStorage (small; IndexedDB not needed for phase 1).
const K='cdt.progress.v1';
export const load=()=>{try{return JSON.parse(localStorage.getItem(K))||{cards:{}}}catch{return{cards:{}}}};
export const save=p=>localStorage.setItem(K,JSON.stringify(p));
export function exportJSON(p){return JSON.stringify({app:'cdt-study',version:1,exported:new Date().toISOString(),...p},null,1);}
export function importJSON(txt){const o=JSON.parse(txt);if(o.app!=='cdt-study'||typeof o.cards!=='object')throw new Error('Not a CDT Study backup');return{cards:o.cards,quiz:(o.quiz&&typeof o.quiz==="object")?o.quiz:{}};}

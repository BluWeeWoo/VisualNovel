export const defaultProfile = () => ({name:'Alex',pronouns:'they',gender:'non-binary',language:'english',portrait:'silhouette',customPronouns:{subject:'they',object:'them',possessive:'their',possessivePronoun:'theirs',reflexive:'themself',plural:true}});
export const validCustomPronouns = p => !!p && ['subject','object','possessive','possessivePronoun','reflexive'].every(k=>typeof p[k]==='string' && /^[\p{L}\p{M}’'-]{1,24}$/u.test(p[k])) && typeof p.plural==='boolean';
export function pronounForms(state){
  if(state.pronouns==='custom' && validCustomPronouns(state.customPronouns))return state.customPronouns;
  const forms={he:['he','him','his','his','himself'],she:['she','her','her','hers','herself'],they:['they','them','their','theirs','themself']};
  const p=forms[state.pronouns]||forms.they;
  return Object.fromEntries(['subject','object','possessive','possessivePronoun','reflexive'].map((key,i)=>[key,p[i]]).concat([['plural',!['he','she'].includes(state.pronouns)]]));
}

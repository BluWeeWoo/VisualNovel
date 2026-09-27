const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function morningPhone(node,state){
 if(state.node!=='d2PhoneOpen')return '';
 const line=node.lines[state.line];
 if(line?.speaker==='Phone')return '<aside class="morning-phone" aria-label="Missed calls"><div class="morning-phone-title">SG · Notifications</div><p>Dad · 60 missed calls</p><p>Mom · 34 missed calls</p></aside>';
 if(!line?.speaker.endsWith(' · SG'))return '';
 const messages=node.lines.slice(0,state.line+1).filter(l=>l.speaker===line.speaker);
 return `<aside class="morning-phone" aria-label="Messages from ${escape(line.speaker)}"><div class="morning-phone-title">${escape(line.speaker)}</div>${messages.map(l=>`<p>${escape(l.text)}</p>`).join('')}</aside>`;
}

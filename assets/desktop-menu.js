// Desktop title composition; existing action handlers retain their behavior.
export function desktopMenu(resume){
  const buttons=[...(resume?[['continue','Continue your summer'],['new','Start a new summer']]:[['new','Begin your summer']]),['saves','Saved moments'],['settings','Settings'],['love-interests','Love Interests'],['about','About']];
  return `<main class="seaglass-menu">
    <div class="seaglass-scene" aria-hidden="true"></div>
    <div class="summer-breeze" aria-hidden="true">${Array.from({length:7},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div>
    <section class="seaglass-copy" aria-labelledby="summer-title">
      <p class="seaglass-kicker">SUMMERHOUSE · CHAPTER ONE</p>
      <h1 id="summer-title">Our Summer,<br><em>Unfinished</em></h1>
      <p class="seaglass-tagline">An old house. Five promises.<br>Someone who remembers.</p>
      <nav class="seaglass-actions" aria-label="Main menu">${buttons.map(([action,label])=>`<button class="plank" data-action="${action}"><span>${label}</span></button>`).join('')}</nav>
      <button class="seaglass-access" data-action="accessibility">Reading & accessibility</button>
      <p class="seaglass-note">A gentle story about returning and remembering.<br>Includes bereavement and a difficult home life.</p>
    </section>
    <p class="seaglass-location">Summerhouse, late June</p>
  </main>`;
}

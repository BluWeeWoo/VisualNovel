export const suggestions = ['Are you still awake?', 'The gull definitely won.', 'Today was a lot.'];
export function scriptedReply(message, state) {
  const m = message.toLowerCase();
  if (/love|kiss|date|marry|together forever/.test(m)) return 'I’m glad we’re talking again. Let’s give ourselves time to find out what that means. For tonight: two people with an unreasonable alarm clock.';
  if (/grandma|grandmother|miss her|died|grief/.test(m)) return 'I keep wanting to tell her the little things. Like the gull today. You don’t have to make this a good day on my account.';
  if (/sorry|away|left|leave/.test(m)) return 'There are things I haven’t worked out how to say yet. Not tonight, maybe. But I’m glad you came back today.';
  if (/space|tired|sleep|goodnight|good night|stop/.test(m)) return 'Then sleep. No attendance register here. I’ll bring the flask in the morning. Goodnight, ' + state.name + '.';
  if (/gull|chip|fries|bird/.test(m)) return 'I have reviewed the evidence. The gull was better prepared and had superior air support. We’ll rebuild.';
  if (/song|music|guitar|instrument|want|dream/.test(m)) return 'There’s a guitar body on my workbench that almost looks like a guitar. Almost. I’ll show you sometime, if you’d like.';
  if (/friend/.test(m)) return 'Me too. I like that we can say what we mean now. Still reserving the right to complain about your chip defenses.';
  if (/sunrise|pier|morning|alarm/.test(m)) return '4:40 at the gate. Bring something warm. The sea has never respected the concept of summer.';
  if (/tea|coffee|cocoa|drink/.test(m)) return 'I can work with that. The flask is old but reliable. Unlike my ability to wake up before five.';
  if (/lot|sad|hard|feel|afraid|scared/.test(m)) return 'Yeah. I’m sitting on the back step for a bit. We can have a quiet minute on opposite sides of the fence, if that helps.';
  if (/awake|hello|hey|hi\b/.test(m)) return 'Unfortunately. I’m arguing with a cupboard hinge. It has some compelling points. You settling in?';
  return ['I’m not sure I know how to answer that properly tonight. But I’m here. The house is probably making all its usual noises at you.',
    'That’s something we can talk about when we have a little more daylight. I’m glad we exchanged numbers, though.',
    'I’m putting the flask by the door so I don’t forget it. You don’t need to stay up with me. We have tomorrow.'][state.chatTurns % 3];
}
export async function requestReply(state, message, signal) {
  const {chatContext} = await import('./engine.js');
  const response = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({context:chatContext(state), message}), signal});
  if (!response.ok) throw new Error(response.status === 429 ? 'Please wait a moment before trying again.' : 'Rowan’s connection is unavailable. Your message has not been added.');
  const result = await response.json();
  if (typeof result.reply !== 'string' || !result.reply.trim()) throw new Error('An empty reply came back. You can retry or use the scripted demo.');
  return result.reply;
}

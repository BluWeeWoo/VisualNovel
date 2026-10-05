export function lineVisible(line,flags={}){
 return (!line.if||flags[line.if[0]]===line.if[1])&&(!line.conditions||line.conditions.every(([key,value,negate])=>negate?flags[key]!==value:flags[key]===value));
}

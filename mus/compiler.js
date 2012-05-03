var endTime = function (time, expr) {
    if (expr.tag === 'note') return time + expr.dur;
   
    if (expr.tag === 'par') {
       var max = expr.left.dur > expr.right.dur ?
           expr.left.dur : expr.right.dur;
       
       return time + max;
    }
   
    return endTime(endTime(time, expr.left), expr.right);
};

var tonote = function (startTime, musexpr) {

    return { tag: musexpr.tag,
           pitch: musexpr.pitch,
           start: startTime,
           dur: musexpr.dur };
};

var containsNote = function(notes, note) {
   if (notes === undefined) return false;
   
   for (i = 0, length = notes.length; i < length; i++) {
       if (notes[i].pitch === note)
           return true;
   }
       
   return false;
};

var buildnotes = function (notes, musexpr) {
   var startTime = 0;
   var length = notes.length;
   
   if (musexpr.tag === 'note') {
       if (containsNote(notes, musexpr.pitch))
           return;
       
       if (length === 0)
           startTime = 0;
       else if (length === 1)
           startTime = notes[length-1].dur;
       else {
           var previousNote = notes[length-1];
           startTime = previousNote.start + previousNote.dur;
       }
       
       notes.push(tonote(startTime, musexpr));
   }
   else if (musexpr.tag === 'par') {
       
       if (length > 0) {
           var lastNote = notes[length-1];
           startTime = endTime(0, lastNote);
       }
       
       notes.push(tonote(startTime, musexpr.left));
       notes.push(tonote(startTime, musexpr.right));
   }    
};

var compileT = function (notes, musexpr) {
   
    if (musexpr !== undefined && (musexpr.tag === 'note' || musexpr.tag === 'par'))
       buildnotes(notes, musexpr);
   
    if (musexpr.left !== undefined)
       compileT(notes, musexpr.left);
   
    if (musexpr.right !== undefined)
       compileT(notes, musexpr.right);
   
   return notes;
};

var compile = function (musexpr) {
    // your code here
    var notes = [];
    return compileT(notes, musexpr);
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));

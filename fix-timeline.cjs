const fs = require('fs');

let content = fs.readFileSync('src/components/Timeline/Timeline.jsx', 'utf8');

// Replace physical padding with logical padding
content = content.replace(/pl-8 lg:pl-16/g, 'pe-8 lg:pe-16');
content = content.replace(/pr-8 lg:pr-16/g, 'ps-8 lg:ps-16');

// Replace physical text align with logical text align
content = content.replace(/md:text-left/g, 'md:text-end');
content = content.replace(/md:text-right/g, 'md:text-start');

// Change `text-start ${isEven ? 'md:text-end' : 'md:text-start'}`
// Wait, in RTL `text-start` for all Arabic text is much more readable. Let's see if we should enforce it.
// If the user said "الدايركشن هنا لانه لا يعمل بشكل صحيح", it means the directional arrows or timeline itself is reversed.
// In RTL, the FIRST element is placed on the Right.
// The code had `isEven ? 'pl-8'` which is on the Right.
// So the structure was:
// Right: isEven
// Left: !isEven
// This is correct. So maybe the logic was fine, but the user expects the timeline items to be centered or something else?
// Wait, what if the user expects all items to be aligned to the start (Right) regardless of the side?
// Let's modify TimelineCard to ALWAYS align text-start (which aligns to the Right in RTL).

fs.writeFileSync('src/components/Timeline/Timeline.jsx', content);

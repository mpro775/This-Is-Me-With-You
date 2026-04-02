const fs = require('fs');

let content = fs.readFileSync('src/components/Timeline/Timeline.jsx', 'utf8');

// Replace physical padding with logical padding
content = content.replace(/pl-8 lg:pl-16/g, 'pe-8 lg:pe-16');
content = content.replace(/pr-8 lg:pr-16/g, 'ps-8 lg:ps-16');

// Replace physical text align with logical text align
content = content.replace(/md:text-left/g, 'md:text-end');
content = content.replace(/md:text-right/g, 'md:text-start');

// Change text-start ${isEven ? 'md:text-end' : 'md:text-start'} to handle RTL properly
// Actually, it's better to just use standard Arabic alignment (text-start) for the text, and keep the flex symmetry.
// Let's replace the whole card alignment logic.

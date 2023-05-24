console.log('\x1b[32m%s\x1b[0m', 'Operation successful');
console.log('\x1b[3m%s\x1b[0m', 'Elegant message in italic style');
console.log('\x1b[35m\x1b[1m', 'Purple message in bold font');
console.log('\x1b[46m\x1b[37m%s\x1b[0m', 'Message with white text and cyan background');
// Green text with underline
console.log('\x1b[32m\x1b[4m%s\x1b[0m', 'Underlined green text');

// Red text in bold
console.log('\x1b[31m\x1b[1m%s\x1b[0m', 'Bold red text');

// Cyan text with a black background
console.log('\x1b[40m\x1b[36m%s\x1b[0m', 'Cyan text on black background');

// Magenta text in italic
console.log('\x1b[35m\x1b[3m%s\x1b[0m', 'Italic magenta text');

// Green text with underline
console.log('\x1b[32m\x1b[4m%s\x1b[0m', 'Underlined green text');

// Yellow text with bold font
console.log('\x1b[33m\x1b[1m%s\x1b[0m', 'Bold yellow text');

// Blue text in italic style
console.log('\x1b[34m\x1b[3m%s\x1b[0m', 'Italic blue text');

// Red text with white background
console.log('\x1b[41m\x1b[37m%s\x1b[0m', 'White text on red background');

// Cyan text with underline and bold font
console.log('\x1b[36m\x1b[4m\x1b[1m%s\x1b[0m', 'Bold underlined cyan text');

// White text with blue background
console.log('\x1b[44m\x1b[37m%s\x1b[0m', 'White text on blue background');

// first part Magenta text in italic and second part Purple message in bold font
console.log('\x1b[35m\x1b[3m%s\x1b[0m', 'Italic magenta text', '\x1b[35m\x1b[1m', 'Purple message in bold font');

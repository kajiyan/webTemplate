import * as modernizr from 'modernizr';

console.log('Hello World');
var div = document.createElement('div');
div.textContent = 'hoge';
document.body.appendChild(div);

window.modernizr = modernizr;

// async () => {};

const fs = require('fs');
const path = require('path');

const regularPath = 'c:\\Users\\Kim Anonuevo\\Desktop\\attendict1\\Century-Gothic-Sans-Font\\CenturyGothicPaneuropeanRegular.ttf';
const boldPath = 'c:\\Users\\Kim Anonuevo\\Desktop\\attendict1\\Century-Gothic-Sans-Font\\CenturyGothicPaneuropeanBold.ttf';

function toBase64(filePath) {
    const data = fs.readFileSync(filePath);
    return data.toString('base64');
}

console.log('---REGULAR---');
console.log(toBase64(regularPath));
console.log('---BOLD---');
console.log(toBase64(boldPath));

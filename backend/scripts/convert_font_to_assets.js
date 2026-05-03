const fs = require('fs');
const path = require('path');

const regularPath = 'c:\\Users\\Kim Anonuevo\\Desktop\\attendict1\\Century-Gothic-Sans-Font\\CenturyGothicPaneuropeanRegular.ttf';
const boldPath = 'c:\\Users\\Kim Anonuevo\\Desktop\\attendict1\\Century-Gothic-Sans-Font\\CenturyGothicPaneuropeanBold.ttf';

const targetDir = 'c:\\Users\\Kim Anonuevo\\Desktop\\attendict1\\frontend\\src\\assets\\fonts';
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

function toJS(filePath, varName, fileName) {
    const data = fs.readFileSync(filePath);
    const b64 = data.toString('base64');
    const content = `export const ${varName} = "${b64}";`;
    fs.writeFileSync(path.join(targetDir, fileName), content);
}

toJS(regularPath, 'centuryGothicRegular', 'century-gothic-regular.js');
toJS(boldPath, 'centuryGothicBold', 'century-gothic-bold.js');

console.log('Fonts converted and saved to assets/fonts/');

import { jsPDF } from 'jspdf';
const doc = new jsPDF();
const cx = 20;
const cy = 20;
const size = 5;
const innerSize = size / 2.5;
let points = [];
// 10 points for a star
for (let i = 0; i < 10; i++) {
  const angle = i * Math.PI / 5 - Math.PI / 2;
  const r = (i % 2 === 0) ? size : innerSize;
  points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
}

doc.setFillColor(250, 204, 21);
doc.setDrawColor(250, 204, 21);
doc.setLineWidth(0.2);

const relPoints = [];
for (let i = 1; i < 10; i++) {
  relPoints.push([points[i].x - points[i-1].x, points[i].y - points[i-1].y]);
}

doc.lines(relPoints, points[0].x, points[0].y, [1, 1], 'FD', true);
doc.save('testout.pdf');
console.log('PDF saved.');

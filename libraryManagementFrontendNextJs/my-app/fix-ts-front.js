const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile('src/app/(admin)/admin/dashboard/page.tsx', [
  ['(s, a) =>', '(s: number, a: any) =>'],
  ['import ActionItemsList, { type ActionItem } from \'@/app/(admin)/admin/reusable/ActionItemsList\';', 'import ActionItemsList, { type ActionItem } from \'@/app/(admin)/admin/reusable/ActionItemsList\';\nimport RecentPaymentsFeed from \'@/app/(admin)/admin/reusable/RecentPaymentsFeed\';']
]);

replaceInFile('src/app/(admin)/admin/reports/page.tsx', [
  ['data.kpiCards.map((card, i)', 'data.kpiCards.map((card: any, i: number)'],
  ['data.shiftOccupancy.map((e, i)', 'data.shiftOccupancy.map((e: any, i: number)']
]);

replaceInFile('src/app/(manager)/students/[id]/page.tsx', [
  ['.map((n, i)', '.map((n: any, i: number)']
]);

replaceInFile('src/app/(manager)/students/exit/page.tsx', [
  ['.map((n, i)', '.map((n: any, i: number)']
]);

replaceInFile('src/app/(manager)/students/page.tsx', [
  ['type Student = {', 'type Student = {\n  id: string;'],
]);

console.log('Fixed TS errors in frontend');

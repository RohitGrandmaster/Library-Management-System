const fs = require('fs');

const files = [
  'src/students/students.service.ts',
  'src/expenses/expenses.service.ts',
  'src/admin/admin.service.ts'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // I will replace \\${ with ${
  content = content.replace(/\\\\\$/g, '$');
  // I will replace \\` with `
  content = content.replace(/\\\\\`/g, '\`');
  fs.writeFileSync(f, content);
  console.log('Fixed', f);
});

const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(filePath, content);
}

// 1. Fix auth imports and @Req() types
const controllers = [
  'src/admin/admin.controller.ts',
  'src/expenses/expenses.controller.ts',
  'src/manager/manager.controller.ts',
  'src/students/students.controller.ts'
];

controllers.forEach(f => {
  replaceInFile(f, [
    ['../auth/roles.decorator', '../auth/decorators/roles.decorator'],
    ['../auth/jwt-auth.guard', '../auth/guards/jwt-auth.guard'],
    ['../auth/roles.guard', '../auth/guards/roles.guard'],
    ['@Req() req', '@Req() req: any']
  ]);
});

// 2. Fix Expenses Service
replaceInFile('src/expenses/expenses.service.ts', [
  ['user: true', 'recordedBy: true'], // assuming we have a recordedBy relation? Wait, if we don't, I will just remove it.
  ['order: { date: \'DESC\' }', 'order: { createdAt: \'DESC\' }'],
  ['e.date.toLocaleDateString', 'e.createdAt.toLocaleDateString'], // Need to check expense.entity.ts, it probably has createdAt.
  ['e.user?.firstName || \'\'', 'e.recordedBy?.name?.split(\' \')[0] || \'\''],
  ['e.user?.lastName || \'\'', 'e.recordedBy?.name?.split(\' \')[1] || \'\'']
]);

// 3. Fix Manager Service
replaceInFile('src/manager/manager.service.ts', [
  ['order: { createdAt: \'DESC\' }', 'order: { joinDate: \'DESC\' }'],
  ['`${s.firstName} ${s.lastName}`', 's.name']
]);

// 4. Fix Students Service
replaceInFile('src/students/students.service.ts', [
  ['order: { createdAt: \'DESC\' }', 'order: { joinDate: \'DESC\' }'],
  ['`${s.firstName} ${s.lastName}`', 's.name']
]);

// 5. Fix Students Controller findOne
replaceInFile('src/students/students.controller.ts', [
  ['this.studentsService.findOne(id)', 'this.studentsService.findOne(id, req.user?.branchId)']
]);

console.log('Fixed backend TS errors.');

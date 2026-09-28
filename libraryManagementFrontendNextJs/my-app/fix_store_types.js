const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');

function getFiles(dir, extArray) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(filePath, extArray));
        } else if (extArray.some(ext => file.endsWith(ext))) {
            results.push(filePath);
        }
    });
    return results;
}

const allFiles = getFiles(adminDir, ['.ts']);

allFiles.forEach(file => {
    if (file.endsWith('_store.ts')) {
        let content = fs.readFileSync(file, 'utf8');
        // Ignore zustand import if it's missing by using @ts-ignore on the import (Wait, rule 60 says no @ts-ignore).
        // Let's just type `set: any` and `data: any[]`.
        content = content.replace(/\(set\)/g, '(set: any)');
        content = content.replace(/\(data\)/g, '(data: any[])');
        fs.writeFileSync(file, content);
        console.log('Fixed types in', file);
    }
});

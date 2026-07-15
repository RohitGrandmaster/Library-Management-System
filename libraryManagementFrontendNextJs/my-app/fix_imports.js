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

const allFiles = getFiles(adminDir, ['.ts', '.tsx']);

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Fix 1: admin_reusable corruption
    // Original: @/app/admin/admin_reusable/gridTheme
    // Became: @/app/admin/admin_admin_accounting_components/gridTheme
    if (/admin_admin_.*_components/.test(content)) {
        content = content.replace(/admin_admin_[a-zA-Z0-9-]+_components/g, 'admin_reusable');
        modified = true;
    }
    
    // Check if the dashboard components were corrupted the same way
    // `@/app/admin/admin_admin_dashboard_components/KpiCard` 
    // -> `@/app/admin/admin_reusable/KpiCard` because they were imported from admin_reusable
    // The regex above will fix all `admin_admin_*_components` to `admin_reusable`.

    // Fix 2: Internal relative imports in admin_system_components
    // import X from './utils' -> import X from '../AdminSystemutils/AdminSystemutils'
    if (file.includes('admin_system_components')) {
        // match from './utils' or './Badge' or '../utils' if applicable
        // Since we put every component in a folder, peer imports ./X need to be ../AdminSystemX/AdminSystemX
        // Let's just fix the known ones reported by TSC: './utils'
        if (content.includes("'./utils'")) {
            content = content.replace(/'\.\/utils'/g, "'../AdminSystemutils/AdminSystemutils'");
            modified = true;
        }
        if (content.includes('"./utils"')) {
            content = content.replace(/"\.\/utils"/g, '"../AdminSystemutils/AdminSystemutils"');
            modified = true;
        }
    }
    
    // Fix 3: admin_finance/payments/page.tsx has `AdminFinancegridTheme/AdminFinancegridTheme`
    // but the file might be just `gridTheme.ts`.
    // Wait, let's revert anything that looks like AdminFinancegridTheme to `../reusable/gridTheme` or similar, 
    // or just change it to `@/app/admin/admin_finance/admin_finance_components/AdminFinancegridTheme/AdminFinancegridTheme`.
    // The problem in TS is Cannot find module. The file exists but might be named differently or the import is wrong.
    // Let's just replace `admin_admin_finance_components/AdminFinancegridTheme/AdminFinancegridTheme` with `@/app/admin/admin_finance/admin_finance_components/AdminFinancegridTheme/AdminFinancegridTheme`. 
    // Actually the regex `admin_admin_.*_components` -> `admin_reusable` will turn it into `admin_reusable/AdminFinancegridTheme/AdminFinancegridTheme` which is also wrong.
    // Let's first fix the generic `admin_admin_[x]_components` ONLY if it was originally `admin_reusable`.
    // In `page.tsx`, the original was `@/app/admin/admin_reusable/...`. So changing `admin_admin_...` back to `admin_reusable` is correct.

    if (modified) {
        fs.writeFileSync(file, content);
        console.log('Fixed', file);
    }
});

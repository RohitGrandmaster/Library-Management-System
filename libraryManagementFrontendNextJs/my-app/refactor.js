const fs = require('fs');
const path = require('path');

const target = "c:/Users/Rohit/Desktop/Project_to_work/Library/libraryManagementFrontendNextJs/my-app/src/app";
const managerFinance = path.join(target, "manager", "manager_finance");
const managerAccounting = path.join(target, "manager", "manager_accounting");

function renameRecursively(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            renameRecursively(fullPath);
        }
        
        let newName = item.replace(/admin_finance/g, "manager_finance").replace(/admin_accounting/g, "manager_accounting");
        if (newName !== item) {
            const newPath = path.join(path.dirname(fullPath), newName);
            try {
                fs.renameSync(fullPath, newPath);
            } catch (e) {
                console.error("Failed to rename:", fullPath, e.message);
            }
        }
    }
}

function replaceContentRecursively(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceContentRecursively(fullPath);
        } else if (stat.isFile() && /\.(tsx|ts|css|json|md)$/.test(item)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content
                .replace(/admin_finance/g, "manager_finance")
                .replace(/admin_accounting/g, "manager_accounting")
                .replace(/\/admin\//g, "/manager/")
                .replace(/AdminFinance/g, "ManagerFinance")
                .replace(/AdminAccounting/g, "ManagerAccounting");
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
            }
        }
    }
}

renameRecursively(managerFinance);
renameRecursively(managerAccounting);

// run it a second time just in case there are nested renamed dirs that were missed
renameRecursively(managerFinance);
renameRecursively(managerAccounting);

replaceContentRecursively(managerFinance);
replaceContentRecursively(managerAccounting);

console.log("Done Node Script");

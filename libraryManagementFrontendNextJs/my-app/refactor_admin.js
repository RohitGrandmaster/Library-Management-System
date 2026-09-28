const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');

function getSubDirs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

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

const subModules = getSubDirs(adminDir).filter(name => name.startsWith('admin_'));

subModules.forEach(mod => {
    if (['admin_components', 'admin_context', 'admin_constants', 'admin_types', 'admin_api'].includes(mod)) return;

    const modDir = path.join(adminDir, mod);
    const reusableDir = path.join(modDir, 'reusable');
    const componentsDir = path.join(modDir, `${mod}_components`);
    let mapping = {};

    if (fs.existsSync(reusableDir)) {
        fs.renameSync(reusableDir, componentsDir);
        console.log(`Renamed ${reusableDir} to ${componentsDir}`);
    }

    if (fs.existsSync(componentsDir)) {
        const compFiles = fs.readdirSync(componentsDir, { withFileTypes: true });
        compFiles.forEach(file => {
            if (file.isFile() && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) {
                const oldName = file.name;
                const ext = path.extname(oldName);
                const baseName = path.basename(oldName, ext);
                
                let newBaseName = baseName;
                if (!baseName.toLowerCase().startsWith('admin')) {
                    const camelMod = mod.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
                    newBaseName = `${camelMod}${baseName}`;
                }
                
                const newFolderName = newBaseName;
                const newFileName = `${newBaseName}${ext}`;
                const newFolderPath = path.join(componentsDir, newFolderName);
                
                if (!fs.existsSync(newFolderPath)) {
                    fs.mkdirSync(newFolderPath);
                }

                const oldFilePath = path.join(componentsDir, oldName);
                const newFilePath = path.join(newFolderPath, newFileName);
                
                fs.renameSync(oldFilePath, newFilePath);

                if (ext === '.tsx') {
                    let content = fs.readFileSync(newFilePath, 'utf8');
                    if (!content.includes('// RESPONSIBILITY:')) {
                        const comment = `// RESPONSIBILITY: Renders the ${baseName} component for the ${mod} module.\n// DATA FLOW: Parent -> ${newBaseName} -> DOM\n\n`;
                        content = content.replace(/^(?:'use client';\s*|)/, `$&${comment}`);
                        fs.writeFileSync(newFilePath, content);
                    }
                }

                mapping[baseName] = `${newFolderName}/${newBaseName}`;
                console.log(`Moved and renamed ${oldName} to ${newFilePath}`);
            }
        });
    }

    const configs = [
        { suffix: '_constants', ext: '.ts', content: `// Constants for ${mod}\nexport const PLACEHOLDER = true;\n` },
        { suffix: '_types', ext: '.ts', content: `// Types for ${mod}\nexport interface ${mod.split('_').map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join('')}Data {}\n` },
        { suffix: '_api', ext: '.ts', content: `import { fetchApi } from '@/lib/api';\n// API for ${mod}\n` },
        { suffix: '_forbidden', ext: '.md', content: `# Forbidden Patterns for ${mod}\n- Do not use relative imports.\n- Do not mix complex logic in view components.\n` }
    ];

    configs.forEach(cfg => {
        const folderName = `${mod}${cfg.suffix}`;
        const folderPath = path.join(modDir, folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
        const filePath = path.join(folderPath, `${folderName}${cfg.ext}`);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, cfg.content);
            console.log(`Created ${filePath}`);
        }
    });

    const allTsFiles = getFiles(modDir, ['.ts', '.tsx']);
    allTsFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        if (content.includes('reusable/')) {
             content = content.replace(/reusable\//g, `${mod}_components/`);
             modified = true;
        }

        Object.keys(mapping).forEach(oldName => {
             const searchRegex = new RegExp(`${mod}_components\/${oldName}(['"])`, 'g');
             if (searchRegex.test(content)) {
                 content = content.replace(searchRegex, `${mod}_components/${mapping[oldName]}$1`);
                 modified = true;
             }
        });

        if (file.endsWith('page.tsx') && !content.includes('// RESPONSIBILITY:')) {
            const comment = `// RESPONSIBILITY: Entry page for the ${mod} module.\n// DATA FLOW: Next.js Router -> Page -> Components\n\n`;
            content = content.replace(/^(?:'use client';\s*|)/, `$&${comment}`);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            console.log(`Updated imports in ${file}`);
        }
    });
});
console.log("Admin module refactor completed successfully!");

const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'app', 'admin');

function getSubDirs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

const subModules = getSubDirs(adminDir).filter(name => name.startsWith('admin_'));

subModules.forEach(mod => {
    // Skip non-route structural folders
    if (['admin_components', 'admin_context', 'admin_constants', 'admin_types', 'admin_api'].includes(mod)) return;

    const modDir = path.join(adminDir, mod);
    const componentsDir = path.join(modDir, `${mod}_components`);
    const storeDir = path.join(modDir, `${mod}_store`);

    // Helper for component naming
    const camelMod = mod.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(''); // e.g., AdminAuditLogs
    // Note: admin_audit-logs should become AdminAudit-logs? Better to remove hyphens:
    const cleanCamelMod = mod.split(/[-_]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');

    // 1. loading.tsx
    const loadingPath = path.join(modDir, 'loading.tsx');
    if (!fs.existsSync(loadingPath)) {
        const loadingContent = `'use client';\n\n// RESPONSIBILITY: Renders the Next.js native loading skeleton for the ${mod} module.\n// DATA FLOW: Next.js Router -> loading.tsx\n\nexport default function Loading() {\n  return (\n    <div className="flex h-full w-full items-center justify-center p-8">\n      <div className="animate-pulse space-y-4 w-full max-w-3xl">\n        <div className="h-8 bg-muted rounded w-1/4"></div>\n        <div className="h-64 bg-muted rounded w-full"></div>\n      </div>\n    </div>\n  );\n}\n`;
        fs.writeFileSync(loadingPath, loadingContent);
        console.log(`Created ${loadingPath}`);
    }

    // 2. error.tsx
    const errorPath = path.join(modDir, 'error.tsx');
    if (!fs.existsSync(errorPath)) {
        const errorContent = `'use client';\n\n// RESPONSIBILITY: Renders the Next.js native error boundary for the ${mod} module.\n// DATA FLOW: Next.js Router -> error.tsx\n\nimport { useEffect } from 'react';\n\nexport default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {\n  useEffect(() => { console.error(error); }, [error]);\n  return (\n    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">\n      <h2 className="text-xl font-semibold text-destructive">Something went wrong in ${mod}!</h2>\n      <button onClick={() => reset()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">\n        Try again\n      </button>\n    </div>\n  );\n}\n`;
        fs.writeFileSync(errorPath, errorContent);
        console.log(`Created ${errorPath}`);
    }

    // 3. ErrorBoundary component
    if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
    
    const errBoundName = `${cleanCamelMod}ErrorBoundary`;
    const errBoundDir = path.join(componentsDir, errBoundName);
    if (!fs.existsSync(errBoundDir)) fs.mkdirSync(errBoundDir, { recursive: true });
    const errBoundFile = path.join(errBoundDir, `${errBoundName}.tsx`);
    if (!fs.existsSync(errBoundFile)) {
        const errBoundContent = `'use client';\n\n// RESPONSIBILITY: Typed Error Boundary component specific to the ${mod} module.\n// DATA FLOW: Error -> ${errBoundName} -> Fallback UI\n\nimport React from 'react';\n\ninterface Props { children: React.ReactNode; }\ninterface State { hasError: boolean; }\n\nexport class ${errBoundName} extends React.Component<Props, State> {\n  constructor(props: Props) { super(props); this.state = { hasError: false }; }\n  static getDerivedStateFromError() { return { hasError: true }; }\n  render() {\n    if (this.state.hasError) return <div className="p-4 text-red-500">Module specific error occurred.</div>;\n    return this.props.children;\n  }\n}\n`;
        fs.writeFileSync(errBoundFile, errBoundContent);
        console.log(`Created ${errBoundFile}`);
    }

    // 4. EmptyState component
    const emptyStateName = `${cleanCamelMod}EmptyState`;
    const emptyStateDir = path.join(componentsDir, emptyStateName);
    if (!fs.existsSync(emptyStateDir)) fs.mkdirSync(emptyStateDir, { recursive: true });
    const emptyStateFile = path.join(emptyStateDir, `${emptyStateName}.tsx`);
    if (!fs.existsSync(emptyStateFile)) {
        const emptyStateContent = `'use client';\n\n// RESPONSIBILITY: Standardized empty state component for lists/tables in the ${mod} module.\n// DATA FLOW: Parent -> ${emptyStateName} -> DOM\n\ninterface Props {\n  title?: string;\n  description?: string;\n}\n\nexport default function ${emptyStateName}({ title = 'No data found', description = 'Try adjusting your filters.' }: Props) {\n  return (\n    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border border-dashed rounded-lg">\n      <p className="font-medium text-foreground">{title}</p>\n      <p className="text-sm mt-1">{description}</p>\n    </div>\n  );\n}\n`;
        fs.writeFileSync(emptyStateFile, emptyStateContent);
        console.log(`Created ${emptyStateFile}`);
    }

    // 5. Zustand Store
    if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });
    const storeFile = path.join(storeDir, `${mod}_store.ts`);
    if (!fs.existsSync(storeFile)) {
        const storeContent = `// RESPONSIBILITY: Zustand store for managing asynchronous state and data sharing across ${mod}.\n// DATA FLOW: API / Components -> Store -> Components\n\nimport { create } from 'zustand';\n\ninterface ${cleanCamelMod}State {\n  data: any[];\n  setData: (data: any[]) => void;\n}\n\nexport const use${cleanCamelMod}Store = create<${cleanCamelMod}State>((set) => ({\n  data: [],\n  setData: (data) => set({ data }),\n}));\n`;
        fs.writeFileSync(storeFile, storeContent);
        console.log(`Created ${storeFile}`);
    }
});
console.log("Part 2 refactoring complete!");

const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Regular expressions to find hover:bg-gray-50 or hover:bg-white 
      // that are NOT followed somewhere in the same class string by dark:hover:bg-
      
      // We will just do a simpler approach: 
      // replace "hover:bg-gray-50" with "hover:bg-gray-50 dark:hover:bg-gray-800" if "dark:hover:bg-" is not in the line.
      // Wait, multiple classes can be on the same line.
      // Better: Use regex to match className="..." and inside it replace.
      
      content = content.replace(/className=(["'{`])([^"'{`}]*?)\1/g, (match, quote, classes) => {
        let newClasses = classes;
        
        if (newClasses.includes('hover:bg-gray-50') && !newClasses.includes('dark:hover:bg-')) {
          newClasses = newClasses.replace(/hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-gray-800');
        }
        
        if (newClasses.includes('hover:bg-white') && !newClasses.includes('dark:hover:bg-')) {
          newClasses = newClasses.replace(/hover:bg-white/g, 'hover:bg-white dark:hover:bg-[#1E293B]');
        }

        // Handle cases with template literals where classes are split
        // Actually, the above simple regex might miss some complex template literals.
        return `className=${quote}${newClasses}${quote}`;
      });

      // Also do a generic pass line by line for template literals not caught by the simple regex
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes('hover:bg-gray-50') && !line.includes('dark:hover:bg-')) {
          line = line.replace(/hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-gray-800');
          modified = true;
        }
        if (line.includes('hover:bg-white') && !line.includes('dark:hover:bg-')) {
          line = line.replace(/hover:bg-white/g, 'hover:bg-white dark:hover:bg-[#1E293B]');
          modified = true;
        }
        lines[i] = line;
      }
      
      const newContent = lines.join('\n');
      if (newContent !== fs.readFileSync(fullPath, 'utf8')) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('c:\\Users\\Rohit\\Desktop\\Project_to_work\\libary\\libraryManagementFrontendNextJs\\my-app\\src\\app\\superadmin');

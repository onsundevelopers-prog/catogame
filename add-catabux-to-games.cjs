// Script to add Catabux system to all game HTML files
const fs = require('fs');
const path = require('path');

const catabuxScript = `    <!-- Catabux Rewards System -->
    <script src="../../catabux-system.js"></script>`;

const catabuxScriptOneLevel = `    <!-- Catabux Rewards System -->
    <script src="../catabux-system.js"></script>`;

function addCatabuxToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if Catabux already exists
        if (content.includes('catabux-system.js')) {
            console.log(`Catabux already exists in ${filePath}`);
            return;
        }
        
        // Determine the correct path based on directory depth
        const relativePath = path.relative('./public/games', filePath);
        const depth = relativePath.split(path.sep).length - 1;
        
        let scriptToAdd;
        if (depth === 1) {
            scriptToAdd = catabuxScriptOneLevel;
        } else {
            scriptToAdd = catabuxScript;
        }
        
        // Add Catabux script after GTM or at end of head
        if (content.includes('<!-- End Google Tag Manager -->')) {
            content = content.replace(
                '    <!-- End Google Tag Manager -->',
                '    <!-- End Google Tag Manager -->\n    \n' + scriptToAdd
            );
        } else {
            content = content.replace('</head>', '    \n' + scriptToAdd + '\n</head>');
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Added Catabux to ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

function processDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.html')) {
            addCatabuxToFile(fullPath);
        }
    });
}

// Process all HTML files in public/games directory
console.log('Adding Catabux system to all game files...');
processDirectory('./public/games');
console.log('Done!');
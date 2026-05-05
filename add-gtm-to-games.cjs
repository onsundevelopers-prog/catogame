// Script to add Google Tag Manager to all game HTML files
const fs = require('fs');
const path = require('path');

const gtmHeadCode = `    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
    <!-- End Google Tag Manager -->
    `;

const gtmBodyCode = `    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    `;

function addGTMToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if GTM already exists
        if (content.includes('Google Tag Manager')) {
            console.log(`GTM already exists in ${filePath}`);
            return;
        }
        
        // Add GTM to head
        content = content.replace('<head>', '<head>\n' + gtmHeadCode);
        
        // Add GTM to body
        content = content.replace('<body>', '<body>\n' + gtmBodyCode);
        
        fs.writeFileSync(filePath, content);
        console.log(`Added GTM to ${filePath}`);
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
            addGTMToFile(fullPath);
        }
    });
}

// Process all HTML files in public/games directory
console.log('Adding Google Tag Manager to all game files...');
processDirectory('./public/games');
console.log('Done!');
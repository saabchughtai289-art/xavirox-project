const fs = require('fs');
const { execSync } = require('child_process');

try {
    let content = fs.readFileSync('index.js', 'utf8');
    
    // 1. Yeh check karega ke aapke Express server ka variable name kya hai (app, server, etc.)
    let appName = 'app';
    const match = content.match(/(const|let|var)\s+(\w+)\s*=\s*express\(\)/);
    if (match) {
        appName = match[2];
        console.log(`\n🔍 Detected Express app variable: "${appName}"`);
    } else {
        console.log(`\n⚠️ Express variable automatically nahi mila, "app" use kar rahe hain.`);
    }

    // 2. Agar module.exports missing hai toh usey file ke end par add karega
    if (!content.includes('module.exports')) {
        console.log(`📝 'module.exports = ${appName};' ko file ke aakhir mein joda ja raha hai...`);
        content = content.trim() + `\n\nmodule.exports = ${appName};`;
        fs.writeFileSync('index.js', content, 'utf8');
    } else {
        console.log(`ℹ️ module.exports pehle se mojud hai.`);
    }

    // 3. Final Syntax check
    try {
        execSync('node -c index.js', { stdio: 'ignore' });
        console.log("\n✅ SUCCESS: Syntax bilkul perfect hai aur export lag gaya hai!");
    } catch (syntaxError) {
        console.log("\n❌ Syntax checking fail ho gayi. Ek baar 'node -c index.js' chala kar check karein.");
    }

} catch (e) {
    console.log("Error:", e.message);
}
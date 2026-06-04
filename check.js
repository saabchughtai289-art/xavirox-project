const fs = require('fs');
try {
    const lines = fs.readFileSync('index.js', 'utf8').split('\n');
    console.log('\n==== 🔍 LINE 1480 SE 1520 KA CODE ====');
    for (let i = 1479; i < 1520 && i < lines.length; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
    console.log('====================================\n');
} catch (e) {
    console.log('Error:', e.message);
}
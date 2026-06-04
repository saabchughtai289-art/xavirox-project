const fs = require('fs');
try {
    const s = fs.readFileSync('index.js', 'utf8');
    const backticks = (s.match(/`/g)||[]).length;
    const singles = (s.match(/'/g)||[]).length;
    const doubles = (s.match(/"/g)||[]).length;
    const opens = (s.match(/\{/g)||[]).length;
    const closes = (s.match(/\}/g)||[]).length;

    console.log('\n==== 📊 CURRENT STATUS ====');
    console.log('1. Backticks (`):', backticks % 2 === 0 ? '✅ Balanced' : '❌ UNBALANCED');
    console.log('2. Single Quotes (\'):', singles % 2 === 0 ? '✅ Balanced' : '❌ UNBALANCED');
    console.log('3. Double Quotes ("):', doubles % 2 === 0 ? '✅ Balanced' : '❌ UNBALANCED');
    console.log(`4. Brackets: Open { (${opens}) | Close } (${closes})`);
    console.log('===========================\n');

    console.log('==== 📝 LAST 30 LINES OF INDEX.JS ====');
    const lines = s.split('\n');
    console.log(lines.slice(-30).join('\n'));
    console.log('======================================\n');
} catch(e) {
    console.log('Error:', e.message);
}
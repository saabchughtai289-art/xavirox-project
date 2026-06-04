const fs = require('fs');
try {
    const s = fs.readFileSync('index.js', 'utf8');
    const backticks = (s.match(/`/g)||[]).length;
    const singles = (s.match(/'/g)||[]).length;
    const doubles = (s.match(/"/g)||[]).length;
    const opens = (s.match(/\{/g)||[]).length;
    const closes = (s.match(/\}/g)||[]).length;

    console.log('\n==== XAVIROX OS DIAGNOSTIC ====');
    console.log('1. Backticks (`) Line:', backticks % 2 === 0 ? '✅ Balanced' : '❌ UNBALANCED (Khula chuta hai!)');
    console.log('2. Single Quotes (\'):', singles % 2 === 0 ? '✅ Balanced' : '❌ UNBALANCED (Khula chuta hai!)');
    console.log('3. Double Quotes ("):', doubles % 2 === 0 ? '✅ Balanced' : '❌ UNBALANCED (Khula chuta hai!)');
    console.log(`4. Brackets Count: Open { (${opens}) | Close } (${closes})`);
    
    if (opens > closes) {
        console.log(`👉 Aapko file ke aakhir mein exact [ ${opens - closes} ] brackets '}' aur lagane hain.`);
    } else if (closes > opens) {
        console.log(`👉 Aapke paas [ ${closes - opens} ] extra brackets '}' hain, unhe mitao.`);
    } else {
        console.log('✅ Brackets balanced hain!');
    }
    console.log('===============================\n');
} catch(e) {
    console.log('Error:', e.message);
}
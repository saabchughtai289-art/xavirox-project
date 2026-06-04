const fs = require('fs');

try {
    const code = fs.readFileSync('index.js', 'utf8');
    let line = 1;
    let col = 1;
    
    let inString = null; // null, "'", '"', '`'
    let stringStart = { line: 0, col: 0 };
    let inComment = null; // null, '//', '/*'
    
    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const nextChar = code[i+1];
        
        // Newlines handle karein
        if (char === '\n') {
            line++;
            col = 1;
            if (inComment === '//') inComment = null;
            continue;
        }
        
        // Escape character (\) handle karein taake \' ya \` check kharab na kare
        if (char === '\\' && inString) {
            i++; col += 2;
            continue;
        }
        
        // Comments handle karein agar string ke andar nahi hain
        if (!inString) {
            if (!inComment) {
                if (char === '/' && nextChar === '/') {
                    inComment = '//';
                    i++; col += 2; continue;
                }
                if (char === '/' && nextChar === '*') {
                    inComment = '/*';
                    i++; col += 2; continue;
                }
            } else if (inComment === '/*') {
                if (char === '*' && nextChar === '/') {
                    inComment = null;
                    i++; col += 2; continue;
                }
            }
        }
        
        if (inComment) {
            col++;
            continue;
        }
        
        // Quotes state track karein
        if (inString) {
            if (char === inString) {
                inString = null; // Closed!
            }
        } else {
            if (char === "'" || char === '"' || char === '`') {
                inString = char;
                stringStart = { line, col };
            }
        }
        
        col++;
    }
    
    console.log('\n====================================');
    if (inString) {
        const type = inString === '`' ? 'Backtick (`' : `Single Quote (${inString}`;
        console.log(`❌ DUSHMAN MIL GAYA: Unclosed ${type}) mil gaya hai!`);
        console.log(`👉 Yeh is exact jagah par open hua tha: LINE ${stringStart.line}, COLUMN ${stringStart.col}`);
    } else if (inComment === '/*') {
        console.log(`❌ ERROR: Unclosed Multi-line comment (/*) khula reh gaya hai!`);
    } else {
        console.log('✅ Saare Quotes aur Comments bilkul perfectly BALANCED hain!');
    }
    console.log('====================================\n');
    
} catch(e) {
    console.log('Error:', e.message);
}
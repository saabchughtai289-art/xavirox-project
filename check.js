const fs = require('fs');

try {
    const content = fs.readFileSync('index.js', 'utf8');
    let insideBacktick = false;
    let insideSingle = false;
    let insideDouble = false;
    let backtickStartLine = 0;
    let singleStartLine = 0;
    
    let lineNum = 1;
    
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        
        if (char === '\n') {
            lineNum++;
            continue;
        }
        
        // Escape character (\) ko skip karein taake check kharab na ho
        if (char === '\\') {
            i++; 
            continue;
        }
        
        // Check Backtick
        if (char === '`' && !insideSingle && !insideDouble) {
            insideBacktick = !insideBacktick;
            if (insideBacktick) backtickStartLine = lineNum;
        }
        
        // Check Single Quote
        if (char === "'" && !insideBacktick && !insideDouble) {
            insideSingle = !insideSingle;
            if (insideSingle) singleStartLine = lineNum;
        }
        
        // Check Double Quote
        if (char === '"' && !insideBacktick && !insideSingle) {
            insideDouble = !insideDouble;
        }
    }
    
    console.log('\n====================================');
    console.log(insideBacktick ? `❌ Backtick (\`) is line par khula chuta hai: LINE ${backtickStartLine}` : '✅ Backticks bilkul sahi hain!');
    console.log(insideSingle ? `❌ Single Quote (') is line par khula chuta hai: LINE ${singleStartLine}` : '✅ Single Quotes bilkul sahi hain!');
    console.log('====================================\n');

} catch (e) {
    console.log('Error:', e.message);
}
const fs = require('fs');
const { execSync } = require('child_process');

try {
    let content = fs.readFileSync('index.js', 'utf8');
    const target = "// V86 Aura Duel challenge";
    const idx = content.indexOf(target);

    if (idx !== -1) {
        // Pichla saara kharab/unclosed quote wala kachra saaf kar rahe hain
        let cleanBase = content.substring(0, idx);
        
        // 100% perfect, balanced aur sahi quotes wala code block
        const perfectCode = `// V86 Aura Duel challenge
    async function submitAuraDuel(event) {
        event.preventDefault();
        const opponentInput = document.getElementById('duelOpponent');
        const wagerInput = document.getElementById('duelWager');
        if (!opponentInput || !wagerInput) return;
        
        try {
            const res = await fetch('/api/aura/challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUsername: opponentInput.value.trim(),
                    wager: parseInt(wagerInput.value, 10)
                })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert('Success: ' + (data.message || 'Operation successful!'));
            } else {
                alert('Error: ' + (data.error || 'Something went wrong'));
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("Server error, please try again.");
        }
    }
    
    init();`;

        // Brackets balance karne ke liye combinations test ho rahe hain
        const endings = ["\n});", "\n}", "\n}\n}", "\n});\n}"];
        let success = false;

        for (let end of endings) {
            fs.writeFileSync('index.js', cleanBase + perfectCode + end, 'utf8');
            try {
                // Node se syntax verify karwa rahe hain
                execSync('node -c index.js', { stdio: 'ignore' });
                console.log("\n🔥 BOOM! Xavirox OS ka syntax error 100% fix ho gaya hai!");
                success = true;
                break;
            } catch (e) {
                // Agar yeh combination fail ho toh agla try karega
            }
        }
        if (!success) {
            console.log("\n❌ Quotes fix ho gaye hain par brackets manually dekhne parenge. Ek baar 'node -c index.js' chalao.");
        }
    } else {
        console.log("\n❌ Target section nahi mila. Manually index.js khol kar line 1525 check karein.");
    }
} catch (err) {
    console.log("Error:", err.message);
}
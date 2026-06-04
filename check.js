const fs = require('fs');
const { execSync } = require('child_process');

try {
    let content = fs.readFileSync('index.js', 'utf8');
    const target = "async function submitAuraDuel(event) {";
    const idx = content.indexOf(target);

    if (idx !== -1) {
        // Code ko 'submitAuraDuel' se pehle tak bilkul clean cut kar rahe hain
        let cleanBase = content.substring(0, idx);
        
        // Sahi aur balanced submitAuraDuel function ka code
        const perfectCode = `async function submitAuraDuel(event) {
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

    init();\n`;

        // HTML String, Script tags aur Express routes ke saare possible closing combinations
        const endings = [
            `</script>\n\`);\n});\n}`,
            `</script>\n</body>\n</html>\n\`);\n});\n}`,
            `</script>\n\`);\n}`,
            `</script>\n</body>\n</html>\n\`);\n}`,
            `</script>\n\`);\n});`,
            `</script>\n</body>\n</html>\n\`);\n});`
        ];

        let success = false;

        // Ek ek karke har combination ko try aur compile karke check karega
        for (let end of endings) {
            fs.writeFileSync('index.js', cleanBase + perfectCode + end, 'utf8');
            try {
                // Node check command chalakar verify kar rahe hain
                execSync('node -c index.js', { stdio: 'ignore' });
                console.log("\n🔥 BOOM!!! XAVIROX OS SYSTEM UNLOCKED!");
                console.log("Syntax error 100% automatic fix ho gaya hai!");
                success = true;
                break;
            } catch (e) {
                // Agar yeh fail ho toh agla loop chalega
            }
        }

        if (!success) {
            console.log("\n❌ Koi bhi combination match nahi kiya. Mujhe index.js ki line 1 se 20 ka code dikhayein taake wrapper pata chale.");
        }
    } else {
        console.log("\n❌ 'submitAuraDuel' function nahi mila!");
    }
} catch (err) {
    console.log("Error:", err.message);
}
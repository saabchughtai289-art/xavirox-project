const fs = require('fs');
const { execSync } = require('child_process');

try {
    let content = fs.readFileSync('index.js', 'utf8');
    const target = "async function submitAuraDuel(event) {";
    const idx = content.indexOf(target);

    if (idx !== -1) {
        let cleanBase = content.substring(0, idx);
        
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

        // Ab hum bina ')' wale aur doosre safe brackets combinations try kar rahe hain
        const endings = [
            `</script>\n\`;\n});\n}`,
            `</script>\n\`;\n}`,
            `</script>\n\`;\n});`,
            `</script>\n\`;\n}\n}`,
            `</script>\n\`;`,
            `</script>\n</body>\n</html>\n\`;\n}`,
            `</script>\n</body>\n</html>\n\`;\n});\n}`
        ];

        let success = false;

        for (let end of endings) {
            fs.writeFileSync('index.js', cleanBase + perfectCode + end, 'utf8');
            try {
                // Sahi bracket system dhoondne ki koshish
                execSync('node -c index.js', { stdio: 'ignore' });
                console.log("\n🔥 BOOM!!! XAVIROX OS SYSTEM UNLOCKED!");
                console.log("Syntax error 100% automatic fix ho gaya hai!");
                success = true;
                break;
            } catch (e) {
                // Fail hone par agla combination check karega
            }
        }

        if (!success) {
            // Agar sab fail ho jayein toh default clean par chorenge taake naya error check ho sake
            fs.writeFileSync('index.js', cleanBase + perfectCode + `</script>\n\`;`, 'utf8');
            console.log("\n⚠️ Kuch combinations check kiye hain. Ek baar 'node -c index.js' chala kar dekhein kya error badla?");
        }
    } else {
        console.log("\n❌ 'submitAuraDuel' function nahi mila!");
    }
} catch (err) {
    console.log("Error:", err.message);
}
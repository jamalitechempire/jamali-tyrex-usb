const { cmd } = require('../command');
const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');

// fakevCard ya bot yako
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐓𝐘𝐑𝐄𝐗-𝐓𝐄𝐂𝐇;\nTEL;type=CELL;type=VOICE;waid=255700000000:+255700000000\nEND:VCARD`
    }
  }
};

const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

cmd({
    pattern: "alive2",  // unaweza kubadilisha kuwa "alive" ukitaka
    desc: "Angalia kama bot iko hai",
    category: "main",
    react: "💚",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushName }) => {
    try {
        const uptime = formatUptime(process.uptime());
        const timeZone = 'Africa/Dar_es_Salaam';
        const time = moment.tz(timeZone).format('hh:mm:ss A');
        const date = moment.tz(timeZone).format('DD/MM/YYYY');
        const mode = config.MODE === 'public' ? 'PUBLIC' : 'PRIVATE';
        const prefix = config.PREFIX || '.';
        
        const aliveMessage = 
`┏━❑ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓 ━━━━━━━━━
┃ ✅ Hali: IKO HAI
┃ 👤 Mtumiaji: ${pushName || sender.split('@')[0]}
┃ 🚀 Modhi: ${mode}
┃ 🔧 Kiambishi: ${prefix}
┃ ⏱️ Muda wa kazi: ${uptime}
┃ 📅 Tarehe: ${date}
┃ 🕐 Saa: ${time}
┃ 💚 Afya ya Bot: 100%
┗━━━━━━━━━━━━━━━━━━━━`;
        
        // Vifungo (buttons)
        const buttons = [
            { 
                buttonId: `${prefix}menu`, 
                buttonText: { displayText: '📋 MENU' }, 
                type: 1 
            },
            { 
                buttonId: `${prefix}owner`, 
                buttonText: { displayText: '👑 OWNER' }, 
                type: 1 
            },
            { 
                buttonId: `${prefix}ping`, 
                buttonText: { displayText: '📊 PING' }, 
                type: 1 
            },
            { 
                buttonId: `${prefix}help`, 
                buttonText: { displayText: '❓ HELP' }, 
                type: 1 
            }
        ];
        
        // Badilisha URL na picha yako (nimeweka ile ya menu)
        const imageUrl = 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg';
        
        try {
            // Tuma picha pamoja na vifungo
            await conn.sendMessage(from, 
                { 
                    image: { url: imageUrl },
                    caption: aliveMessage,
                    footer: '📌 Bonyeza kitufe hapa chini',
                    buttons: buttons,
                    headerType: 4
                },
                { quoted: fakevCard }
            );
        } catch (imageError) {
            console.log("Hitilafu ya picha na vifungo, inajaribu maandishi tu:", imageError);
            
            try {
                // Jaribu kutumia maandishi tu na vifungo
                await conn.sendMessage(from, 
                    { 
                        text: aliveMessage,
                        footer: '📌 Bonyeza kitufe hapa chini',
                        buttons: buttons,
                        headerType: 1
                    },
                    { quoted: fakevCard }
                );
            } catch (buttonError) {
                console.log("Hitilafu ya vifungo, inatuma maandishi tu:", buttonError);
                await conn.sendMessage(from, 
                    { text: aliveMessage + '\n\nTumia: .menu | .owner | .ping | .help' },
                    { quoted: fakevCard }
                );
            }
        }
        
    } catch (e) {
        reply("❌ Hitilafu: " + e.message);
    }
});

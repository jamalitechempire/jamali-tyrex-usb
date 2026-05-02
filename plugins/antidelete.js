// 🌟 AntiDelete Command — TYREX MD Edition
const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const {
    getAnti,
    setAnti,
    initializeAntiDeleteSettings
} = require('../data/antidel');

// FakevCard ya TYREX MD
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter', // Newsletter yako
            newsletterName: '✨ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 ✨',
            serverMessageId: 143,
        },
    };
};

// 🔁 Ensure AntiDelete settings exist on startup
initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ["antidel", "ad"],
    desc: "Configure AntiDelete settings",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe, sender }) => {

    // 🔐 Owner-only access
    if (!isCreator) {
        return await conn.sendMessage(from, { 
            text: "🚫 *𝙰𝚖𝚛𝚒 𝚑𝚒𝚕𝚒 𝚒𝚗𝚊𝚝𝚞𝚖𝚒𝚔𝚊 𝚔𝚠𝚊 𝚖𝚖𝚒𝚕𝚒𝚔𝚒 𝚙𝚎𝚔𝚎.*\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

    try {
        const command = q?.toLowerCase();

        switch (command) {

            // 🔴 ZIMA AntiDelete kila mahali
            case "on":
                await setAnti("gc", false);
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: "❌ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙸𝙼𝙴𝚉𝚆𝙰*\n\n_𝙼𝚊𝚔𝚊𝚗𝚍𝚒𝚜𝚑𝚒 𝚗𝚊 𝙳𝙼 𝚣𝚒𝚖𝚎𝚠𝚊 𝙾𝙵𝙵._\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔕 Zima AntiDelete kwa makundi
            case "off gc":
                await setAnti("gc", false);
                return await conn.sendMessage(from, { 
                    text: "❌ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙺𝚠𝚊 𝙼𝚊𝚔𝚞𝚗𝚍𝚒 𝚉𝚒𝚖𝚎𝚠𝚊.*\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔕 Zima AntiDelete kwa DM
            case "off dm":
                await setAnti("dm", false);
                return await conn.sendMessage(from, { 
                    text: "❌ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙺𝚠𝚊 𝙳𝙼 𝚉𝚒𝚖𝚎𝚠𝚊.*\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 🔁 Geuza hali ya kundi
            case "set gc": {
                const gcStatus = await getAnti("gc");
                await setAnti("gc", !gcStatus);
                return await conn.sendMessage(from, { 
                    text: `🔄 *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙼𝚊𝚔𝚞𝚗𝚍𝚒* 𝚜𝚊𝚜𝚊 𝚒𝚖𝚎𝚠𝚊 *${!gcStatus ? "𝙸𝙼𝙴𝚆𝙰 ✅" : "𝙸𝙼𝙴𝚉𝚆𝙰 ❌"}*\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // 🔁 Geuza hali ya DM
            case "set dm": {
                const dmStatus = await getAnti("dm");
                await setAnti("dm", !dmStatus);
                return await conn.sendMessage(from, { 
                    text: `🔄 *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙳𝙼* 𝚜𝚊𝚜𝚊 𝚒𝚖𝚎𝚠𝚊 *${!dmStatus ? "𝙸𝙼𝙴𝚆𝙰 ✅" : "𝙸𝙼𝙴𝚉𝚆𝙰 ❌"}*\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // ✅ Washa AntiDelete kila mahali
            case "set all":
                await setAnti("gc", true);
                await setAnti("dm", true);
                return await conn.sendMessage(from, { 
                    text: "✅ *𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝙸𝙼𝙴𝚆𝙰 𝙺𝚆𝙰 𝙼𝙰𝙷𝙰𝙻𝙸 𝚈𝙾𝚃𝙴.*\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });

            // 📊 Onyesha hali ya sasa
            case "status": {
                const currentDmStatus = await getAnti("dm");
                const currentGcStatus = await getAnti("gc");

                return await conn.sendMessage(from, { 
                    text: "📊 *𝙷𝙰𝙻𝙸 𝚈𝙰 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎*\n\n" +
                          `• *𝙳𝙼:* ${currentDmStatus ? "𝙸𝙼𝙴𝚆𝙰 ✅" : "𝙸𝙼𝙴𝚉𝚆𝙰 ❌"}\n` +
                          `• *𝙼𝙰𝙺𝚄𝙽𝙳𝙸:* ${currentGcStatus ? "𝙸𝙼𝙴𝚆𝙰 ✅" : "𝙸𝙼𝙴𝚉𝚆𝙰 ❌"}\n\n` +
                          "> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }

            // 📖 Msaada
            default:
                return await conn.sendMessage(from, { 
                    text: "📖 *𝙼𝚊𝚎𝚕𝚎𝚣𝚎𝚘 𝚢𝚊 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎*\n\n" +
                          "• `.antidelete on` — 𝙸𝚖𝚊 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚔𝚠𝚊 𝚖𝚊𝚑𝚊𝚕𝚒 𝚢𝚘𝚝𝚎\n" +
                          "• `.antidelete off gc` — 𝙸𝚖𝚊 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚔𝚠𝚊 𝚖𝚊𝚔𝚞𝚗𝚍𝚒 𝚝𝚞\n" +
                          "• `.antidelete off dm` — 𝙸𝚖𝚊 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚔𝚠𝚊 𝙳𝙼\n" +
                          "• `.antidelete set gc` — 𝙶𝚎𝚞𝚣𝚊 𝚑𝚊𝚕𝚒 𝚢𝚊 𝚖𝚊𝚔𝚞𝚗𝚍𝚒\n" +
                          "• `.antidelete set dm` — 𝙶𝚎𝚞𝚣𝚊 𝚑𝚊𝚕𝚒 𝚢𝚊 𝙳𝙼\n" +
                          "• `.antidelete set all` — 𝚆𝚊𝚜𝚑𝚊 𝙰𝚗𝚝𝚒𝙳𝚎𝚕𝚎𝚝𝚎 𝚙𝚊𝚗𝚓𝚊 𝚖𝚘𝚓𝚊\n" +
                          "• `.antidelete status` — 𝙰𝚗𝚐𝚊𝚕𝚒𝚊 𝚑𝚊𝚕𝚒 𝚢𝚊 𝚜𝚊𝚜𝚊\n\n" +
                          "> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
        }

    } catch (error) {
        console.error("❌ AntiDelete Command Error:", error);
        return await conn.sendMessage(from, { 
            text: "⚠️ *𝙷𝚒𝚝𝚒𝚕𝚊𝚏𝚞 𝚒𝚖𝚎𝚝𝚘𝚔𝚎𝚊 𝚠𝚊𝚔𝚊𝚝𝚒 𝚠𝚊 𝚔𝚞𝚜𝚒𝚗𝚍𝚊.*\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

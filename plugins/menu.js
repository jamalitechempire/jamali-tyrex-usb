const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const { 
    getOwnerName, 
    getWatermark, 
    getStickerAuthor,
    getStickerPack,
    getFormattedTime,
    readSettings,
    getBotName,
    getMenuImage
} = require('./settings'); // Adjust path based on your structure

// Helper: format bytes
const formatSize = (bytes) => {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + 'GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'MB';
  return (bytes / 1024).toFixed(0) + 'KB';
};

// Helper: format uptime
const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

// Context info with your newsletter JID
const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter', // Channel yako
            newsletterName: `✨ TYREX MD ✨`,
            serverMessageId: 143,
        },
    };
};

cmd({
  pattern: 'menu',
  alias: ['help', 'allmenu'],
  react: '📋',
  category: 'main',
  filename: __filename,
  desc: 'Show bot main menu with system info (TYREX MD style)'
}, async (conn, mek, m, { from, sender, pushName, reply }) => {
  try {
    // Read settings
    const ownerName = await getOwnerName();
    const watermark = await getWatermark();
    const stickerAuthor = await getStickerAuthor();
    const stickerPack = await getStickerPack();
    const botName = await getBotName();
    const settings = await readSettings();
    
    const prefix = config.PREFIX || '.';
    const timeZone = settings.timezone || 'Africa/Dar_es_Salaam';
    const time = moment.tz(timeZone).format('hh:mm:ss A');
    const date = moment.tz(timeZone).format('DD/MM/YYYY');
    const uptime = formatUptime(process.uptime());
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const ram = `${formatSize(usedRam)}/${formatSize(totalRam)}`;
    const mode = config.MODE === 'public' ? 'PUBLIC' : 'PRIVATE';
    const totalCommands = commands.filter(a => a.pattern).length;
    const ping = Math.floor(Math.random() * 50) + 10; // optional

    // Group commands by category
    const commandsByCategory = {};
    for (const command of commands) {
      if (command.category && !command.dontAdd && command.pattern) {
        const cat = command.category.toUpperCase();
        if (!commandsByCategory[cat]) commandsByCategory[cat] = [];
        commandsByCategory[cat].push(command.pattern.split('|')[0]);
      }
    }

    // ========== TYREX MD HEADER ==========
    let menu = `*╭┄┄┄🌸🌹 TYREX MD 🌹🌸┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ ᴏᴡɴᴇʀ:* ${ownerName}
*┃◆┊ ᴛᴇᴄʜ:* TYREX
*┃◆┊ ʙᴀɪʟᴇʏs:* ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ
*┃◆┊ ᴅᴀᴛᴇ:* ${date}
*┃◆┊ ᴛʏᴘᴇ:* ɴᴏᴅᴇᴊs
*┃◆┊ ʀᴜɴᴛɪᴍᴇ:* ${uptime}
*┃◆┊ ᴘʀᴇғɪx:* ${prefix}
*┃◆┊ ᴍᴏᴅᴇ:* ${mode}
*┃◆┊ ʀᴀᴍ:* ${ram}
*┃◆┊ ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅs:* ${totalCommands}
*┃◆┊ sᴛᴀᴛᴜs:* *ᴏɴʟɪɴᴇ*
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*`;

    // ========== COMMAND SECTIONS ==========
    for (const category in commandsByCategory) {
      menu += `\n*╭┈┈┄🌸🌹 ${category} 🌹🌸┄┄┄◈*`;
      const sorted = commandsByCategory[category].sort();
      for (const cmdName of sorted) {
        menu += `\n*┋▸ ${prefix}${cmdName}*`;
      }
      menu += `\n*╰┄┄┄┄┄┈┈┈┈┄┄┄◈*`;
    }

    // ========== FOOTER ==========
    menu += `\n\n*> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech*`;

    // ========== SEND WITH IMAGE (NEW URL) ==========
    const menuImage = 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg'; // New image link
    
    try {
      await conn.sendMessage(from, {
        image: { url: menuImage },
        caption: menu,
        contextInfo: getContextInfo(sender) // Adds newsletter forwarding info
      }, { quoted: mek });
    } catch (imageError) {
      console.log("Image error, sending text only:", imageError);
      await conn.sendMessage(from, {
        text: menu,
        contextInfo: getContextInfo(sender)
      }, { quoted: mek });
    }

  } catch (e) {
    console.error("Menu Error:", e);
    reply(`❌ 𝙴𝚛𝚛𝚘𝚛 𝚕𝚘𝚊𝚍𝚒𝚗𝚐 𝚖𝚎𝚗𝚞: ${e.message}`);
  }
});

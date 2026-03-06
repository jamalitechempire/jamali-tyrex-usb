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
    readSettings
} = require('./settings'); // Adjust path based on where your settings file is

// Define monospace function here to avoid import issues
const monospace = (text) => `\`${text}\``;

const formatSize = (bytes) => {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + 'GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'MB';
  return (bytes / 1024).toFixed(0) + 'KB';
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
  pattern: 'menu',
  alias: ['help', 'allmenu'],
  react: '📋',
  category: 'main',
  filename: __filename,
  desc: 'Show bot main menu with system info'
}, async (conn, mek, m, { from, sender, pushName, reply }) => {
  try {
    // Get settings
    const settings = await readSettings();
    const ownerName = await getOwnerName();
    const watermark = await getWatermark();
    const stickerAuthor = await getStickerAuthor();
    const stickerPack = await getStickerPack();
    const formattedTime = await getFormattedTime('full');
    
    const prefix = config.PREFIX || '.';
    const timeZone = settings.timezone || 'Africa/Dar_es_Salaam';
    const time = moment.tz(timeZone).format('hh:mm:ss A');
    const date = moment.tz(timeZone).format('DD/MM/YYYY');
    const uptime = formatUptime(process.uptime());
    const totalRam = os.totalmem();
    const usedRam = totalRam - os.freemem();
    const ram = `${formatSize(usedRam)}/${formatSize(totalRam)}`;
    const ping = Math.floor(Math.random() * 50) + 10;
    const mode = config.MODE === 'public' ? 'PUBLIC' : 'PRIVATE';
    const totalCommands = commands.filter(a => a.pattern).length;

    // Group commands by category
    const commandsByCategory = {};
    for (const command of commands) {
      if (command.category && !command.dontAdd && command.pattern) {
        const cat = command.category.toUpperCase();
        if (!commandsByCategory[cat]) commandsByCategory[cat] = [];
        commandsByCategory[cat].push(command.pattern.split('|')[0]);
      }
    }

    // HEADER - Using settings
    let menu = `┏━❑ *${settings.botName} MENU* ━━━━━━━━━
┃ 🚀 𝙼𝚘𝚍𝚎: ${mode}
┃ ⚙️ 𝙿𝚛𝚎𝚏𝚒𝚡: ${prefix}
┃ 👤 𝚄𝚜𝚎𝚛: ${pushName || sender.split('@')[0]}
┃ 👑 𝙾𝚠𝚗𝚎𝚛: ${ownerName}
┃ 📦 𝙿𝚕𝚞𝚐𝚒𝚗𝚜: ${totalCommands}
┃ ⏱️ 𝚄𝚙𝚝𝚒𝚖𝚎: ${uptime}
┃ 📅 𝙳𝚊𝚝𝚎: ${date}
┃ 🕐 𝚃𝚒𝚖𝚎: ${time}
┃ 💾 𝚁𝙰𝙼: ${ram}
┃ 🖼️ 𝚂𝚝𝚒𝚌𝚔𝚎𝚛: ${stickerAuthor} | ${stickerPack}
┗━━━━━━━━━━━━━━━━━━━━

*📋 𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂*`;

    // COMMAND LIST
    for (const category in commandsByCategory) {
      menu += `\n\n┏━❑ *${category}* ━━━━━━━━━\n`;
      const sorted = commandsByCategory[category].sort();
      for (const cmdName of sorted) {
        menu += `┃ ⤷ ${prefix}${cmdName}\n`;
      }
      menu += `┗━━━━━━━━━━━━━━━━━━━━`;
    }

    menu += `\n\n┏━━━━━━━━━━━━━━━━━━━━┓
┃ ${watermark}
┃ 𝚂𝚒𝚕𝚊 𝚃𝚎𝚌𝚑 🔧
┗━━━━━━━━━━━━━━━━━━━━┛`;

    // Try simple image URL first
    const imageUrl = config.MENU_IMAGE_URL || 'https://files.catbox.moe/36vahk.png';
    
    // Test 1: Send with image
    try {
      await conn.sendMessage(from, {
        image: { url: imageUrl },
        caption: menu,
      }, { quoted: mek });
      
    } catch (imageError) {
      console.log("Image error, sending text only:", imageError);
      
      // Test 2: Send text only
      await conn.sendMessage(from, {
        text: menu,
      }, { quoted: mek });
    }

  } catch (e) {
    console.error("Menu Error:", e);
    reply(`❌ 𝙴𝚛𝚛𝚘𝚛 𝚕𝚘𝚊𝚍𝚒𝚗𝚐 𝚖𝚎𝚗𝚞: ${e.message}`);
  }
});

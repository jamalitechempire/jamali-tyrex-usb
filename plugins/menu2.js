 const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "menu2",
    desc: "Show bot menu",
    category: "main",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushName, isOwner }) => {
    try {
        const prefix = config.PREFIX || '.';
        
        const menuText = `╭┄┄┄🌸🌹 *TYREX MD MENU* 🌹🌸┄┄┄⊷
┃ 👋 Hello ${pushName || sender.split('@')[0]}
┃ 🤖 Bot: TYREX MD
┃ 📌 Prefix: ${prefix}
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷

*📋 MAIN MENU*
┃ ${prefix}alive - Check bot status
┃ ${prefix}ping - Check bot speed
┃ ${prefix}menu - Show this menu
┃ ${prefix}owner - Show owner info
┃ ${prefix}help - Get help

*⚙️ GROUP MENU*
┃ ${prefix}group - Group settings
┃ ${prefix}tagall - Tag all members
┃ ${prefix}link - Get group link
┃ ${prefix}promote - Promote member
┃ ${prefix}demote - Demote member

*🎮 FUN MENU*
┃ ${prefix}sticker - Create sticker
┃ ${prefix}toimage - Convert to image
┃ ${prefix}quote - Random quote
┃ ${prefix}fact - Random fact

${isOwner ? '*👑 OWNER MENU*\n┃ ${prefix}bc - Broadcast\n┃ ${prefix}setmenu - Set menu\n┃ ${prefix}restart - Restart bot\n' : ''}
> ® 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 | Choose category below`;

        const buttons = [
            { 
                buttonId: `${prefix}alive`, 
                buttonText: { displayText: '💚 ALIVE' }, 
                type: 1 
            },
            { 
                buttonId: `${prefix}ping`, 
                buttonText: { displayText: '📊 PING' }, 
                type: 1 
            },
            { 
                buttonId: `${prefix}owner`, 
                buttonText: { displayText: '👑 OWNER' }, 
                type: 1 
            },
            { 
                buttonId: `${prefix}help`, 
                buttonText: { displayText: '❓ HELP' }, 
                type: 1 
            }
        ];
        
        const sections = [
            {
                title: '📋 MAIN MENU',
                rows: [
                    { title: `${prefix}alive`, description: 'Check bot status', rowId: `${prefix}alive` },
                    { title: `${prefix}ping`, description: 'Check bot speed', rowId: `${prefix}ping` },
                    { title: `${prefix}menu`, description: 'Show this menu', rowId: `${prefix}menu` },
                    { title: `${prefix}owner`, description: 'Show owner info', rowId: `${prefix}owner` }
                ]
            },
            {
                title: '⚙️ GROUP MENU',
                rows: [
                    { title: `${prefix}group`, description: 'Group settings', rowId: `${prefix}group` },
                    { title: `${prefix}tagall`, description: 'Tag all members', rowId: `${prefix}tagall` },
                    { title: `${prefix}link`, description: 'Get group link', rowId: `${prefix}link` }
                ]
            },
            {
                title: '🎮 FUN MENU',
                rows: [
                    { title: `${prefix}sticker`, description: 'Create sticker', rowId: `${prefix}sticker` },
                    { title: `${prefix}toimage`, description: 'Convert to image', rowId: `${prefix}toimage` },
                    { title: `${prefix}quote`, description: 'Random quote', rowId: `${prefix}quote` }
                ]
            }
        ];
        
        try {
            await conn.sendMessage(from, {
                text: menuText,
                footer: '⬇️ Click buttons below ⬇️',
                buttons: buttons,
                headerType: 1
            }, { quoted: mek });
            
        } catch (err1) {
            console.log("Simple buttons failed, trying list message:", err1);
            
            try {
                await conn.sendMessage(from, {
                    text: menuText,
                    footer: '📌 Select category from list',
                    title: 'TYREX MD MENU',
                    buttonText: '📋 MENU',
                    sections: sections
                }, { quoted: mek });
                
            } catch (err2) {
                console.log("List message failed, sending normal text:", err2);
                await conn.sendMessage(from, { text: menuText }, { quoted: mek });
            }
        }
        
    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});

 const { cmd } = require("../command");
const fs = require('fs');
const path = require('path');
const languages = require('../lib/languages');

const langDbPath = path.join(__dirname, '../data/user_lang.json');

let userLanguages = {};
try {
    if (fs.existsSync(langDbPath)) {
        userLanguages = JSON.parse(fs.readFileSync(langDbPath));
    }
} catch (e) {
    console.error('Error loading language database:', e);
}

function saveUserLanguage(userJid, langCode) {
    try {
        userLanguages[userJid] = {
            code: langCode,
            updatedAt: Date.now()
        };
        fs.writeFileSync(langDbPath, JSON.stringify(userLanguages, null, 2));
        return true;
    } catch (e) {
        console.error('Error saving language:', e);
        return false;
    }
}

function getUserLanguage(userJid) {
    return userLanguages[userJid]?.code || 'sw';
}

function getLangText(userJid, key) {
    const langCode = getUserLanguage(userJid);
    const lang = languages[langCode] || languages['sw'];
    
    const keys = key.split('.');
    let value = lang;
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            let fallback = languages['sw'];
            for (const fk of keys) {
                fallback = fallback?.[fk];
            }
            return fallback || key;
        }
    }
    return value;
}

// ==================== LANGUAGE COMMAND ====================
cmd({
    pattern: "lang",
    alias: ["language", "lugha", "اللغة"],
    desc: "Change bot language",
    category: "settings",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const args = q.toLowerCase().trim();
        
        if (!args) {
            const currentLang = getUserLanguage(sender);
            const current = languages[currentLang];
            
            let msg = `🌐 *LANGUAGE SETTINGS*\n\n`;
            msg += `${getLangText(sender, 'langCurrent')} ${current.flag} ${current.name}\n\n`;
            msg += `${getLangText(sender, 'langList')}\n`;
            
            for (const [code, lang] of Object.entries(languages)) {
                const status = code === currentLang ? '✅' : '🔘';
                msg += `${status} ${lang.flag} .lang ${code} - ${lang.name}\n`;
            }
            
            msg += `\n${getLangText(sender, 'langChoose')}\n\n> ® Powered by Tyrex Tech`;
            
            return reply(msg);
        }
        
        if (!languages[args]) {
            return reply(`❌ Language "${args}" not found. Choose: sw, en, ar\n\n> ® Powered by Tyrex Tech`);
        }
        
        if (saveUserLanguage(sender, args)) {
            const newLang = languages[args];
            reply(`${getLangText(sender, 'langChanged')} ${newLang.flag} ${newLang.name}!\n\n> ® Powered by Tyrex Tech`);
            
            setTimeout(() => {
                const confirmMsg = getLangText(sender, 'success');
                conn.sendMessage(from, { text: confirmMsg }, { quoted: m });
            }, 500);
        } else {
            reply(getLangText(sender, 'error') + ' Failed to save language.\n\n> ® Powered by Tyrex Tech');
        }
        
    } catch (e) {
        console.error('Language command error:', e);
        reply('❌ Error in language command.\n\n> ® Powered by Tyrex Tech');
    }
});

// ==================== MY LANGUAGE COMMAND ====================
cmd({
    pattern: "mylang",
    alias: ["currentlang", "lughayangu"],
    desc: "Show your current language",
    category: "settings",
    react: "🔤",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const currentLang = getUserLanguage(sender);
        const lang = languages[currentLang];
        
        reply(`${getLangText(sender, 'langCurrent')} ${lang.flag} ${lang.name}\n\n> ® Powered by Tyrex Tech`);
        
    } catch (e) {
        console.error('MyLang error:', e);
        reply('❌ Error.\n\n> ® Powered by Tyrex Tech');
    }
});

// ==================== RESET LANGUAGE COMMAND ====================
cmd({
    pattern: "resetlang",
    alias: ["defaultlang"],
    desc: "Reset language to default (Swahili)",
    category: "settings",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        if (saveUserLanguage(sender, 'sw')) {
            reply(`${getLangText(sender, 'langChanged')} 🇹🇿 Kiswahili (Default)!\n\n> ® Powered by Tyrex Tech`);
        } else {
            reply(getLangText(sender, 'error') + '\n\n> ® Powered by Tyrex Tech');
        }
    } catch (e) {
        console.error('Reset lang error:', e);
        reply('❌ Error.\n\n> ® Powered by Tyrex Tech');
    }
});

module.exports = {
    getUserLanguage,
    getLangText,
    languages
};

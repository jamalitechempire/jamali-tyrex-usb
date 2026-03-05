const { cmd } = require("../command");
const axios = require("axios");

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

const processedMessages = new Set();

cmd(
  {
    pattern: "apk",
    alias: ["app", "downloadapk", "androidapp", "apkfab"],
    desc: "Download APK files from APKFab",
    category: "download",
    react: "📱",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender }) => {
    try {
      if (processedMessages.has(m.key.id)) return;
      processedMessages.add(m.key.id);
      setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

      if (!q) {
        return await conn.sendMessage(from, { 
          text: "👉 *𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊𝚗 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎 𝚘𝚛 𝙿𝚊𝚌𝚔𝚊𝚐𝚎 𝙸𝙳*\n\n*Example:* .apk whatsapp\n*Example:* .apk com.whatsapp\n*Example:* .apk https://apkfab.com/whatsapp/com.whatsapp\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

      // Build the APKFab URL
      let apkfabUrl;
      
      // Check if user provided full URL
      if (q.includes('apkfab.com')) {
        apkfabUrl = q.trim();
      } 
      // Check if user provided package name (com.whatsapp)
      else if (q.includes('.')) {
        // Try to find app name from package
        const packageName = q.trim();
        // Extract app name from package (e.g., com.whatsapp -> whatsapp)
        const appName = packageName.split('.').pop() || packageName;
        apkfabUrl = `https://apkfab.com/${appName}/${packageName}`;
      }
      // Assume it's just app name (e.g., whatsapp, instagram)
      else {
        const appName = q.trim().toLowerCase();
        apkfabUrl = `https://apkfab.com/${appName}`;
      }

      // API request using the new APKFab endpoint
      const apiUrl = `https://api.bk9.dev/download/apkfab?url=${encodeURIComponent(apkfabUrl)}`;
      const response = await axios.get(apiUrl);
      
      if (!response.data || !response.data.status) {
        return await conn.sendMessage(from, { 
          text: `❌ *𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚊𝚙𝚙*\n\n𝚁𝚎𝚊𝚜𝚘𝚗: ${response.data?.message || 'App not found on APKFab'}\n\n> © Powered by Sila Tech`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      const appData = response.data.BK9;
      
      // Check if BK9 object has data
      if (!appData || Object.keys(appData).length === 0) {
        return await conn.sendMessage(from, { 
          text: "❌ *𝙰𝚙𝚙 𝚍𝚊𝚝𝚊 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍*\n\n𝙼𝚊𝚔𝚎 𝚜𝚞𝚛𝚎 𝚝𝚑𝚎 𝚊𝚙𝚙 𝚎𝚡𝚒𝚜𝚝𝚜 𝚘𝚗 𝙰𝙿𝙺𝙵𝚊𝚋.\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // Extract download URL - try different possible paths
      let downloadUrl = null;
      
      if (appData.download) {
        downloadUrl = appData.download;
      } else if (appData.download_url) {
        downloadUrl = appData.download_url;
      } else if (appData.url) {
        downloadUrl = appData.url;
      } else if (appData.link) {
        downloadUrl = appData.link;
      } else {
        // Try to find any URL in the object
        for (const key in appData) {
          if (typeof appData[key] === 'string' && 
              (appData[key].startsWith('http') && 
               (appData[key].includes('.apk') || appData[key].includes('download')))) {
            downloadUrl = appData[key];
            break;
          }
        }
      }

      if (!downloadUrl) {
        return await conn.sendMessage(from, { 
          text: "❌ *𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚄𝚁𝙻 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍*\n\n𝚃𝚑𝚎 𝙰𝙿𝙸 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚍𝚘𝚎𝚜 𝚗𝚘𝚝 𝚌𝚘𝚗𝚝𝚊𝚒𝚗 𝚊 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚕𝚒𝚗𝚔.\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // Prepare app info
      const appName = appData.name || appData.title || q;
      const appVersion = appData.version || appData.ver || 'Latest';
      const appSize = appData.size || appData.file_size || 'Unknown';
      const appDeveloper = appData.developer || appData.author || 'Unknown';
      const appIcon = appData.icon || appData.thumbnail || null;

      const appInfo = `
📱 *𝙰𝙿𝙺 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛 (𝙰𝙿𝙺𝙵𝚊𝚋)*

*𝙰𝚙𝚙:* ${appName}
*𝚅𝚎𝚛𝚜𝚒𝚘𝚗:* ${appVersion}
*𝚂𝚒𝚣𝚎:* ${appSize}
*𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛:* ${appDeveloper}

⬇️ *𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐...*

> © Powered by Sila Tech
      `;

      // Send app info with thumbnail if available
      if (appIcon) {
        await conn.sendMessage(from, {
          image: { url: appIcon },
          caption: appInfo,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      } else {
        await conn.sendMessage(from, { 
          text: appInfo,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // Send the APK file
      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "application/vnd.android.package-archive",
        fileName: `${appName.replace(/[^a-zA-Z0-9]/g, '_')}_${appVersion}.apk`,
        caption: `✅ *${appName} downloaded successfully*\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
      console.error("APK Download Error:", e);
      
      let errorMessage = e.message;
      if (e.response?.status === 404) {
        errorMessage = "App not found on APKFab. Make sure the app name is correct.";
      } else if (e.code === 'ECONNREFUSED') {
        errorMessage = "Connection to API server failed.";
      } else if (e.message.includes('Cannot read properties')) {
        errorMessage = "API response format changed. Please try again later.";
      }

      await conn.sendMessage(from, { 
        text: `⚠️ *𝙴𝚛𝚛𝚘𝚛:* ${errorMessage}\n\n*Example:* .apk whatsapp\n*Example:* .apk com.whatsapp\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
  }
);

console.clear()
console.log("📳 Starting JAMALI TECH EMPIRE...")

// ============ GLOBAL ANTI-CRASH ============
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err)
})
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason)
})

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const GroupEvents = require('./lib/groupevents')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type')
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const { handleAntiCall } = require('./plugins/settis2')
const prefix = config.PREFIX

// ============ OWNER CONFIGURATION ============
const configOwnerNumbers = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',') : []
const ownerNumber = ['255628378557', ...configOwnerNumbers].map(num => num.trim())

const ownerJids = ownerNumber.map(num => {
  if (num.includes('@s.whatsapp.net')) return num
  if (num.includes('-')) return num
  return num + '@s.whatsapp.net'
})

console.log('👑 Owner Numbers:', ownerNumber)
console.log('👑 Owner JIDs:', ownerJids)

// ============ SECURITY FEATURES DATABASE ============
const securityDB = {
  antiMedia: {
    enabled: false,
    deleteSilently: true,
    mediaTypes: {
      image: true,
      video: true,
      audio: true,
      document: true,
      sticker: true,
      gif: true
    },
    allowedGroups: []
  },
  antiTag: {
    enabled: false,
    maxMentions: 5,
    action: 'warn',
    warnCount: 3
  },
  antiBug: {
    enabled: false,
    blockBugMessages: true,
    logBugs: true
  },
  antiSpam: {
    enabled: false,
    maxMessages: 5,
    timeWindow: 5000,
    action: 'warn',
    warnCount: 3,
    userMessages: new Map()
  },
  antiBan: {
    enabled: true,
    protectOwner: true,
    protectAdmins: true,
    protectBot: true,
    blockDeleteGroup: true,
    blockPromoteDemote: true
  }
}

const securityFile = './security.json'
if (fs.existsSync(securityFile)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(securityFile))
    Object.assign(securityDB, loaded)
  } catch (e) {
    console.error('Error loading security settings:', e)
  }
}

function saveSecurity() {
  fs.writeFileSync(securityFile, JSON.stringify(securityDB, null, 2))
}

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) throw err
      })
    }
  })
}

setInterval(clearTempDir, 5 * 60 * 1000)

//=================== SESSION AUTH (UPDATED WITH NEW MEGA KEY) ====================
// New session ID provided by user: kamjamali~GQsUSS4B#0NSaPQ_nb8D-iNBke9_SzxjYsWjXFSVMOHM_PfzN54k
const NEW_SESSION_KEY = "kamjamali~GQsUSS4B#0NSaPQ_nb8D-iNBke9_SzxjYsWjXFSVMOHM_PfzN54k"

if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  // Extract the part after the first '~' for Mega URL
  let sessdata = NEW_SESSION_KEY.includes('~') ? NEW_SESSION_KEY.split('~')[1] : NEW_SESSION_KEY
  if (!sessdata) {
    console.log('❌ SESSION_ID is empty after processing')
    process.exit(1)
  }
  console.log('📥 Downloading session file using new key...')
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
  filer.download((err, data) => {
    if (err) {
      console.log('❌ Failed to download session:', err.message)
      process.exit(1)
    }
    fs.writeFile(__dirname + '/sessions/creds.json', data, (writeErr) => {
      if (writeErr) {
        console.log('❌ Failed to save session:', writeErr.message)
        process.exit(1)
      }
      console.log("✅ Session downloaded successfully")
      console.log("🔄 Restarting bot with new session...")
      process.exit(0)
    })
  })
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090

let conn

async function connectToWA() {
  try {
    console.log("[ ♻ ] Connecting to WhatsApp ⏳️...")

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    const { version } = await fetchLatestBaileysVersion()

    conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version
    })

    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('[ ⚠️ ] Connection closed:', lastDisconnect?.error?.output?.statusCode)

        if (shouldReconnect) {
          console.log('[ ♻️ ] Attempting to reconnect...')
          setTimeout(() => connectToWA(), 5000)
        } else {
          console.log('[ ❌ ] Logged out. Please update your SESSION_ID')
        }
      } else if (connection === 'open') {
        try {
          console.log('[ ❤️ ] Installing Plugins')

          fs.readdirSync("./plugins/").forEach((plugin) => {
            if (path.extname(plugin).toLowerCase() === ".js") {
              require("./plugins/" + plugin)
            }
          })

          console.log('[ ✔ ] Plugins installed successfully ✅')
          console.log('[ 🪀 ] Bot connected to WhatsApp 📲')

          // Updated welcome message with Jamali Tech Empire branding
          let up = `╭┄┄┄🌸🌹 *WELCOME TO JAMALI TECH EMPIRE* 🌹🌸┄┄┄⊷
┃ 🔹 Your bot is now active & ready!
┃ 🔹 Enjoy smart, seamless chats
┃ 🔹 Current prefix: .
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
╭┄┄┄🌸🌹 *SUPPORT PROJECT* 🌹🌸┄┄┄⊷
┃ ⭐ Star | 🔄 Fork | 📢 Share
┃ 🔗 GitHub: https://github.com/bugvirustechtyrex-bit/Tyrex-MD
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷

> ® JAMALI TECH EMPIRE | Crafted with precision`;
          conn.sendMessage(conn.user.id, { image: { url: `https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg` }, caption: up })

          // Optional: change newsletter channel if you have a new one
          const channelJid = "120363424973782944@newsletter" // Replace with your own channel JID if needed
          try {
            await conn.newsletterFollow(channelJid)
            console.log(`Successfully followed channel: ${channelJid}`)
          } catch (error) {
            console.error(`Failed to follow channel: ${error}`)
          }

        } catch (error) {
          console.error("[ ❌ ] Error during post-connect setup:", error)
        }
      }
    })

    conn.ev.on('creds.update', saveCreds)

  } catch (err) {
    console.error("[ ❌ ] Connection failed:", err)
  }

  // Auto Bio Update (Jamali Tech Empire)
  setInterval(async () => {
    if (config.AUTO_BIO === "true") {
      const bioText = `JAMALI TECH EMPIRE | Active & Ready`;
      try {
        await conn.setStatus(bioText);
      } catch (err) {
        console.error("Failed to update Bio:", err);
      }
    }
  }, 60000);

  //==============================
  conn?.ev?.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2))
        await AntiDelete(conn, updates)
      }
    }
  });
  //============================== 

  conn.ev.on("group-participants.update", async (update) => {
    if (securityDB.antiBan.enabled) {
      const { id, participants, action, author } = update
      for (const participant of participants) {
        await handleAntiBan(conn, update, id, participant, action, author)
      }
    }
    GroupEvents(conn, update)
  });          

  //=============MESSAGE HANDLER===============

  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0]
    if (!mek.message) return

    // Handle status messages
    if (mek.key && mek.key.remoteJid === 'status@broadcast') {

      if (config.AUTO_STATUS_SEEN === "true") {
        try {
          await conn.readMessages([mek.key])
        } catch (err) {
          console.error("Auto-view status error:", err)
        }
      }

      if (config.AUTO_STATUS_REACT === "true") {
        try {
          const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          await conn.sendMessage(mek.key.remoteJid, {
            react: {
              text: randomEmoji,
              key: mek.key,
            }
          })
        } catch (err) {
          console.error("Auto-react status error:", err)
        }
      }

      if (config.AUTO_STATUS_REPLY === "true") {
        try {
          const user = mek.key.participant
          const text = `${config.AUTO_STATUS_MSG || 'Nice status! 💜'}`
          await conn.sendMessage(user, { text: text }, { quoted: mek })
        } catch (err) {
          console.error("Auto-reply status error:", err)
        }
      }

      return
    }

    // Handle view once messages
    if (mek.message?.viewOnceMessageV2) {
      mek.message = mek.message.viewOnceMessageV2.message
    }

    // Handle ephemeral messages
    if (getContentType(mek.message) === 'ephemeralMessage') {
      mek.message = mek.message.ephemeralMessage.message
    }

    if (config.READ_MESSAGE === 'true') {
      await conn.readMessages([mek.key]);
    }

    await Promise.all([
      saveMessage(mek),
    ]);

    const m = sms(conn, mek)
    const type = getContentType(mek.message)
    const content = JSON.stringify(mek.message)
    const from = mek.key.remoteJid
    const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
    const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
    const isCmd = body.startsWith(prefix)
    var budy = typeof mek.text == 'string' ? mek.text : false;
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const q = args.join(' ')
    const text = args.join(' ')
    const isGroup = from.endsWith('@g.us')
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
    const senderNumber = sender.split('@')[0]
    const botNumber = conn.user.id.split(':')[0]
    const pushname = mek.pushName || 'User'
    const isMe = botNumber.includes(senderNumber)

    const isOwner = ownerJids.includes(sender) || isMe || ownerNumber.includes(senderNumber)

    const botNumber2 = await jidNormalizedUser(conn.user.id);

    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => null) : null
    const groupName = isGroup && groupMetadata ? groupMetadata.subject : ''
    const participants = isGroup && groupMetadata ? groupMetadata.participants : ''

    let groupAdmins = []
    if (isGroup && groupMetadata && groupMetadata.participants) {
      groupAdmins = groupMetadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)
    }

    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false

    const isReact = m.message.reactionMessage ? true : false

    const reply = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: mek })
    }

    const udp = botNumber.split('@')[0];
    const rav = ['255628378557'];
    let isCreator = [udp, ...rav, config.DEV]
      .map(v => v && v.replace ? v.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
      .filter(v => v)
      .includes(sender);

    //==========WORKTYPE============ 
    if (!isOwner) {
      if (config.MODE === "private") return
      if (isGroup && config.MODE === "inbox") return
      if (!isGroup && config.MODE === "groups") return
    }

    //================ownerreact==============
    // OWNER REACT - DISABLED

    //==========public react============//
    if (!isReact && config.AUTO_REACT === 'true') {
      const reactions = ['🌼', '❤️', '💐', '🔥', '🏵️', '✅', '💯', '🫶', '😻', '🙌'];
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
    }

    if (!isReact && config.CUSTOM_REACT === 'true') {
      const reactions = (config.CUSTOM_REACT_EMOJIS || '🙂,😔').split(',');
      const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
      m.react(randomReaction);
    }

    // take commands 
    const events = require('./command')
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    if (isCmd) {
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
      if (cmd) {
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

        try {
          cmd.function(conn, mek, m, {
            from, quoted, body, isCmd, command, args, q, text, 
            isGroup, sender, senderNumber, botNumber2, botNumber, 
            pushname, isMe, isOwner, isCreator, groupMetadata, 
            groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
            reply, securityDB, saveSecurity
          });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }

    events.commands.map(async(command) => {
      if (body && command.on === "body") {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      } else if (mek.q && command.on === "text") {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      } else if (
        (command.on === "image" || command.on === "photo") &&
        mek.type === "imageMessage"
      ) {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      } else if (
        command.on === "sticker" &&
        mek.type === "stickerMessage"
      ) {
        command.function(conn, mek, m, {
          from, l, quoted, body, isCmd, command, args, q, text, 
          isGroup, sender, senderNumber, botNumber2, botNumber, 
          pushname, isMe, isOwner, isCreator, groupMetadata, 
          groupName, participants, groupAdmins, isBotAdmins, isAdmins, 
          reply, securityDB, saveSecurity
        })
      }
    });
  });

    conn.decodeJid = jid => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user &&
            decode.server &&
            decode.user + '@' + decode.server) ||
          jid
        );
      } else return jid;
    };

    conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
      let vtype
      if (options.readViewOnce) {
          message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
          vtype = Object.keys(message.message.viewOnceMessage.message)[0]
          delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
          delete message.message.viewOnceMessage.message[vtype].viewOnce
          message.message = {
              ...message.message.viewOnceMessage.message
          }
      }

      let mtype = Object.keys(message.message)[0]
      let content = await generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != "conversation") context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
          ...context,
          ...content[ctype].contextInfo
      }
      const waMessage = await generateWAMessageFromContent(jid, content, options ? {
          ...content[ctype],
          ...options,
          ...(options.contextInfo ? {
              contextInfo: {
                  ...content[ctype].contextInfo,
                  ...options.contextInfo
              }
          } : {})
      } : {})
      await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
      return waMessage
    }

    conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(quoted, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
      let type = await FileType.fromBuffer(buffer)
      trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
      await fs.writeFileSync(trueFileName, buffer)
      return trueFileName
    }

    conn.downloadMediaMessage = async(message) => {
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
      return buffer
    }

    conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
        return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
      }
      let type = mime.split("/")[0] + "Message"
      if (mime === "application/pdf") {
        return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
      }
      if (mime.split("/")[0] === "image") {
        return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
      }
      if (mime.split("/")[0] === "video") {
        return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
      }
      if (mime.split("/")[0] === "audio") {
        return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
      }
    }

    conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
      let mtype = Object.keys(copy.message)[0]
      let isEphemeral = mtype === 'ephemeralMessage'
      if (isEphemeral) {
          mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
      }
      let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
      let content = msg[mtype]
      if (typeof content === 'string') msg[mtype] = text || content
      else if (content.caption) content.caption = text || content.caption
      else if (content.text) content.text = text || content.text
      if (typeof content !== 'string') msg[mtype] = {
          ...content,
          ...options
      }
      if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
      copy.key.remoteJid = jid
      copy.key.fromMe = sender === conn.user.id

      return proto.WebMessageInfo.fromObject(copy)
    }

    conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
      let list = [];
      for (let i of kon) {
        list.push({
          displayName: await conn.getName(i + '@s.whatsapp.net'),
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i + '@s.whatsapp.net')}\nFN:JAMALI TECH EMPIRE\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nEND:VCARD`,
        });
      }
      conn.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted });
    };

    conn.serializeM = mek => sms(conn, mek, store);
  }

  // Updated Express endpoint with Jamali Tech Empire
  app.get("/", (req, res) => {
    res.send("JAMALI TECH EMPIRE BOT ACTIVE ✅");
  });
  app.listen(port, '0.0.0.0', () => console.log(`Server listening on port http://0.0.0.0:${port}`));
  setTimeout(() => {
    connectToWA()
  }, 8000);

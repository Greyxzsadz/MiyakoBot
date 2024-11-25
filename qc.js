export async function participantsUpdate({ id, participants, action }) {
    if (opts['self'])
        return
    if (this.isInit)
        return
    if (global.db.data == null)
        await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
                case 'add':
        case 'remove':
            if (chat.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                for (let user of participants) {
                let welc = 'WELCOME'
                    let outss = 'GOOD BYE'
                    let pp = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9mFzSckd12spppS8gAJ2KB2ER-ccZd4pBbw&usqp=CAU'
                        let bg = 'https://telegra.ph/file/346e307e8a70cd13fb93d.jpg'
                        try {
                        pp = await this.profilePictureUrl(user, 'image')
                        } catch (e) {
                        } finally {
                            text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc ? String.fromCharCode(8206).repeat(4001) + groupMetadata.desc : '') :
                                (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', await this.getName(user))
                            let wel = API('lann', '/api/maker/welcome2', {
                                nama: await this.getName(user),
                                namagc: await this.getName(id),
                                member: groupMetadata.participants.length, 
                                pp: pp, 
                                bg: bg,
                                apikey: lann
                            })
                            let lea = API('lann', '/api/maker/goodbye2', {
                                nama: await this.getName(user),
                                namagc: await this.getName(id),
                                member: groupMetadata.participants.length, 
                                pp: pp,
                                bg: bg,
                                apikey: lann
                            })
                             this.sendFile(id, action === 'add' ? wel : lea, 'pp.jpg', text, null, false, { mentions: [user] })
  
                    }
                }
            }
            break
        case 'promote':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
        case 'demote':
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
            text = text.replace('@user', '@' + participants[0].split('@')[0])
            if (chat.detect)
                this.sendMessage(id, { text, mentions: this.parseMention(text) })
            break
    }
}

export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.delete)
            return
conn.sendMessage(msg.chat, {
text: `🚩 Detected *@${participant.split`@`[0]}* Telah Menghapus Pesan.`,
contextInfo: {
externalAdReply: {
title: v,
thumbnailUrl: "https://telegra.ph/file/50a6c5a7672a70caedba8.jpg",
sourceUrl: sgc,
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: msg}) 
        this.copyNForward(msg.chat, msg, false).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = (type, m, conn) => {

let msg = {
    rowner: `🚩 Sorry, *ᴏɴʟʏ ᴅᴇᴠᴇʟᴏᴘᴇʀ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴅᴇᴠᴇʟᴏᴘᴇʀ ʙᴏᴛ!`,
    owner: `🚩 Sorry, *ᴏɴʟʏ ᴏᴡɴᴇʀ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴏᴡɴᴇʀ ʙᴏᴛ!`,
    mods: `🚩 Sorry, ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴍᴏᴅᴇʀᴀᴛᴏʀ ʙᴏᴛ!`,
    premium: `🚩 Only *ᴏɴʟʏ ᴘʀᴇᴍɪᴜᴍ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ!`,
    group: `🚩 *ɢʀᴏᴜᴘ ᴄʜᴀᴛ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪᴘᴀᴋᴀɪ ᴅɪᴅᴀʟᴀᴍ ɢʀᴏᴜᴘ!`,
    private: `🚩 *ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪᴘᴀᴋᴀɪ ᴅɪᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ!`,
    admin: `🚩 Sorry, *ᴏɴʟʏ ᴀᴅᴍɪɴ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ`,
    botAdmin: `🚩Soryy, *ᴏɴʟʏ ʙᴏᴛ ᴀᴅᴍɪɴ* • ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴋᴇᴛɪᴋᴀ ʙᴏᴛ ᴍᴇɴᴊᴀᴅɪ ᴀᴅᴍɪɴ!`,
    nsfw: `🚩 Sorry, ᴍᴏʜᴏɴ ᴍᴀᴀғ, ғɪᴛᴜʀ ɴsғᴡ ᴛɪᴅᴀᴋ ᴀᴋᴛɪғ sᴀᴀᴛ ɪɴɪ. sɪʟᴀʜᴋᴀɴ ʜᴜʙᴜɴɢɪ ᴛᴇᴀᴍ ʙᴏᴛ ᴅɪsᴄᴜssɪᴏɴ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴋᴛɪғᴋᴀɴ ғɪᴛᴜʀ ɪɴɪ!`,
    rpg: `🚩 Sorry, ᴍᴀᴀғ, ғɪᴛᴜʀ ʀᴘɢ ᴛɪᴅᴀᴋ ᴀᴋᴛɪғ sᴀᴀᴛ ɪɴɪ. sɪʟᴀʜᴋᴀɴ ʜᴜʙᴜɴɢɪ ᴛᴇᴀᴍ ʙᴏᴛ ᴅɪsᴄᴜssɪᴏɴ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴋᴛɪғᴋᴀɴ ғɪᴛᴜʀ ɪɴɪ!`,
    restrict: `🚩 Sorry, *ʀᴇsᴛʀɪᴄᴛ* • ʀᴇsᴛʀɪᴄᴛ ʙᴇʟᴜᴍ ᴅɪɴʏᴀʟᴀᴋᴀɴ ᴅɪᴄʜᴀᴛ ɪɴɪ!`
}[type]
if (msg) return conn.sendMessage(m.chat, {
text: msg,
contextInfo: {
externalAdReply: {
title: v,
thumbnailUrl: "https://telegra.ph/file/50a6c5a7672a70caedba8.jpg",
sourceUrl: sgc,
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m})
let msgg = {
    unreg: `*「 🚩 DAFTAR 」*\n\n📝 Silahkan daftar ke database terlebih dahulu untuk menggunakan bot ini lebih lanjut. Gunakan perintah berikut:\n\n👉 .daftar namaAnda.umur\n👤 Contoh: .daftar Okta.12\n\n`
}[type]
if (msgg) return conn.sendMessage(m.sender, {
text: msgg,
contextInfo: {
externalAdReply: {
title: v,
thumbnailUrl: "https://telegra.ph/file/50a6c5a7672a70caedba8.jpg",
sourceUrl: sgc,
mediaType: 1,
renderLargerThumbnail: true
}}}, { quoted: m})
}    
    
function ucapan() {
const time = moment.tz('Asia/Jakarta').format('HH')
let res = "Sudah Dini Hari Kok Belum Tidur Kak? 🥱"
if (time >= 4) {
	res = "Pagi Lord 🌄"
}
if (time >= 10) {
	res = "Selamat Siang Kak ☀️"
}
if (time >= 15) {
	res = "Selamat Sore Kak 🌇"
}
if (time >= 18) {
	res = "Malam Kak 🌙"
}
return res
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
                }

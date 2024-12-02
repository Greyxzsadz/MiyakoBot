const { generateWAMessageFromContent } = require('@adiwajshing/baileys');

const handler = async (m, { conn, text, usedPrefix, command, participants }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : '';
    
    if (/video/g.test(mime)) {
        let media = await q.download?.();
        conn.sendMessage(m.chat, { video: media, caption: text, mentions: participants.map(a => a.id) }, { quoted: m });
    } else if (/image/g.test(mime)) {
        let media = await q.download?.();
        conn.sendMessage(m.chat, { image: media, caption: text, mentions: participants.map(a => a.id) }, { quoted: m });
    } else if (/audio/g.test(mime)) {
        let media = await q.download?.();
        conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', mentions: participants.map(a => a.id) }, { quoted: m });
    } else {
        conn.sendMessage(m.chat, { text: text, mentions: participants.map(a => a.id) }, { quoted: m });
    }
};

handler.help = ['hidetag'].map(v => v + ' [teks]');
handler.tags = ['group'];
handler.command = /^(hidetag|htag|h)$/i;

handler.admin = true;
handler.botAdmin = true;
handler.group = true;

module.exports = handler;

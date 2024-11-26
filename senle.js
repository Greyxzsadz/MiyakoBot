import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'
import util from 'util'

const _fs = fs.promises

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
    if (!text) throw `
Penggunaan: ${usedPrefix}${command} <name file>
Contoh: ${usedPrefix}savefile main.js
        ${usedPrefix}saveplugin owner
        ${usedPrefix}sfp owner
`.trim()
    if (!m.quoted) throw `Balas/quote media/text yang ingin disimpan`
    if (/p(lugin)?/i.test(command)) {
        let filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
        const error = syntaxError(m.quoted.text, filename, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        })
        if (error) throw error
        const pathFile = path.join(__dirname, filename)
        // TODO: make confirmation to save if file already exists
        // if (fs.existSync(pathFile, fs.constants.R_OK)) return m.reply(`File ${filename} sudah ada`)
        await _fs.writeFile(pathFile,`/*\nSCRIPT BY © IKYY OFFC\n•• recode kasih credits \n•• contacts: (t.me/ikyyNeh)\n•• wa: 6282213982155\n•• wm aing jan di hapus dong om:)\n*/ ` + `\n\n` + m.quoted.text)
        m.reply(`
Successfully saved to \`\`\`plugins/${filename}\`\`\`
`.trim())
    } else {
        const isJavascript = m.quoted.text && !m.quoted.mediaMessage && /\.js/.test(text)
        if (isJavascript) {
            const error = syntaxError(m.quoted.text, text, {
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            })
            if (error) throw error
            await _fs.writeFile(text, m.quoted.text)
            m.reply(`
Successfully saved to \`\`\`${text}\`\`\`
`.trim())
        } else if (m.quoted.mediaMessage) {
            const media = await m.quoted.download()
            await _fs.writeFile(text, media)
            m.reply(`
Successfully saved media to *${text}*
`.trim())
        } else {
            throw 'Not supported!!'
        }
    }
}
handler.help = ['plugin', 'file'].map(v => `save${v}`)
handler.tags = ['owner']
handler.command = /^(save|s|sf)(p(lugin)?|(f(ile)?))$/i

handler.rowner = true

export default handler

const {
	WAConnection,
	MessageType
} = require('@adiwajshing/baileys')

/******BEGIN OF FILE INPUT******/
const { color, bgcolor } = require('./lib/color')
const { start, success, getGroupAdmins, banner } = require('./lib/functions')
const { cadastrar, removercadastro, startuserverification } = require('./lib/devpolice.js')

/******BEGIN OF NPM PACKAGE INPUT******/
const fs = require('fs')
const moment = require('moment-timezone')

/******BEGIN OF JSON INPUT******/
const usersjson = JSON.parse(fs.readFileSync('./database/json/usersjson.json'))
const palavroes = JSON.parse(fs.readFileSync('./database/json/palavroes.json'))

prefix = '/'
blocked = []
const criadornumero = '5522981274455'

/******BEGIN OF FUNCTIONS INPUT******/

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color(' escanear o codigo qr acima '))
	})

	fs.existsSync('./conectionW.json') && client.loadAuthInfo('./conectionW.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected')
	})
	await client.connect({ timeoutMs: 30 * 1000 })
	fs.writeFileSync('./conectionW.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

	client.on('group-participants-update', async (dinf) => {
		try {
			const mdata = await client.groupMetadata(dinf.jid)
			console.log(dinf)
			if (dinf.action == 'add') {
				pessoa = dinf.participants[0]

				console.log('--------ADD--------')
				let i = 0
				while (i != usersjson.length) {
					if (usersjson[i].numero == pessoa) {
						person = {
							numero: usersjson[i].numero,
							pontos: usersjson[i].pontos,
							foto: usersjson[i].foto,
							saiudogrupo: {
								status: false,
								quando: '0000.00.01'
							},
							othersugi: usersjson[i].othersugi,
							motivos: []
						};
						usersjson.splice(i, 1, person);
						fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
					}
					i++
				}
				if (usersjson.length > 500) {
					const infotext = `Necessario rodar o comando de remoção de exeço no grupo`
					client.sendMessage(criadornumero + '@s.whatsapp.net', infotext, text)
				}

			} else if (dinf.action == 'remove') {
				pessoa = dinf.participants[0]
				console.log('-----+REMOVE+------')
				let i = 0
				while (i != usersjson.length) {
					if (usersjson[i].numero == pessoa) {
						const date = moment.tz('America/Sao_Paulo').format('YYYYMMDD')
						person = {
							numero: usersjson[i].numero,
							pontos: usersjson[i].pontos,
							foto: usersjson[i].foto,
							saiudogrupo: {
								status: true,
								quando: date
							},
							othersugi: usersjson[i].othersugi,
							motivos: []
						};
						usersjson.splice(i, 1, person);
						fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
					}
					i++
				}
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})

	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
		for (let i of json[1].blocklist) {
			blocked.push(i.replace('c.us', 's.whatsapp.net'))
		}
	})

	client.on('chat-update', async (mek) => {
		try {
			if (!mek.hasNewMessage) return
			mek = JSON.parse(JSON.stringify(mek)).messages[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const { text } = MessageType
			const time = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ?
				mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ?
					mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ?
						mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ?
							mek.message.extendedTextMessage.text : ''

			budy = (type === 'conversation') ?
				mek.message.conversation : (type === 'extendedTextMessage') ?
					mek.message.extendedTextMessage.text : ''

			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
			mess = {
				wait: '⌛ Processando... ⌛',
				success: '✔️ Sucesso ✔️',
				error: {
					default: '❌'
				},
				only: {
					grupo: '[❗] Este comando só pode ser usado em grupos! ❌',
					owner: 'Comando não autorizado.',
					admin: 'Apenas administradores podem usar este comando.',
					botadmin: 'Preciso de acesso administrativo',
				}
			}
			const botNumber = client.user.jid
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const groupName = isGroup ? groupMetadata.subject : ''
			const ownerNumber = [criadornumero + "@s.whatsapp.net"]
			const isOwner = ownerNumber.includes(sender)
			/******End of ApiKey Input******/

			const isUrl = (url) => {
				return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}

			const reply = (teks) => {
				client.sendMessage(from, teks, text, { quoted: mek })
			}

			colors = ['red', 'white', 'black', 'blue', 'yellow', 'green']
			const isImage = content.includes('imageMessage')
			const isVideo = content.includes('videoMessage')
			const isSticker = content.includes('stickerMessage')
			const isVcard = content.includes('contactMessage')
			const isLiveLocation = content.includes('liveLocationMessage')
			const isLocation = content.includes('locationMessage')
			const isDocument = content.includes('documentMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))

			/******END OF FUNCTIONS INPUT******/
			switch (command) {
				case 'cadm':
					cadastrar(client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, reply)
					break
				case 'rmc':
					removercadastro(client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, reply)
					break
				default:
					if (!isGroup) return console.log('nocomands')
					if (isImage) return reply('Image')
					if (isVideo) return reply('Video')
					if (isSticker) return reply('Sticker')
					if (isVcard) return reply('Vcard')
					if (isLiveLocation) return reply('LiveLocation')
					if (isLocation) return reply('Location')
					if (isDocument) return reply('Document')

					startuserverification(client, budy, from, mek, sender, palavroes, usersjson, text, reply)

			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()

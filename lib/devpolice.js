const { Presence } = require('@adiwajshing/baileys')
const fs = require('fs')
const moment = require('moment-timezone')
const { fetchJson, fetchText } = require('./fetcher')
const { procuraxingamento, checapalavrasspam, baninstantaneo, gravarpontosposi, gravarpontos } = require('./verificationfunc.js')

const verifiuser = (isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply) => {
    if (!isGroup) return reply(mess.only.grupo)
    // if (!isOwner) return reply(mess.only.owner)
    if (!isGroupAdmins) return reply(mess.only.admin)
    if (!isBotGroupAdmins) return reply(mess.only.botadmin)
    return true;
}

const cadastrar = async (client, from, groupMembers, usersjson) => {
    client.updatePresence(from, Presence.composing)

    let i = 0;
    while (i != groupMembers.length) {
        try { img = await client.getProfilePicture(`${groupMembers[i].jid.split('@')[0]}@c.us`) } catch { img = 'https://github.com/guiguicdd1/botsystem-site/blob/gh-pages/defaultpicture.png?raw=true' }

        if (groupMembers[i].notify != undefined) {
            nome = encodeURI(groupMembers[i].notify)
        } else {
            nome = 'Enzo'
        }
        person = {
            numero: groupMembers[i].jid,
            pontos: 1000,
            foto: img,
            nome: nome,
            saiudogrupo: {
                status: false,
                quando: '0000.00.00'
            },
            othersugi: groupMembers[i],
            motivos: ''
        };
        if (usersjson[i] == undefined) {
            await usersjson.push(person)
            console.log(i + ' undefined')

            try {
                var re = /&/gi;
                var img = img.replace(re, 'guilhermestringreplace');
                var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${nome}&pontos=1000&numero=${groupMembers[i].jid}&motivos=A&foto=${img}`, { method: 'post' })
                console.log(result.code)
                console.log(result.message)
            } catch (error) {
                console.log(error)
            }
        } else {
            if (usersjson[i]['numero'] == groupMembers[i].jid) {
                console.log(groupMembers[i].jid)
            } else {
                console.log(usersjson[i]['numero'] + ' diferente de ' + groupMembers[i].jid)
            }
        }
        fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
        i++
    }
}

const removercadastro = async (client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, reply) => {

    client.updatePresence(from, Presence.composing)
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        texto = (args.length > 1) ? body.slice(8).trim() : ''
        texto += `Total de usuarios no grupo : ${groupMembers.length}\n`
        texto += `Total de usuarios no banco : ${usersjson.length}\n`

        let i = 0
        while (i != usersjson.length) {
            if (usersjson[i].saiudogrupo.status == true) {
                const datenow = moment.tz('America/Sao_Paulo').format('YYYYMMDD')
                const dateuser = usersjson[i].saiudogrupo.quando
                const vdaten = datenow - 30
                const vdateu = dateuser - 30
                const verification = vdaten - vdateu

                if (verification > 100) {
                    usersjson.splice(i, 1);
                    fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
                }
            }
            i++
        }
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const addpoints = (client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, mentions, reply) => {
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('A')
        dados = body.slice(8)
        pontos = dados.split("|")[0];
        pessoas = dados.split("|")[1];

        if (!isNumber(pontos)) return reply('Você deve passar como primeiro argumento, os pontos e depois as pessoas. Ex:\n /addpon 1│@pessoa')
        if (pessoas.includes('  ')) {
            person = pessoas.split('  ')
        } else {
            person = pessoas.split(' ')
        }

        let i = 0
        while (i < person.length) {
            usernumero = person[i].split('@')[1] + '@s.whatsapp.net'
            gravarpontosposi(pontos, usernumero, usersjson)
            i++
        }
        reply('Pontos adicionados')
    }
}

const add = (isGroup, isGroupAdmins, client, from, isBotGroupAdmins, args, isQuotedVcard, isQuotedMessage1, mek, reply) => {
    client.updatePresence(from, Presence.composing)
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        if (isQuotedVcard) {
            const sms2 = mek.message.extendedTextMessage.contextInfo.quotedMessage.contactMessage.vcard
            const numberid1 = sms2.split('=')[1]
            var num = `${numberid1.split(':')[0]}@s.whatsapp.net`
        } else if (isQuotedMessage1) {
            var numbertoadd = mek.message.extendedTextMessage.contextInfo.participant
            var num = `${numbertoadd.split('@')[0]}@s.whatsapp.net`
        } else {
            if (args.length < 1) return reply('Quem você deseja adicionar? Escreva na frente do add')
            if (!args[0].startsWith('55')) return reply('Use o código do país')
            var num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
        }
        try {
            client.groupAdd(from, [num])
        } catch (e) {
            console.log('Error :', e)
            reply('Falha ao adicionar destino, talvez porque é privado')
        }
    }
}

const kick = (isGroup, mess, isOwner, isGroupAdmins, client, from, isBotGroupAdmins, isQuotedMessage1, mek, mentions, text, reply) => {
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        client.updatePresence(from, Presence.composing)
        if (isQuotedMessage1) {
            var numbertoadd = mek.message.extendedTextMessage.contextInfo.participant
            client.sendMessage(mentioned, 'jae', text)
            client.groupRemove(from, numbertoadd)
        } else {
            if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Selecione alguém para ser banido com o @!')
            mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
            if (mentioned.length > 1) {
                teks = 'Vlw ✌:\n'
                for (let _ of mentioned) {
                    teks += `@${_.split('@')[0]}\n`
                }
                mentions(teks, mentioned, true)
                console.log(mentioned)
                client.groupRemove(from, mentioned)
            } else {
                mentions(`Sem recentimentos 🤖: @${mentioned[0].split('@')[0]}`, mentioned, true)
                client.groupRemove(from, mentioned)
                client.sendMessage(mentioned, 'Vlw, vlw', text)
            }
        }
    }
}

const getallusers = (client, from, mess, isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, usersjson, text, extendedText, mek, reply) => {
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {

        client.updatePresence(from, Presence.composing)
        teks = `[`
        no = 0
        while (no != usersjson.length) {
            teks += `{${usersjson[i]}},\n`
            no++
        }
        teks += `]`
        teks2 += `Total usuarios: ${user.length}\n`
        client.sendMessage(from, teks.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": user } })
        Client.sendMessage(mentioned, teks2, text)
    }
}

const startuserverification = async (client, budy, from, mek, sender, palavroes, spamcheker, usersjson, text, isGroup, reply) => {
    var usernumero = sender
    if (!isGroup && sended.startsWith('18282224768')) return console.log('passa')
    // verificar texto enviado
    var usermensagem = budy.slice(0).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    if (usermensagem.includes('http://')) {
        let mpts = 50
        let motivo = 'Envio de link sem ssl.'
        reply(`🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
        gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
    }
    if (procuraxingamento(usermensagem, palavroes)) {
        let mpts = 25
        let motivo = 'Desrespeito aos mebros do grupo. Envio de palavra ofensiva.'
        reply(`🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
        gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
    }
    if (usermensagem.length > 600) {
        if (usermensagem.length > 6500) {
            if (usermensagem.length > 30000) {
                let mpts = 1000
                let motivo = 'Envio de Spam Lv.3.'
                reply(`🚔🚔🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
                gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
            } else {
                let mpts = 800
                let motivo = 'Envio de Spam Lv.2.'
                reply(`🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
                gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
            }
        } else {
            wordcheck = checapalavrasspam(usermensagem, spamcheker)
            if (wordcheck > 1 && wordcheck <= 3) {
                let mpts = 500
                let motivo = `Envio de Spam Lv.1, escala ${wordcheck}.`
                reply(`🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
                gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
            } else if (wordcheck > 3) {
                let mpts = 1000
                let motivo = `Envio de Spam Lv.1, escala ${wordcheck}.`
                reply(`🚔🚔🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
                gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
            }
        }
    }
    if (baninstantaneo(usermensagem) > 2) {
        let mpts = 1000
        let motivo = 'Envio de link aparentemente malicioso'
        reply(`🚔🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
        gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
    }
    // verificar texto enviado --------------------
}

module.exports = { cadastrar, removercadastro, addpoints, add, kick, getallusers, startuserverification }

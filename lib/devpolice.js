const { Presence } = require('@adiwajshing/baileys')
const fs = require('fs')
const moment = require('moment-timezone')
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
        try {
            img = await client.getProfilePicture(`${groupMembers[i].jid.split('@')[0]}@c.us`)
        } catch {
            img = 'https://github.com/guiguicdd1/botsystem-site/blob/gh-pages/defaultpicture.png?raw=true'
        }
        person = {
            numero: groupMembers[i].jid,
            pontos: 1000,
            foto: img,
            saiudogrupo: {
                status: false,
                quando: '0000.00.00'
            },
            othersugi: groupMembers[i],
            motivos: []
        };
        if (usersjson[i] == undefined) {
            await usersjson.push(person)
            console.log(i + ' undefined')
        } else {
            if (usersjson[i]['numero'] == groupMembers[i].jid) {
                return console.log(groupMembers[i].jid)
            } else {
                usersjson.push(person)
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

        if (!isNumber(pontos)) return reply('Você deve passar como primeiro argumento, os pontos e depois as pessoas.')
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

const add = (isGroup, isGroupAdmins, client, from, isBotGroupAdmins, args, isQuotedVcard, mek, reply) => {
    client.updatePresence(from, Presence.composing)
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        if (isQuotedVcard) {
            const sms2 = mek.message.extendedTextMessage.contextInfo.quotedMessage.contactMessage.vcard
            const numberid1 = sms2.split('=')[1]
            var num = `${numberid1.split(':')[0]}@s.whatsapp.net`
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

const startuserverification = async (client, budy, from, mek, sender, palavroes, usersjson, text, isGroup, reply) => {
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
            wordcheck = checapalavrasspam(usermensagem)
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

module.exports = { cadastrar, removercadastro, addpoints, add, startuserverification }

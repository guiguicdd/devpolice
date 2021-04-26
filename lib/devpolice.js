const { Presence } = require('@adiwajshing/baileys')
const fs = require('fs')
const moment = require('moment-timezone')

const verifiuser = (isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply) => {
    if (!isGroup) return reply(mess.only.grupo)
    if (!isOwner) return reply(mess.only.owner)
    if (!isGroupAdmins) return reply(mess.only.admin)
    if (!isBotGroupAdmins) return reply(mess.only.botadmin)
    return true;
}

const cadastrar = async (client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, reply) => {

    client.updatePresence(from, Presence.composing)
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        texto = (args.length > 1) ? body.slice(8).trim() : ''
        texto += `Total de usuarios : ${groupMembers.length}\n`

        let i = 0;
        while (i != groupMembers.length) {
            console.log(i)
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
                    console.log(groupMembers[i].jid)
                } else {
                    usersjson.push(person)
                    console.log(usersjson[i]['numero'] + ' diferente de ' + groupMembers[i].jid)
                }
            }
            fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
            i++
        }
        client.sendMessage(from, texto, text, { quoted: mek })
    } else {
        console.log('Não foi possivel executar a função de cadastro.')
    }
}

const removercadastro = async (client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, reply) => {

    client.updatePresence(from, Presence.composing)
    if (!isGroup) return reply(mess.only.grupo)
    if (!isOwner) return reply(mess.only.owner)
    if (!isGroupAdmins) return reply(mess.only.admin)
    if (!isBotGroupAdmins) return reply(mess.only.botadmin)
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
// funções de validação da mensagem
const procuraxingamento = (usermensagem, palavroes) => {
    let i = 0
    let palavrao = ''
    let array = ''
    while (i != palavroes.length) {
        array = usermensagem.split(' ')
        palavrao = array.indexOf(palavroes[i])

        if (palavrao != -1) {
            console.log(array[palavrao])
            return true
        }
        i++
    }
}

const checapalavrasspam = (usermensagem) => {
    const palavraspam = ['bom dia', 'vender', 'vendo', 'gostaria', 'hacking', 'comprar', 'boa tarde', 'boa noite', 'acessar', 'clicar', 'comprar', 'R$', 'http']
    let i = 0
    let wordcount = 0
    while (i != palavraspam.length) {
        if (usermensagem.includes(palavraspam[i])) {
            wordcount++
        }
        i++
    }
    return wordcount;
}

const baninstantaneo = (usermensagem) => {
    const palavraspam = ['.ngrok.io', 'http://', '?', '.xyz', '.tk', 'port:']
    let i = 0
    let wordcount = 0
    while (i != palavraspam.length) {
        if (usermensagem.includes(palavraspam[i])) {
            wordcount++
        }
        i++
    }
    return wordcount;
}

const gravarpontos = async (pon, unum, motivo, usersjson, client, from, text, mek) => {
    let i = 0;
    while (i != usersjson.length) {
        if (usersjson[i].numero == unum) {
            pont = usersjson[i].pontos - pon
            usersjson[i].motivos.push(motivo);

            if (pont <= 0) {
                texto = `Banido. motivos:\n ${usersjson[i].motivos}`
                await client.sendMessage(from, texto, text, { quoted: mek })
                person = {
                    numero: usersjson[i].numero,
                    pontos: pont,
                    foto: usersjson[i].foto,
                    saiudogrupo: {
                        status: usersjson[i].saiudogrupo.status,
                        quando: usersjson[i].saiudogrupo.quando
                    },
                    othersugi: usersjson[i].othersugi,
                    motivos: []
                };
                client.groupRemove(from, unum)
            } else {
                person = {
                    numero: usersjson[i].numero,
                    pontos: pont,
                    foto: usersjson[i].foto,
                    saiudogrupo: {
                        status: usersjson[i].saiudogrupo.status,
                        quando: usersjson[i].saiudogrupo.quando
                    },
                    othersugi: usersjson[i].othersugi,
                    motivos: []
                };
            }
            usersjson.splice(i, 1, person);
            fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
        }
        i++
    }
}

const startuserverification = async (client, budy, from, mek, sender, palavroes, usersjson, text, reply) => {
    var usernumero = sender
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
            if (checapalavrasspam(usermensagem) > 1) {
                let mpts = 500
                let motivo = 'Envio de Spam Lv.1.'
                reply(`🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
                gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
            }
        }
    }
    if (baninstantaneo(usermensagem) > 2) {
        let mpts = 950
        let motivo = 'Envio de link aparentemente malicioso'
        reply(`🚔🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\n${motivo}`)
        gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek)
    }
    // verificar texto enviado --------------------
}

module.exports = { cadastrar, removercadastro, startuserverification }

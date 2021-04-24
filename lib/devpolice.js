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

const isattack = async (usernumero) => {

    let arrayuserspm = []
    arrayuserspm.push(usernumero)

    setTimeout(() => {
        console.log(arrayuserspm)
    }, 20000);


}

const startuserverification = async (client, budy, from, mek, sender, palavroes, reply) => {
    var usernumero = sender
    // verificar texto enviado
    var usermensagem = budy.slice(0).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    isattack(usernumero)

    if (usermensagem.includes('http://')) {
        let mpts = 50
        reply(`🚔\n-${mpts}pts\nMotivo:\nEnvio de link sem ssl.`)
    }
    if (procuraxingamento(usermensagem, palavroes)) {
        let mpts = 25
        reply(`🚔\n-${mpts}pts\nMotivo:\nDesrespeito aos mebros do grupo. Envio de palavra ofensiva.`)
    }
    if (usermensagem.length > 600) {
        if (usermensagem.length > 6500) {
            if (usermensagem.length > 30000) {
                let mpts = 1000
                reply(`🚔🚔🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\nEnvio de Spam Lv.3`)
            } else {
                let mpts = 800
                reply(`🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\nEnvio de Spam Lv.2`)
            }
        } else {
            const quantidadedepalavraspam = checapalavrasspam(usermensagem)
            if (quantidadedepalavraspam > 1) {
                let mpts = 500
                reply(`🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\nEnvio de Spam Lv.1`)
            }
        }
    }
    if (baninstantaneo(usermensagem) > 2) {
        let mpts = 950
        reply(`🚔🚔🚔🚔🚔🚔🚔🚔🚔\n-${mpts}pts\nMotivo:\nEnvio de link aparentemente malicioso`)
    }
    // verificar texto enviado --------------------
}

module.exports = { cadastrar, removercadastro, startuserverification }

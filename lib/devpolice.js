const { Presence } = require('@adiwajshing/baileys')
const fs = require('fs')

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

}

module.exports = { cadastrar, removercadastro }

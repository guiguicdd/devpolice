const { Presence } = require('@adiwajshing/baileys')
const fs = require('fs')
const moment = require('moment-timezone')
const { fetchJson, fetchText } = require('./fetcher')

const verifiuser = (isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply) => {
    if (!isGroup) return reply(mess.only.grupo)
    // if (!isOwner) return reply(mess.only.owner)
    if (!isGroupAdmins) return reply(mess.only.admin)
    if (!isBotGroupAdmins) return reply(mess.only.botadmin)
    return true;
}

const isprograming = async (usermensagem) => {
    let prograwords = ["}", ";", "()", "[]", "[", "]", "==", "async ", "++", "]);", ");", "<?php ", "<html", "<body", "</html>", "root::", ":", "(){", "int ", "while(", ":=", ">", "<", "││", " or ", "echo", "bash", "import", "require(", "const", "pdo::", "//"]
    let i = 0
    let wordcount = 0
    while (i != prograwords.length) {
        if (usermensagem.includes(prograwords[i])) {
            wordcount++
            console.log('chekprogramin=' + prograwords[i]);
        }
        i++
    }
    return wordcount;
}

// funções de validação da mensagem
const procuraxingamento = (usermensagem, palavroes) => {
    let i = 0
    let palavrao = ''
    let array = ''

    var mapObj = {
        0: "o",
        1: "i",
        4: "a",
        3: "e",
        5: "s",
        2: "s",
        7: "t"
    };
    usermensagem = usermensagem.replace(/0|1|4|3|5|2|7/gi, function (matched) {
        return mapObj[matched];
    });

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

const procuraxingamentoinverso = (usermensagem, palavroes) => {
    let i = 0
    let palavrao = ''
    let array = ''

    var mapObj = {
        0: "o",
        1: "i",
        4: "a",
        3: "e",
        pdf: "fdp",
        obg: "obrigado"
    };
    usermensagem = usermensagem.replace(/0|1|4|3|pdf|obg/gi, function (matched) {
        return mapObj[matched];
    });

    let usermensageminvertido = usermensagem.split('').reverse().join('');

    while (i != palavroes.length) {
        array = usermensageminvertido.split(' ')
        palavrao = array.indexOf(palavroes[i])

        if (palavrao != -1) {
            console.log(array[palavrao])
            return true
        }
        i++
    }
}

const checapalavrasspam = async (usermensagem, spamcheker) => {
    let i = 0
    let wordcount = 0
    while (i != spamcheker.length) {
        if (usermensagem.includes(spamcheker[i])) {
            wordcount++
            console.log('checandokeywords=' + spamcheker[i]);
        }
        i++
    }
    return wordcount;
}

const baninstantaneo = async (usermensagem) => {
    const palavraspam2 = ['.ngrok.io', 'http://', '?', '.xyz', '.tk', 'port:', 'kwai.app', '.php?', '.io', 'xvideos.com', 'xnxx.com', 'pornhub.com']
    let i = 0
    let wordcount = 0
    while (i != palavraspam2.length) {
        if (usermensagem.includes(palavraspam2[i])) {
            wordcount++
        }
        i++
    }
    return wordcount;
}

const baniruser = async (client, from, unum, sticker) => {
    console.log('removendo do grupo');
    let numarr = []
    numarr.push(unum);
    await client.groupRemove(from, numarr)
    const optionf = Math.floor(Math.random() * 3) + 1
    if (optionf == 1) {
        await client.sendMessage(from, fs.readFileSync('./assets/figurinhas/banido-1.webp'), sticker)
    } else if (optionf == 3) {
        await client.sendMessage(from, fs.readFileSync('./assets/figurinhas/banido-2.webp'), sticker)
    } else {
        await client.sendMessage(from, fs.readFileSync('./assets/figurinhas/banido-3.webp'), sticker)
    }
}

const gravarpontos = async (pon, unum, motivo, usersjson, client, from, text, mek, sticker) => {
    console.log('initgravarpontos');
    let i = 0;
    while (i != usersjson.length) {
        if (usersjson[i].numero == unum) {
            console.log('gravandopontos de ' + unum);
            pont = parseInt(usersjson[i].pontos) - parseInt(pon)
            mot = usersjson[i].motivos + '│' + motivo
            if (pont <= 0) {
                console.log('0');
                const date = moment.tz('America/Sao_Paulo').format('YYYYMMDD')
                texto = `Banido. motivos:\n ${mot}`
                await client.sendMessage(from, texto, text, { quoted: mek })
                person = {
                    numero: usersjson[i].numero,
                    pontos: pont,
                    foto: usersjson[i].foto,
                    nome: usersjson[i].nome,
                    saiudogrupo: {
                        status: true,
                        quando: date
                    },
                    othersugi: usersjson[i].othersugi,
                    motivos: mot
                };
                await baniruser(client, from, unum, sticker)

                try {
                    var re = /&/gi;
                    var img = usersjson[i].foto.replace(re, 'guilhermestringreplace');
                    var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=banido-${date}-${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${encodeURI(mot)}&foto=${img}`, { method: 'post' })
                    console.log(result.code)
                    console.log(result.message)
                } catch (error) {
                    console.log(error);
                }

            } else {
                console.log('< ' + pont);
                person = {
                    numero: usersjson[i].numero,
                    pontos: pont,
                    foto: usersjson[i].foto,
                    nome: usersjson[i].nome,
                    saiudogrupo: {
                        status: usersjson[i].saiudogrupo.status,
                        quando: usersjson[i].saiudogrupo.quando
                    },
                    othersugi: usersjson[i].othersugi,
                    motivos: mot
                };
                try {
                    var re = /&/gi;
                    var img = usersjson[i].foto.replace(re, 'guilhermestringreplace');
                    var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${encodeURI(mot)}&foto=${img}`, { method: 'post' })
                    console.log(result.code)
                    console.log(result.message)
                } catch (error) {
                    console.log(error)
                }
            }
            usersjson.splice(i, 1, person);
            fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
            console.log('Processo finalizado.');
        }
        i++
    }
}


const gravarpontosposi = async (pon, unum, usersjson) => {
    let i = 0;
    while (i != usersjson.length) {
        if (usersjson[i].numero == unum) {
            pont = parseInt(usersjson[i].pontos) + parseInt(pon)

            person = {
                numero: usersjson[i].numero,
                pontos: pont,
                foto: usersjson[i].foto,
                nome: usersjson[i].nome,
                saiudogrupo: {
                    status: usersjson[i].saiudogrupo.status,
                    quando: usersjson[i].saiudogrupo.quando
                },
                othersugi: usersjson[i].othersugi,
                motivos: usersjson[i].motivos
            };

            usersjson.splice(i, 1, person);
            fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))

            try {
                var re = /&/gi;
                var img = usersjson[i].foto.replace(re, 'guilhermestringreplace');
                var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${encodeURI(usersjson[i].motivos)}&foto=${img}`, { method: 'post' })
                console.log(result.code)
                console.log(result.message)
            } catch (error) {
                console.log(error);
            }
        }
        i++
    }
}
// funções de validação da mensagem----------------------


const cadastrar = async (client, from, groupMembers, usersjson) => {
    client.updatePresence(from, Presence.composing)

    let i = 0;
    while (i != groupMembers.length) {
        try { img = await client.getProfilePicture(`${groupMembers[i].jid.split('@')[0]}@c.us`) } catch { img = 'https://github.com/guiguicdd1/botsystem-site/blob/gh-pages/defaultpicture.png?raw=true' }

        if (groupMembers[i].notify != undefined) {
            nome = encodeURI(groupMembers[i].notify.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
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
            try {
                var re = /&/gi;
                var img = img.replace(re, 'guilhermestringreplace');
                var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${nome}&pontos=1000&numero=${groupMembers[i].jid}&motivos=A&foto=${img}`, { method: 'post' })
                console.log(result.message)
            } catch (error) {
                console.log(error)
            }
        } else {
            if (usersjson[i]['numero'] != groupMembers[i].jid) {
                let k = 0;
                let jatem = 0;
                while (k != usersjson.length) {
                    if (usersjson[k].numero == groupMembers[i].jid) {
                        jatem++
                    }
                    k++
                }
                if (jatem == 0) {
                    await usersjson.push(person)
                    try {
                        var re = /&/gi;
                        var img = img.replace(re, 'guilhermestringreplace');
                        var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${nome}&pontos=1000&numero=${groupMembers[i].jid}&motivos=A&foto=${img}`, { method: 'post' })
                        console.log(result.message)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
        fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
        i++
    }
}

const removercadastro = async (client, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, reply) => {

    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        client.updatePresence(from, Presence.composing)
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

const addpoints = async (client, isQuotedMessage1, isOwner, from, isGroup, isGroupAdmins, isBotGroupAdmins, args, body, groupMembers, usersjson, text, mek, mentions, reply) => {
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        if (isQuotedMessage1) {
            var numbertoadd = mek.message.extendedTextMessage.contextInfo.participant
            var num = `${numbertoadd.split('@')[0]}@s.whatsapp.net`
            pontos = body.slice(8)
            if (!isNumber(pontos)) return reply('Coloque apenas os pontos Ex: /addpon 2')
            await gravarpontosposi(pontos, num, usersjson)
            reply('Pontos adicionados')
        } else {
            if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('A')
            dados = body.slice(8)
            re = /│/gi;
            dados = dados.replace(re, '|');
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
                await gravarpontosposi(pontos, usernumero, usersjson)
                i++
            }
            reply('Pontos adicionados')
        }
    }
}

const add = async (isGroup, isOwner, mess, isGroupAdmins, client, from, isBotGroupAdmins, args, isQuotedVcard, isQuotedMessage1, mek, reply) => {
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        client.updatePresence(from, Presence.composing)
        if (isQuotedVcard) {
            const sms2 = mek.message.extendedTextMessage.contextInfo.quotedMessage.contactMessage.vcard
            const numberid1 = sms2.split('=')[1]
            var num = `${numberid1.split(':')[0]}@s.whatsapp.net`
        } else if (isQuotedMessage1) {
            var numbertoadd = mek.message.extendedTextMessage.contextInfo.participant
            var num = `${numbertoadd.split('@')[0]}@s.whatsapp.net`
        } else {
            if (args.length < 1) return reply('Quem você deseja adicionar? Escreva na frente do /add')
            if (!args[0].startsWith('55')) return reply('Use o código do país')
            var num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
        }
        try {
            await client.groupAdd(from, [num])
        } catch (e) {
            console.log('Error :', e)
            reply('Falha ao adicionar destino, talvez porque é privado')
        }
        console.log('Processo de adição, finalizado.');
    }
}

const kick = async (isGroup, mess, isOwner, isGroupAdmins, client, from, isBotGroupAdmins, isQuotedMessage1, mek, mentions, text, reply) => {
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {
        client.updatePresence(from, Presence.composing)
        if (isQuotedMessage1) {
            var numbertoadd1 = mek.message.extendedTextMessage.contextInfo.participant
            let numbertoadd = []
            numbertoadd.push(numbertoadd1);
            await client.groupRemove(from, numbertoadd)
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
                await client.groupRemove(from, mentioned)
            } else {
                mentions(`Sem recentimentos 🤖: @${mentioned[0].split('@')[0]}`, mentioned, true)
                await client.groupRemove(from, mentioned)
                await client.sendMessage(mentioned, 'Vlw, vlw', text)
            }
        }
    }
}

const getallusers = async (client, document, from, mess, isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, usersjson, text, extendedText, mek, reply) => {
    if (verifiuser(isOwner, isGroup, isGroupAdmins, isBotGroupAdmins, reply)) {

        client.updatePresence(from, Presence.composing)
        arquivo = fs.readFileSync('./database/json/usersjson.json')
        teks2 = `Total de usuarios: ${usersjson.length}\n`

        await client.sendMessage(from, teks2, text)
        client.sendMessage(from, arquivo, document, { mimetype: 'application/json', filename: `users.json`, quoted: mek })
        client.sendMessage(from, arquivo, document, { mimetype: 'text/plain', filename: `users.txt`, quoted: mek })
    }
}

const startuserverification = async (client, budy, from, mek, sender, palavroes, spamcheker, usersjson, text, sticker, isGroup, isFakenews, reply) => {
    var usernumero = sender
    if (usernumero.startsWith('18282224768')) return console.log('passa')
    if (usernumero.startsWith('5511989131833')) return console.log('passa')
    // verificar texto enviado
    var usermensagem = budy.slice(0).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    if (usermensagem.length > 100) {
        ispcheck = await isprograming(usermensagem, spamcheker)
        if (ispcheck > 3) {
            // https://carbon.now.sh/?bg=rgba%28171%2C+184%2C+195%2C+1%29&t=seti&wt=none&l=auto&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=
            // https://cutt.ly/api/api.php?key=4f4d20b179f51f9f177e99531d7e13f29c748&short=<AAAAAAA>
            codetoconvert = encodeURIComponent(usermensagem)
            codeurl = `https://carbon.now.sh/?bg=rgba%282%2C17%2C90%2C0.94%29&t=seti&wt=none&l=auto&ds=true&dsyoff=20px&dsblur=50px&wc=true&wa=true&pv=25px&ph=27px&ln=true&fl=1&fm=Hack&fs=14px&lh=133%25&si=false&es=2x&wm=false&code=${codetoconvert}`
            codetoconvert = encodeURI(codeurl)
            var result = await fetchJson(`https://cutt.ly/api/api.php?key=4f4d20b179f51f9f177e99531d7e13f29c748&short=${codetoconvert}`, { method: 'post' })
            console.log(result);
            if (result.url.status == 7) {
                reply('Assim fica mais facil de se ler o seu codigo: \n' + result.url.shortLink)
            } else {
                reply('Assim fica mais facil de se ler o seu codigo: \n' + codeurl)
            }
        }

    }

    if (procuraxingamento(usermensagem, palavroes)) {
        console.log('verificando>xingamento');
        let mpts = 100
        let motivo = 'Envio de palavra ofensiva.'
        await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
        reply(`-${mpts}₧ Motivo: ${motivo}`)
    }
    if (procuraxingamentoinverso(usermensagem, palavroes)) {
        console.log('verificando>xingamento');
        let mpts = 50
        let motivo = 'Envio de palavra ofensiva, ao contrario.'
        await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
        reply(`-${mpts}₧ Motivo: ${motivo}`)
    }
    if (usermensagem.length > 100) {
        if (usermensagem.length > 6500) {
            if (usermensagem.length > 30000) {
                let mpts = 1000
                let motivo = 'Envio de Spam Lv.3.'
                await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
                reply(`-${mpts}₧\nMotivo: ${motivo}`)
            } else {
                wordcheck = await checapalavrasspam(usermensagem, spamcheker)
                if (wordcheck > 0) {
                    let mpts = 1000
                    let motivo = `Envio de Spam Lv.2, escala ${wordcheck}.`
                    await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
                    reply(`-${mpts}₧\nMotivo: ${motivo}`)
                }
            }
        } else {
            wordcheck = await checapalavrasspam(usermensagem, spamcheker)
            if (wordcheck > 1 && wordcheck <= 3) {
                let mpts = 500
                let motivo = `Envio de Spam Lv.1, escala ${wordcheck}.`
                await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
                const optionf = Math.floor(Math.random() * 2) + 1
                if (optionf == 1) {
                    await client.sendMessage(from, fs.readFileSync('./assets/figurinhas/spam-1.webp'), sticker)
                } else {
                    await client.sendMessage(from, fs.readFileSync('./assets/figurinhas/spam-2.webp'), sticker)
                }
                reply(`-${mpts}₧\nMotivo: ${motivo}`)
            } else if (wordcheck > 3) {
                let mpts = 1000
                let motivo = `Envio de Spam Lv.1, escala ${wordcheck}.`
                await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
                reply(`-${mpts}₧\nMotivo: ${motivo}`)
            }
        }
    }
    if (await baninstantaneo(usermensagem) > 2) {
        let mpts = 1000
        let motivo = 'Envio de link aparentemente malicioso'
        await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
        reply(`-${mpts}₧\nMotivo: ${motivo}`)
    }
    if (isFakenews) {
        const qencaminhamento = mek.message.extendedTextMessage.contextInfo.forwardingScore
        if (qencaminhamento > 100) {
            let mpts = 900
            let motivo = 'Esta mensagem me parece ser algum tipo de FakeNews. Param. ' + qencaminhamento
            await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
            await client.sendMessage(from, fs.readFileSync('./assets/figurinhas/spam-2.webp'), sticker)
            reply(`-${mpts}₧\nMotivo: ${motivo}`)
        }
        if (qencaminhamento > 10 && qencaminhamento < 100) {
            let mpts = 300
            let motivo = 'Esta mensagem me parece ser algum tipo de corrente. Param. ' + qencaminhamento
            await gravarpontos(mpts, usernumero, motivo, usersjson, client, from, text, mek, sticker)
            reply(`-${mpts}₧\nMotivo: ${motivo}`)
        }
    }
    // verificar texto enviado --------------------
}

module.exports = { cadastrar, removercadastro, addpoints, add, kick, getallusers, startuserverification }

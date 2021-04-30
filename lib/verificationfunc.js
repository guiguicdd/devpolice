const fs = require('fs')
const moment = require('moment-timezone')
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

const checapalavrasspam = (usermensagem, spamcheker) => {
    let i = 0
    let wordcount = 0
    while (i != spamcheker.length) {
        if (usermensagem.includes(spamcheker[i])) {
            wordcount++
        }
        i++
    }
    return wordcount;
}

const baninstantaneo = (usermensagem) => {
    const palavraspam2 = ['.ngrok.io', 'http://', '?', '.xyz', '.tk', 'port:', 'kwai.app', '.php?', '.io']
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

const baniruser = async (client, from, unum) => {
    console.log('removendo do grupo');
    let numarr = []
    numarr.push(unum);
    await client.groupRemove(from, numarr)
}

const gravarpontos = async (pon, unum, motivo, usersjson, client, from, text, mek) => {
    let i = 0;
    while (i != usersjson.length) {
        if (usersjson[i].numero == unum) {
            console.log('gravandopontos de '+ unum);
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
                await baniruser(client, from, unum)

                try {
                    var re = /&/gi;
                    var img = img.replace(re, 'guilhermestringreplace');
                    var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=banido-${date}-${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${mot}&foto=${usersjson[i].foto}`, { method: 'post' })
                    console.log(result.code)
                    console.log(result.message)
                } catch (error) {
                    console.log(error);
                }

            } else {
                console.log('< '+ pont);
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
                    var img = img.replace(re, 'guilhermestringreplace');
                    var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${mot}&foto=${usersjson[i].foto}`, { method: 'post' })
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
                var img = img.replace(re, 'guilhermestringreplace');
                var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${usersjson[i].motivos}&foto=${usersjson[i].foto}`, { method: 'post' })
                console.log(result.code)
                console.log(result.message)
            } catch (error) {
                console.log(error);
            }
        }
        i++
    }
}


const uploadtoserver = () => {
    console.log('a')
}

module.exports = { procuraxingamento, checapalavrasspam, baninstantaneo, gravarpontosposi, gravarpontos }
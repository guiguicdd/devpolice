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

const checapalavrasspam = (usermensagem) => {
    const palavraspam = ['bom dia', 'vender', 'vendo', 'kwai.app', 'baixando', 'baixar', 'reais', 'vendas', 'pagamento', 'views', 'desconto', 'preco', '💎', 'pix', 'boleto', 'falar com', 'entre em contato', 'apos o pagamento', '*', 'gostaria', 'hacking', 'comprar', 'boa tarde', 'boa noite', 'acessar', 'clicar', 'comprar', 'R$', 'http']
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
    const palavraspam = ['.ngrok.io', 'http://', '?', '.xyz', '.tk', 'port:', 'kwai.app']
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

const baniruser = (client, from, unum) => {
    let numarr = []
    numarr.push(unum);
    client.groupRemove(from, numarr)
}

const gravarpontos = async (pon, unum, motivo, usersjson, client, from, text, mek) => {
    let i = 0;
    while (i != usersjson.length) {
        if (usersjson[i].numero == unum) {
            pont = usersjson[i].pontos - pon
            mot = usersjson[i].motivos + '│' + motivo
            if (pont <= 0) {
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
                baniruser(client, from, unum)
                var re = /&/gi;
                var img = img.replace(re, 'guilhermestringreplace');
                var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=banido-${date}-${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${mot}&foto=${usersjson[i].foto}`, { method: 'post' })
                console.log(result.code)
                console.log(result.message)
            } else {
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
                var re = /&/gi;
                var img = img.replace(re, 'guilhermestringreplace');
                var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${mot}&foto=${usersjson[i].foto}`, { method: 'post' })
                console.log(result.code)
                console.log(result.message)
            }
            usersjson.splice(i, 1, person);
            fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
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

            var re = /&/gi;
            var img = img.replace(re, 'guilhermestringreplace');
            var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${usersjson[i].nome}&pontos=${pont}&numero=${usersjson[i].numero}&motivos=${usersjson[i].motivos}&foto=${usersjson[i].foto}`, { method: 'post' })
            console.log(result.code)
            console.log(result.message)
        }
        i++
    }
}


const uploadtoserver = () => {
    console.log('a')
}

module.exports = { procuraxingamento, checapalavrasspam, baninstantaneo, gravarpontosposi, gravarpontos }
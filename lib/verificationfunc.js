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
    const palavraspam = ['bom dia', 'vender', 'vendo', 'vendas', 'pagamento', 'views', 'desconto', 'preco', '💎', 'pix', 'boleto', 'falar com', 'entre em contato', 'apos o pagamento', '*', 'gostaria', 'hacking', 'comprar', 'boa tarde', 'boa noite', 'acessar', 'clicar', 'comprar', 'R$', 'http']
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
            // usersjson[i].motivos.push(motivo)

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
                baniruser(client, from, unum)
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


const gravarpontosposi = async (pon, unum, usersjson) => {
    let i = 0;
    while (i != usersjson.length) {
        if (usersjson[i].numero == unum) {
            pont = usersjson[i].pontos + pon

            person = {
                numero: usersjson[i].numero,
                pontos: pont,
                foto: usersjson[i].foto,
                saiudogrupo: {
                    status: usersjson[i].saiudogrupo.status,
                    quando: usersjson[i].saiudogrupo.quando
                },
                othersugi: usersjson[i].othersugi,
                motivos: usersjson[i].motivos
            };

            usersjson.splice(i, 1, person);
            fs.writeFileSync('./database/json/usersjson.json', JSON.stringify(usersjson))
        }
        i++
    }
}

module.exports = { procuraxingamento, checapalavrasspam, baninstantaneo, gravarpontosposi, gravarpontos }
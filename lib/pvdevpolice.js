const fs = require('fs')
const { fetchJson, fetchText } = require('./fetcher')

const pvdevpolice = async (budy, sender, usersjson, client, reply) => {
    var usermensagem = budy.slice(0).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    var usernumero = sender
    if (usermensagem == 'a') {
        let texto = ''
        let i = 0
        while (i != usersjson.length) {
            if (usersjson[i].numero == usernumero) {
                texto = `Olá, ${usersjson[i].nome}. Você tem *${usersjson[i].pontos}pts*.\nSuas anotações: ${usersjson[i].motivos} \n\nSeu número: ${usersjson[i].numero.split('@')[0]}`
            }
            i++
        }
        if (texto == '') {
            reply('Não consegui te localizar no banco de dados.')
        } else {
            reply(texto)
        }
    } else if (usermensagem == 'b') {
        reply('Ok. Me envie apenas o nome que deseja adicionar na sua proxima mensagem.')
    } else {
        let messages = (await client.loadMessages(usernumero, 5)).messages
        let terceiram, terceiramL, quartam, quartamL, quintam, quintamL = 'none';

        if (messages.length >= 5) {
            terceiram = messages[2].message.conversation
            terceiramL = terceiram.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        }

        if (messages.length >= 5) {
            quartam = messages[0].message.conversation
            quartamL = quartam.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        }

        if (messages.length >= 5) {
            quintam = messages[4].message.conversation
            quintamL = quintam.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        }
        if (terceiramL == 'b') {
            reply('Você confirma que o seu nome agora será:\n' + quintam + '\n\nSim ou não')
        } else {
            if (quartamL == 'b' && quintamL == 'sim') {
                let i = 0
                while (i != usersjson.length) {
                    if (usersjson[i].numero == usernumero) {
                        person = {
                            numero: usersjson[i].numero,
                            pontos: usersjson[i].pontos,
                            foto: usersjson[i].foto,
                            nome: terceiram,
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
                            let motivos1 = 'Nenhum'
                            if (!usersjson[i].motivos == '') {
                                motivos1 = usersjson[i].motivos
                            }
                            var re = /&/gi;
                            var img = usersjson[i].foto.replace(re, 'guilhermestringreplace');
                            var result = await fetchJson(`https://monegera.000webhostapp.com/api-bot/index2.php?nome=${terceiram}&pontos=${usersjson[i].pontos}&numero=${usersjson[i].numero}&motivos=${encodeURI(motivos1)}&foto=${img}`, { method: 'post' })
                            console.log(result.code)
                            console.log(result.message)

                            reply('Ok seu nome agora é:\n' + terceiram + '.')
                            return;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    i++
                }

            } else if (quartamL == 'b' && quintamL == 'nao') {
                reply('Ok. caso queira editar, envie *B* novamente ou *MENU* para voltar ao inicio.')
            } else {
                reply('Olá! Você pode estar vendo seus pontos digitando apenas *A* ou modificar seu nome, escrevendo *B*.')
            }
        }
    }
}

module.exports = { pvdevpolice }
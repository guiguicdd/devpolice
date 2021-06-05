var exec = require('child_process').exec

exec('am start --user 0 -n com.yowhatsapp/com.yowhatsapp.HomeActivity', function (err) {
    if (err) { //process error
        console.log(err);
    }

    else {
        console.log("success open")
        console.log('Whatsapp aberto com sucesso');
    }

})
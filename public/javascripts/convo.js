let botui = new BotUI('api-bot');

let socket = io.connect('http://localhost:8010');
// read the BotUI docs : https://docs.botui.org/
botui.message.add({
    content: 'What do you need?',
    delay: 1500,
}).then(function () {
    botui.action.text({
            action: {
                placeholder: 'Retrieve or Upload', }
        }
    ).then(function (res) {
            socket.emit('fromClient', { client : res.value }); // sends the message typed to server

        //console.log(res.value); // will print whatever was typed in the field.

    }).then(function () {
        socket.on('fromServer', function (data) { // recieveing a reply from server.
            if(data.treat === 'input.upload'){
                /*
                botui.message.add({
                    content: data.server,
                    delay: 500,
                });
                */
                callUIbutton(data);
            } else if(data.treat === 'input.welcome'){
                botui.message.add({
                    content: data.server,
                    delay: 500,
                });
            }


        });

    })
});

let fileName;
let callUIbutton = (data) => {
    botui.message.add({
        content: data.server,
        delay: 500,
    }).then(function () {
        botui.action.button({
            delay: 500,
            addMessage: false, // so we could the address in message instead if 'Existing Address'
            action: [{
                text: 'Upload your file',
                value: 'exist'
            }]
        }).then(function (res) {
            console.log(res.value);
            document.querySelector('input#upload').click();
            let inputElement = document.getElementById("upload");
            inputElement.addEventListener("change", handleFiles, false);
            function handleFiles() {
                let fileList = this.files; /* now you can work with the file list */
                console.log(fileList);
                fileName = fileList[0].name;
                botui.message
                    .bot({
                        delay: 500,
                        content: 'New file: ' + fileName
                    });

                return botui.action.button({
                    delay: 1000,
                    action: [{
                        icon: 'check',
                        text: 'Confirm',
                        value: 'confirm'
                    }, {
                        icon: 'pencil',
                        text: 'Edit',
                        value: 'edit'
                    }]
                }).then(function (res) {
                    if(res.value === 'confirm') {
                        end();
                    } else {
                        callUIbutton(data);
                    }
                });
            }
        })
    })
};



let end = function () {
    botui.message
        .bot({
            delay: 1000,
            content: 'Thank you. Stay with me Ill provide your key'
        });
};
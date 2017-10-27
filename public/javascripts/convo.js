let botui = new BotUI('api-bot');

let socket = io.connect('http://localhost:8010');
// read the BotUI docs : https://docs.botui.org/
let init = () => {
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

        }).then(function () {
            socket.on('fromServer', function (data) { // recieveing a reply from server.
                if(data.treat === 'input.upload'){
                    callUIbutton(data);
                } else if(data.treat === 'input.welcome'){
                    botui.message.add({
                        content: data.server,
                        delay: 500,
                    });
                } else if(data.treat === 'input.retrieve'){
                    botui.message.add({
                        content: data.server,
                        delay: 500,
                    }).then(function () {
                        botui.action.text({
                                action: {
                                    placeholder: 'Insert your key', }
                            }
                        ).then(function (res) {
                            socket.emit('retrieveImage', res.value);
                        });
                    });
                }


            });
        })

    });
};

let definedFile;
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
            document.querySelector('input#upload').click();
            let inputElement = document.getElementById("upload");
            inputElement.addEventListener("change", handleFiles, false);
            function handleFiles() {
                let fileList = this.files; /* now you can work with the file list */
                definedFile = fileList[0];
                botui.message
                    .bot({
                        delay: 500,
                        content: 'New file: ' + definedFile.name
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
                        console.log(definedFile);
                        botui.message
                            .bot({
                                delay: 1000,
                                content: 'Thank you. Stay with me Ill provide your key'
                            }).then(function () {
                            botui.message.add({
                                loading: true
                            }).then(function (index) {
                                // do some stuff like ajax, etc.
                                socket.emit('toSwarm', definedFile);
                                socket.on('toSendHash', function (d) {
                                    end(index, d);
                                })
                            });
                        })
                    } else {
                        callUIbutton(data);
                    }
                });
            }
        })
    })
};



let end = (index,hash) => {

    if(hash){
            botui.message
                .update(index, {
                    loading: false,
                    delay: 1000,
                    content: hash
                }).then(init)
    }
};

init();
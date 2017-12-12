let botui = new BotUI('api-bot');
let socket = io('//localhost:3000');

// read the BotUI docs : https://docs.botui.org/
let sessID;

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
            socket.emit('fromClient', { client : res.value});

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
                            /*
                            botui.message.add({
                                type: 'embed',
                                content: `//pure-ridge-42982.herokuapp.com:8080/ipfs/${res.value}`
                            }).then(init);
                            */

                            socket.emit('retrieveImage', res.value);
                            socket.on('image', function (retImage){
                                downloadFile(res.value, retImage)
                            })

                        })
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
        }).then(function () {
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

let downloadFile = (downloadHash, returned) => {
        if(returned){
            botui.action.button({
                delay: 500,
                addMessage: false,
                action: [{
                    text: 'Download',
                    value: 'exist'
                }]
            }).then(function (res) {
                if(res.value === 'exist'){
                    window.open(`/download/${downloadHash}`);
                }
            }).then(function(){
                botui.message.add({
                    content: 'Download Iniciated',
                    delay: 1500,
                }).then(function(){
                socket.emit('removeFile', downloadHash);
                socket.on('imageRemoved', function (d) {
                    if(d){
                        init();
                    }
                });
            });
        })} else {
            botui.message.add({
                content: 'Image not found',
                delay: 1500,
            }).then(init);
        }
};

let end = (index,hash) => {

    if(hash){
            botui.message
                .update(index, {
                    loading: false,
                    delay: 1000,
                    content: hash
                }).then(function(){
                botui.message.add({
                    content: 'Do you want to save your file on your account?',
                    delay: 1500,
                }).then(function () {
                    botui.action.button({
                        delay: 1000,
                        action: [{
                            icon: 'check',
                            text: 'Yes',
                            value: 'confirm'
                        }, {
                            icon: 'alert',
                            text: 'No',
                            value: 'edit'
                        }]
                    }).then(function (res) {
                        if(res.value === 'confirm') {
                            botui.message
                                .bot({
                                    delay: 1000,
                                    content: 'How would you name it?'
                                }).then(function () {
                                botui.action.text({
                                        action: {
                                            placeholder: 'receipt01', }
                                    }
                                ).then(function (res) {
                                    let userElement = document.getElementById("name");
                                    socket.emit('saveList', { 'user': userElement.innerHTML, 'name' : res.value, 'hash' : hash }); // sends file hash to be stored
                                    socket.on('updateList', function (d) {
                                        if(d) {
                                            let list = document.getElementsByClassName("listContainer");
                                            list[0].innerHTML += '<li class="active" id="'+hash+'" onclick="retrieveFromList(this)"><a class="pointer"><i class="glyphicon glyphicon-ok" ></i> '+res.value+'</a></li>'
                                        }
                                    })
                                }).then(init);
                            })
                        } else {
                            init();
                        }
                    });
                })
            })
    }
};

let retrieveFromList = (elem) =>{
     let hash = elem.id;
    return botui.message.add({
        content: 'Retrieving from list : ' + hash + '.',
    }).then(function () {
        socket.emit('retrieveImage', hash);
        socket.on('image', function (retImage){
            downloadFile(hash, retImage)
        })
    });
};

init();
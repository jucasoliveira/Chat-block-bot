let botui = new BotUI('api-bot');

let socket = io.connect('http://localhost:8010');
// read the BotUI docs : https://docs.botui.org/
botui.message.add({
    content: 'Hey, do you need help?',
    delay: 1500,
}).then(function () {
    botui.action.text({
            action: {
                placeholder: 'Retrieve or Upload my Recepit', }
        }
    ).then(function (res) {
            socket.emit('fromClient', { client : res.value }); // sends the message typed to server

        console.log(res.value); // will print whatever was typed in the field.

    }).then(function () {
        socket.on('fromServer', function (data) { // recieveing a reply from server.
            if(data.treat === 'input.upload'){
                botui.action.button({
                    delay: 500,
                    addMessage: false, // so we could the address in message instead if 'Existing Address'
                    action: [{
                        text: 'Upload your file',
                        value: 'exist'
                    }]
                }).then(function () {
                    document.querySelector('input#upload').click();
                    var inputElement = document.getElementById("upload");
                    inputElement.addEventListener("change", handleFiles, false);
                    function handleFiles() {
                        var fileList = this.files; /* now you can work with the file list */
                        console.log(fileList);
                    }

                })
            } else if(data.treat === 'input.welcome'){
                botui.message.add({
                    content: data.server,
                    delay: 500,
                });
            }


        });

    })
});
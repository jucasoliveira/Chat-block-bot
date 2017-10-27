# Chat-block-bot
A blockchain chatbot to keep your receipt images

##### Table of Contents 
[1. Set Up BlockChain]()

[..1.1 Building Geth]()

[..1.2 Building Swarm]()

[..1.3 Run the Applications]()

[..1.3.1 Etherum]()

[..1.3.2 Swarm]()

[2. Web3 JS]()

[3. Mongo DB]()

[4. Docker]()

## Introduction

This application will provide a smart chatbot ui, where the user will be 
able to talk, as well ask for upload and retrieve files.

When the files are uploaded, the chatbot will provide a unike key for the
user, where he can use it to retrieve his file. The file will remain immutable
and the user cant send the file adulterated within the same key.

The application consists with the follow functionalities :
1. Login/Logout:  the user login will be controlled by MongoDB, as well login datas and hash attempts to be retrieved
2. Upload : The files will be storage on Swarm
3. Retrieve : Files will be retrieved by Swarm

 The Chatbot will be a Node.js Application with :
 
 A Handlebars UI with botui API , integrated with dialogflow ( or Watson conversation)
 
 Express JS midleware , to provide the REST API, integrating the login and the upload/retrieve functions
 
 MongodDB database to user control. Storing , retrieving and denying access to the application
 
 Swarm/Etherum Storage : Etherum its a blockchain node , which provide a p2p unique code, Swarn it's a
 servless p2p storage that the files will be kept and return when the unique key will be provided.

 Docker to deploy the application to the server containerized

## 1 Set up blockchain

### 1.1 Building Geth (command line client)

Clone the repository to a directory of your choosing:

```git clone https://github.com/ethereum/go-ethereum```

Building geth requires some external libraries to be installed:

    GMP
    Go

brew install gmp go

Finally, build the geth program using the following command.

```bash
cd go-ethereum
make geth
```

### 1.2 Building Swarm

After installed the Geth, now it's time to install Swarm

```bash
make swarm
```

### 1.3 Run The applications

#### 1.3.1 Etherum

To make an Etherum account to hook your Swarm, start by running the following command:

```build/bin/geth account new```

You will be prompted for a password:

```
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase:
Repeat passphrase:
```
Once you have specified the password (for example MYPASSWORD) the output will be your Ethereum address. This is also the base address for your Swarm node.

```Address: {2f1cd699b0bf461dcfbf0098ad8f5587b038f0f1}```

Since we need to use it later, save it into your ENV variables under the name BZZKEY

```BZZKEY=2f1cd699b0bf461dcfbf0098ad8f5587b038f0f1```

Next, start your geth node and establish connection with Ethereum main network with the following command

 ```build/bin/geth```
 
#### 1.3.2 Swarm
 
 After the connection is established, open another terminal window and connect to Swarm with
 
 ```swarm --bzzaccount $BZZKEY```
 
 How do I upload and download?
 
 The best way to upload and download files to/from Swarm has to do with using curl.
 
 To upload a single file, run this:
 
 ```curl -H "Content-Type: text/plain" --data-binary "some-data" http://localhost:8500/bzz:/```
 
 Once the file is uploaded, you will receive a hex string which will look similar to.
 
 ```027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39```
 
 This is the address string of your file inside Swarm.
 
 To download a file from swarm, you just need the file’s address string. Once, you have it the process is simple. Run:
 
 ```curl -s http://localhost:8500/bzz:/027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39```
 
 And that’s it.
 
 ## 2. Web3 JS
 
 
 ## 3. Mongo DB
 

If you have installed mongodb through homebrew then you can simply start mongodb through

```brew services start mongodb```

Then access the shell by

``mongo``

You can shut down your db by

```brew services stop mongodb```

For more options

```brew info mongodb```


## 4. BotUI & DialogFlow
 
## 4. Docker



 

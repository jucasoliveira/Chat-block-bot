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
   
 ![project overview](/public/images/projectOverviewPic.png)

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
 
 #### 1.3.3 IPFS
 
 IPFS it's another storage which could sucessfully store images
 
 
```
wget https://dist.ipfs.io/go-ipfs/v0.4.11/go-ipfs_v0.4.11_darwin-amd64.tar.gz

tar xvfz go-ipfs.tar.gz

mv go-ipfs/ipfs /usr/local/bin/ipfs 

```

##### init the repo

ipfs uses a global local object repository, added to ~/.ipfs:

```> ipfs init
initializing ipfs node at /Users/jbenet/.go-ipfs
generating 2048-bit RSA keypair...done
peer identity: Qmcpo2iLBikrdf1d6QU6vXuNb6P7hwrbNPW9kLAH8eG67z
``` 

to get started, enter:

  ```ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme```

Note the hash there may differ. If it does, use the one you got.

Now, try running:

```ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme```

You should see something like this:

Hello and Welcome to IPFS!

If you're seeing this, you have successfully installed
IPFS and are now interfacing with the ipfs merkledag!

 -------------------------------------------------------
| Warning:                                              |
|   This is alpha software. use at your own discretion! |
|   Much is missing or lacking polish. There are bugs.  |
|   Not yet secure. Read the security notes for more.   |
 -------------------------------------------------------

Check out some of the other files in this directory:

  ./about
  ./help
  ./quick-start     <-- usage examples
  ./readme          <-- this file
  ./security-notes

You can explore other objects in there. In particular, check out quick-start:

```ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/quick-start```

Which will walk you through several interesting examples.
...Going Online

To be able to be connected by node run this comand before run the server
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
```

Once you’re ready to take things online, run the daemon in another terminal:

```
> ipfs daemon
Initializing daemon...
API server listening on /ip4/127.0.0.1/tcp/5001
Gateway server listening on /ip4/127.0.0.1/tcp/8080
```

Wait for all three lines to appear.
Make note of the tcp ports you get. if they are different, use yours in the commands below.

Now, if you’re connected to the network, you should be able to see the ipfs addresses of your peers:
```
> ipfs swarm peers
/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ
/ip4/104.236.151.122/tcp/4001/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx
/ip4/134.121.64.93/tcp/1035/ipfs/QmWHyrPWQnsz1wxHR219ooJDYTvxJPyZuDUPSDpdsAovN5
/ip4/178.62.8.190/tcp/4002/ipfs/QmdXzZ25cyzSF99csCQmmPZ1NTbWTe8qtKFaZKpZQPdTFB
```
These are a combination of <transport address>/ipfs/<hash-of-public-key>.

Now, you should be able to get objects from the network. Try:

ipfs cat /ipfs/QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg >cat.jpg
open cat.jpg

And, you should be able to give the network objects. Try adding one, and then viewing it in your favorite browser. In this example, we are using curl as our browser, but you can open the IPFS URL in other browsers as well:
```
> hash=`echo "I <3 IPFS -$(whoami)" | ipfs add -q`
> curl "https://ipfs.io/ipfs/$hash"
I <3 IPFS -<your username>
```
Cool, huh? The gateway served a file from your computer. The gateway queried the DHT, found your machine, requested the file, your machine sent it to the gateway, and the gateway sent it to your browser.
Note: depending on the state of the network, the `curl` may take a while. The public gateways may be overloaded or having a hard time reaching you.

You can also check it out at your own local gateway:
```
> curl "http://127.0.0.1:8080/ipfs/$hash"
I <3 IPFS -<your username>
```
By default, your gateway is not exposed to the world, it only works locally.
Fancy Web Console

We also have a web console you can use to check the state of your node. On your favorite web browser, go to:

    http://localhost:5001/webui

This should bring up a console like this:

Web console connection view



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



 

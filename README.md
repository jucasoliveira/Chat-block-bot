# Chat-block-bot
A blockchain chatbot to keep your receipt images

## Introduction

This application provide a smart chatbot ui, where the user will be 
able to talk, as well ask for upload and retrieve files.

When the files are uploaded, the chatbot will provide a unike key for the
user, where he can use it to retrieve his file. The file will remain immutable
and the user cant send the file adulterated within the same key.

The application consists with the follow functionalities :
1. Login/Logout:  the user login will be controlled by MongoDB, as well login datas and hash attempts to be retrieved
2. Upload : The files will be storage on IPFS
3. Retrieve : Files will be retrieved by IPS
4. Save: you will be able to save your file in a list.

 The Chatbot will be a Node.js Application with :
 
 A Handlebars UI with botui API , integrated with dialogflow ( or Watson conversation)
 
 Express JS midleware , to provide the REST API, integrating the login and the upload/retrieve functions
 
 MongodDB database to user control. Storing , retrieving and denying access to the application
 
 Swarm/Etherum Storage : Etherum its a blockchain node , which provide a p2p unique code, Swarn it's a
 servless p2p storage that the files will be kept and return when the unique key will be provided.

 Docker to deploy the application to the server containerized
   
## 1 Set up 


To run this aplication locally you will need :

.Github

.Docker / docker-compose


Clone this application

```git clone -d localDevelopemnt https://github.com/jucasoliveira/Chat-block-bot```



 ## 2. Run
 
 ```bash
docker-compose up
```
 
 


 

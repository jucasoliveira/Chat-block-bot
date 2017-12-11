FROM node:boron

RUN mkdir docker-node-mongo
RUN cd docker-node-mongo

RUN mkdir /tmp/ipfs-docker-staging
RUN mkdir /tmp/ipfs-docker-data

WORKDIR /opt/ipfs
RUN wget https://dist.ipfs.io/go-ipfs/v0.4.11/go-ipfs_v0.4.11_linux-amd64.tar.gz
RUN tar xvfz go-ipfs_v0.4.11_linux-amd64.tar.gz
RUN cp go-ipfs/ipfs /usr/local/bin
RUN ipfs init
RUN ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]' \
    && ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]' \
    && ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'

RUN ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001
RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

#### hpps for socket io ###

CMD  openssl genrsa 1024 > file.pem && \
    openssl req -new -key file.pem "/C=/ST=/L=/O=/CN=db" -out csr.pem  && \
    openssl x509 -req -days 365 -in csr.pem -signkey file.pem -out file.crt

COPY . /app


EXPOSE 3000
EXPOSE 4001
EXPOSE 5001
EXPOSE 8000
EXPOSE 8080

CMD ./script_up.sh
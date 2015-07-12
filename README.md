# Surge - server

Surge is a lightweight "framework" for SockJS, providing an API on top of it, adding extra features. If you come from socket.io like i did, you will find it easier to adjust with SockJS using Surge.

This project consists of 
- [surge-server](https://github.com/spideynr/surge)
- [surge-client](https://github.com/spideynr/surge-client)

You can use [surge-client](https://github.com/spideynr/surge-client) without having your own surge-server.

##How to install

You need to have installed [nodejs](https://nodejs.org/).
Clone this repo to your machine and run  
```shell
npm install
```

##Run

Run nodemon with : 
```shell
npm start
```
If you want to keep your remote machine up and running, i recommend using [pm2](https://github.com/Unitech/pm2). You should also configure it to run on startup in case of server restarting for any reason.

__Dont forget__ to use your server ip/domain as a host in [surge-client](https://github.com/spideynr/surge-client)

##Features
- Blazing fast to set up.
- Auto-reconnecting already enabled (also reconnects to previously connected rooms) 
- Smaller learning curve if you come from socket.io and you want to use some of its features heads on with the SockJS API
- If the socket gets disconnected all further emits will go to a buffer. Upon reconnection the events will fire with the same series that they were called 
- I will be maintaining this library since i will be using it on production
- Open source! Want to change something? Fork it change it , do a pull request or don't and keep it for yourself
- Check roadmap for more!


##Roadmap
- Authenticating connection requests using a token/secret hmac
- Add authentication endpoint option for Authenticating users on the socket
- Introduce Private - Preservance Channels after authenticating users
- Build an interface for main Surge server to register developers/apps generate keys and show usage stats for every app
- Add support for persisting users using cookie-based session
- Use redis to scale surge servers behind a HAProxy load balancer and provide a more production-ready library

##Contributions
I will be maintaining this project since i will be using it in production for my apps, but if you want to help out filling the [issue tracker](https://github.com/spideynr/surge/issues) or helping with the code, feel free to contact me or do a pull request

##Licence
MIT

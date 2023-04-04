My exercise submissions for the fullstackopen course.

## Part 3.10 

> Create a README.md at the root of your repository, and add a link to your online application to it.

[Link](https://purple-resonance-9186.fly.dev)


---


## Course Notes

A collection of random scripts and commands I know I'm going to need to use in the future.

### How to kill node server that's running in the background

[Source](https://stackoverflow.com/a/30163868)

I got the following error while trying to run a Node server

```
$ nodemon index.js
...
Error: listen EADDRINUSE: address already in use :::3003`
...
```

It seems like a previous instance of the Node server is still running in the background.

See what process is occupying that port: 

```
`$ lsof -i tcp:3003`
COMMAND  PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    4457 micah   23u  IPv6  36925      0t0  TCP *:cgms (LISTEN)
```

And kill it: `$ kill -15 4457`
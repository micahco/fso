My exercise submissions for the fullstackopen course.

## Part 3.10 

> Create a README.md at the root of your repository, and add a link to your online application to it.

[Link](https://purple-resonance-9186.fly.dev)


---


## Course Notes

A collection of random scripts and commands I know I'm going to need to use in the future.

### Lift the shared state

[Source](https://fullstackopen.com/en/part5/props_children_and_proptypes#state-of-the-forms)

React documentation says the following about where to place the state:

> Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.

### EADDRINUSE: address already in use (node server)

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
$ lsof -i tcp:3003
COMMAND  PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    4457 micah   23u  IPv6  36925      0t0  TCP *:cgms (LISTEN)
```

And kill it:
```
$ kill -15 4457
```

### EADDRINUSE: Part 2

[Source](https://stackoverflow.com/a/66239788)

Now, the node server starts up fine, but whenever I make a change to a file, I get the same error

```
$ nodemon index.js
...
Error: listen EADDRINUSE: address already in use :::3003`
...
```

It seems like the server is being restarted before the daemon kills the existing server

Luckily, nodemon has a built in delay option that solves the problem

```
$ nodemon --delay 500ms index.js
```

One last note: sometimes a restart is all you need. (But also sometimes a restart breaks everything)
# Intro to NodeJS :

## Following are the core modules in nodejs:

1) fs(File System Module) : fs is a core module in nodejs. It provides a way to access the file system.It provides methods to read and write files.

2) path(Path Module) : path is a core module in nodejs. It helps us with path to files.

3) os(Operating System Module) : os is a core module in nodejs. It helps us with operating system relevent info.

4) http(HTTP Module) : http is a core module in nodejs. It helps us with lauching a server and sending requests to the other servers.

5) https(HTTPS Module) : https is a core module in nodejs. It helps us with lauching a ssl server.

## Event loop in node : 

![](2022-02-11-19-37-10.png)

* When we run our app.js file a new server is created and it does rest of the other stuff.

* After which it starts an event loop and this loop keeps on running as long as there are event listeners registered to this loop.

* In the app.js example we created a server with a request listener which listens to all the requests we make to our server.

* A way to end this event loop is through `process.exit()`.

## Requests : 

* <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers">Response headers</a>

* Following explains the concept of streams and buffers : ![](C:/CODING/Web/NodeJS/3_NodeJS_Intro/2022-02-16-08-34-01.png)
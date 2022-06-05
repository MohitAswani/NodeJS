# Websockets and Socket.IO :

* Our approach (pull approach) till now : ![](2022-06-05-14-32-34.png)

* ![](2022-06-05-14-34-48.png)

* In this new approach called push approach if something changes on the server side and we wanted to actively inform the client (for example in a chat app).

* To do this above task we will be using the websocket protocol instead of the HTTP protocol. 

* Websockets are built up on HTTP , they use a HTTP handshake to upgrade the HTTP protocol to websocket protocol and the websocket protocol simply determines how the data is exchanged.

* ![](2022-06-05-14-40-17.png)

* Websocket just like HTTP can be used to send data from client to server but it can also be used to push data to the client from the server.

* We will be using the socket.io library to do this. Socket io uses websockets and gives us a lot of convinience methods to do , that make it very easy to setup websockets.

* We will need to add the socket io on the server and the client so both on the node and the react app.

* To install socket io on the server we run `npm i --s socket.io`.

## Summary :

* So using socket io we can push code from server to client using the emit function. But socket io is not the only way to implement web sockets.


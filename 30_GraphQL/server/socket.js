let io;

// We are managing the socket io connection in this file and we can export the io object from this file to the other files like the feed controller.

// We export two functions from this file.

module.exports={
    init:(httpServer,options)=>{
        io=require('socket.io')(httpServer,options);
        return io;
    },
    getIo:()=>{
        if(!io){
            throw new Error('Socket.io not initialized');
        }

        return io;
    }

};
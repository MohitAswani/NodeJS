const mongodb=require('mongodb');

const MongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=(callback)=>{
    MongoClient.connect('mongodb+srv://aswanim96:Mohit1234@cluster0.o2of3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(client=>{
        console.log('Connected');

        // here we will store the access to the database so that we dont have to call mongoConnect function again and again 

        // mongo will create the database on its own and we don't need to do anything.
        _db=client.db();
        callback();
    })
    .catch(err=>{
        console.log(err);
        throw err;
    });
}


// We use this function to get access to the database and mongodb will manage this very elegantly with connection pooling where mongodb will make sure it provides sufficient connections for multiple simultaneous interactions with the database.

const getDb=()=>{
    if(_db){
        return _db;
    }

    throw 'No Database found';
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
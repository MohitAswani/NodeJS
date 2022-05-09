const mongodb=require('mongodb');

const MongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=(callback)=>{
    MongoClient.connect('mongodb+srv://aswanim96:Mohit1234@cluster0.o2of3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(client=>{
        console.log('Connected');
        _db=client.db();
        callback();
    })
    .catch(err=>{
        console.log(err);
        throw err;
    });
}

const getDb=()=>{
    if(_db){
        return _db;
    }

    throw 'No Database found';
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
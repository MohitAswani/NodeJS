const fetchData=()=>{
    const promise=new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('Done')
        },1500);
    }); // declaring a promise prevents nested callbacks and also make this code synchronous. Since promise will be return as soon as it is made.

    // resolve is for successful callback and reject is for failure.

    // when we use libraries we dont have to write the promise it is already made we just need to attach the callback inside then.

    return promise;
    
};
setTimeout(()=>{
    console.log('Timer is done!')
    fetchData()
    .then(text=>{
        console.log(text);
        return fetchData();   // this is what is leading to the next fetching of data 
        // then will attach the callback we define inside it for resolve or reject of a promise
    })
    .then(text=>{             // this callback attaches itself to fetchData() returned by the above then
        console.log(text);
        return fetchData();
    });

    // using promises makes the async code sequential rather than nested. So in the above code we are fetching data twice one after another.
},2000);  

// Below is a sync code since they happen immediately.
console.log('Hello!');
console.log('Hi!');

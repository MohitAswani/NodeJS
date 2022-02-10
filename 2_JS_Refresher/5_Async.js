
// Below is an async code since it doesnot happen immediately. JS does not allow async code to block the execution of rest of the code. Rather it allows callbacks which means that one the async code is finished implementing it will return execution to that function.
setTimeout(()=>{
    console.log('Timer is done!')
},2000);  

// Below is a sync code since they happen immediately.
console.log('Hello!');
console.log('Hi!');

// Async code is fine but issues arise when there multiple async code which depend on each other.

// var my_name='Mohit';
// var age=20;
// var isDumDum=true;

// instead of using var to declare variables we use let. Also to declare the variables which do not change we use const.
const my_name='Mohit';
let age=20;
const isDumDum=true;

// my_name="Max";
age++;

// the below function is an arrow function.
const sumarizeUser=(name,age,isDumDum)=>{
    return 'Name is '+name+', age is '+age+', is dum-dum is '+isDumDum;
};

// const add=(a,b)=>{
//     return a+b;
// };

// if we only have a single statement in a function we can remove the curly braces and also the return statement.
const add=(a,b)=>a+b;

// if we only have one argument then we remove the paranthesis
const addOne=a=>a+1;

const addRandom=()=>1+2;

console.log(addRandom())
console.log(add(2,3));
console.log(addOne(2));
console.log(sumarizeUser(my_name,age,isDumDum));

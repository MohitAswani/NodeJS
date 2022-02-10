const person = {
    name: 'Mohit',
    age: 20,
    greet() { console.log("Hello I am " + this.name) }
};

const hobbies=['Coding','Coking','Sports'];

// const copiedArray=hobbies.slice(); // this will simply copy the entire array hobbires

// const copiedArray=[hobbies]; // this only creates a nested array with hobbies as the new element.

const copiedArray=[...hobbies]; // this is a spread operator this. This operator pulls out all the properties and objects of the object/array after the operator and puts it to the variable it is assigned to. 

const copiedPerson={...person} // spread operator

// But the spread operator does not create a deep copy. Which means that the objects inside the object/array will still point to the same objects as the copied object/array.

console.log(copiedArray);
console.log(copiedPerson);

const toArray=(arg1,arg2,arg3)=>{
    return [arg1,arg2,arg3];
};

console.log(toArray(1,2,3,4));

// the below function used the rest operator ('...') to take any number of arguments and return the output
const toArrayWithRest=(...args)=>{
    return args;  // this will bundle it up to an array and return it.
};

console.log(toArrayWithRest(1,2,3,4,5,6,7,8));

// '...' can act as both rest and spread operators.

// If we use it to pull elements from an object/array then it will be an spread operator.

// If we use it to merge elements in to an array and pass it to a function then it will be an rest operator.
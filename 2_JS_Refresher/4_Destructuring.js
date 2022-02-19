const person = {
    name: 'Mohit',
    age: 20,
    greet() { console.log("Hello I am " + this.name) }
};

const printName1=(inputPerson)=>console.log(inputPerson.name);

printName1(person);

// But if we only want to use a single property of an object then we can just use the concept of object destructuring and pass the property which we require as the argument (but we need to add) curly brackets arround it) to that function and use it.

const printName2=({name,age,greet})=>{
    console.log(name+","+age);
    greet(); // this will print undefined since its not being called on any person object.
};

printName2(person);

const {name,age} = person; // this will store the person.name to name and person.age to age using object destructuring. Note that the variables where we store the properties in should have the same as the property of that object.

console.log(name,age);

// we can also destructure hobbies

const hobbies=['Sports','Running',69,false,420];

const [hobby1,hobby2]=hobbies; // we are destructuring an array and we wrap it with []. Also we dont have to care about the names as they will be alloted by the order.

console.log(hobby1,hobby2);
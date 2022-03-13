
// We can also have functions inside an object but if we need to refer to the object inside that function then its better to not use arrow function and just use the below syntax to define the function.

const person = {
    name: 'Mohit',
    age: 20,
    greet() {
        console.log("Hello I am " + this.name)
    }
    // if we just write greet using a arrow function then 'this' keyword refers to the global scope 
};

console.log(person);
person.greet();

const hobbies = ['Sports', 'Running', 69, false, 420];
// for(let hobby of hobbies)
// {
//     console.log(hobby)
// }

// map function is used to edit and change the array and we pass the function in hobbies.map to alter each element in the array.
console.log(hobbies.map(hobby => 'Hobby: ' + hobby));

console.log(hobbies);

hobbies.forEach(hobby => console.log(hobby));

// Even though hobbies is const we can add elements to it since it is a reference type and it only contains the reference to the array / the address of that array. This reference or the address will not change if we change the array.

hobbies.push("Coding");

console.log(hobbies);
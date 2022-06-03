# Async/Await :

* A way of working with async code more elegantly.

* Can be used anywhere in JS.(Backend as well as frontend)

* Allows us to write asynchronous code in a synchronous manner.

* What we mean is that it allows us to write the code in a way it looks synchronous but it still works asynchronously.

* Till now we have used callbacks and then-catch to deal with asynchronous code. 

* To use the await keyword in a function we need to prepend the async keyword in front of the function where we intend to use the await keyword.

* So instead of attaching then for every async code we just initialize it to a variable with await. And it converts it to then and catch by itself.

* Also to catch errors we use try-catch instead of then-catch.

* After Node 14 we can also use await outside of the function. But we need to use async keyword in front of the function if we intend to use await inside the function.

* Mongoose operations do not return real promise but a promise like object, we get a real promise by using the exec function.++

* We must put the validation error code inside the try block of controller function.
# Ejs:

* Ejs can be used out of the box in an express app.

* Ejs doesn't come with the ability to use layouts.

* To template a value in ejs we use <%= value%>.

* To wrap a block of code we use <% %>.

* In within <% %> we can write vanilla js code.

* Ejs has the flexibility of using normal js code.

* Instead of using layouts we use partials or includes in ejs. The idea is to have some code blocks which you reuse in different parts of your templates and hence we can share them accross our templates.

* To add a code to our ejs file we use <%- > to add unescaped html code. So <%- > will render the code that is inside it.

* To add that code to our file we also use an include function and pass in the path of our file relative to the current file.






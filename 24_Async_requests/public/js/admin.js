const deleteProduct = (btn) => {

    // We pass this in the ejs file which will pass the element on which it is clicked on to the function.

    const prodId = btn.parentNode.querySelector('[name=id]').value;  // we are using attribute selector here for productId.

    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    // There is closest method provided by JS which gives us the closest element with that selector and the closert ancestor element to be precise.

    const productElement = btn.closest('article');   // should give us the product to delete

    // To send HTTP request we can use the fetch method which is a method supported by the browser for sending HTTP requests.

    // Its also for sending data.

    // In the second argument we can configure our requests.

    // we can add a body not for delete request but for a post request.

    // In the headers we include our csrf token as we cannot send that in body becuase delete request do not have a body.

    // And the csrf package not only looks in the body for the token but it also looks in the query and headers.

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        return result.json();
    })
        .then(data => {
            console.log(data);
            // productElement.remove();  // this is function which is not supported in explorer and we will have to access the parent node and then remove a child.
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => {
            console.log(err);
        });
};
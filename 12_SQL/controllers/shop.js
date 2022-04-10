const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/products'
        });
    });
};

exports.getProduct = (req,res,next) => {
    const prodId= req.params.productId;  // we can extract the dynamic data by refering to it using the variable name after the :.
    
    Product.findById(prodId,product=>{
        res.render('shop/product-details',{
            pageTitle: product.title,
            path:'/products',
            product:product
        })
    });

    // We can use this dynamic route to return the product that this id refers to.

    // res.redirect('/');
}

exports.getIndex=(req,res,next)=>{
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop from shop.js',
            path: '/',
        });
    });
};

exports.getCart=(req,res,next)=>{
    Cart.fetchCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts=[];
            for(let product of products){
                const cartProductData=cart.products.find(prod=>prod.id===product.id);
                if(cart.products.find(prod=>prod.id===product.id)){
                    cartProducts.push({productData:product,qty:cartProductData.qty});
                }
            }
            res.render('shop/cart',{
                path:'/cart',
                pageTitle: 'Your Cart',
                products:cartProducts
            })
        });
    });
};

exports.postCart=(req,res,next)=>{
    const prodId=req.body.productId.trim();
    Product.findById(prodId,(product)=>{
        Cart.addProduct(prodId,product.price);
    })
    res.redirect('/cart');
}

exports.getOrders=(req,res,next)=>{
    res.render('shop/orders',{
        path:'/orders',
        pageTitle: 'Your orders'
    })
}


exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
        path:'/checkout',
        pageTitle: 'Checkout'
    })
};

exports.postDeleteCartProduct=(req,res,next)=>{
    let {id,price}=req.body;
    id=id.trim();
    price=price.trim();
    Cart.deleteProduct(id,price);
    res.redirect('/cart');
}


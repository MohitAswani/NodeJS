const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database');  
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

// We add a new middleware because we want to store that user in our request so that we can use it 

// The below code will be called only when there is an incoming request and we add user in the incoming request.

app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        
        // In the below code we are adding a new field to our request object but we shld make sure that we dont overwrite any object.

        req.user=user;  // user here is not just a js object rather its an sequelize object hence we can also execute methods on it.
        next();
    })
    .catch(err=>{
        console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

// The sync() function will sync all the models we define with our sql and will create a table for all of them and also add the relations.

// So this is how we sync our models with our database.

// We can relate our two model before we sync sequelize.

// The second argument in the belongsTo method are the constraints which define how the relation should be managed.

// For example we can set onDelete which will define what will happen to the product if the user is deleted here CASCADE means that if we delete the user , the products related to the user will also be deleted.

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

// The inverse of the above relation

// Means that User has one to many relation with Product.

User.hasMany(Product);

// Since we have already create product and user table to implement these relations we need to set the force:true in the sync method.

// Now there will be two tables and the product table will have a foreign key 'userId' which refrences the id of the user who added the product.

// The below two statements will add userId to the card table which denotes the user to which the cart belongs.

User.hasOne(Cart);

Cart.belongsTo(User);

// This is a many to many relation and a cart can have many products and a product can belong to many different cart.

// This only works with an intermediate table that connects them which basically stores a combination of product ids and cart ids and for that we created the cart item model.

// Here we use the through option to tell it the intermediate model/table it must use for connecting the two table.

Cart.belongsToMany(Product,{through:CartItem});

Product.belongsToMany(Cart,{through:CartItem});


let fetchedUser;

sequelize
    // .sync({force:true})       // we will comment this out since our work is done and we do not want the database to again and again redefine our models
    .sync()
    .then(result=>{
        return User.findByPk(1);
        // sequelize will run all the queries regarding all of the sequelize function we call in our code.
        // console.log(result);
    })
    .then(user=>{
        if(!user){
            return User.create({name:'Mohit',email:'aswanim96@gmail.com'});
        }
        // return user; // to maitain the pattern in our code we return promise.resolve(user) instead of user but we can ignore this since whenever we return a value from a then block it is automatically wrapped in a promise.
        return Promise.resolve(user);
    })
    .then(user=>{
        fetchedUser=user;
        // console.log(user);
        return Cart.findAll({where:{userId:user.id}})
    })
    .then(cart=>{
        if(!cart[0]){
            return fetchedUser.createCart();
        }

        return Promise.resolve(cart);
    })
    .then(cart=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    });

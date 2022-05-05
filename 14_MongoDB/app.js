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
const Order =  require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(bodyParser.urlencoded({limit: '50mb',extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;  
        next();
    })
    .catch(err=>{
        console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});


User.hasMany(Product);


User.hasOne(Cart);

Cart.belongsTo(User);

Cart.belongsToMany(Product,{through:CartItem});

Product.belongsToMany(Cart,{through:CartItem});

Order.belongsTo(User);

User.hasMany(Order);

Order.belongsToMany(Product,{through:OrderItem});

let fetchedUser;

sequelize
    // .sync({force:true})      
    .sync()
    .then(result=>{
        return User.findByPk(1);
    })
    .then(user=>{
        if(!user){
            return User.create({name:'Mohit',email:'aswanim96@gmail.com'});
        }
        return Promise.resolve(user);
    })
    .then(user=>{
        fetchedUser=user;
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

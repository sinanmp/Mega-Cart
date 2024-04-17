const ecartDb = require("../model/ecartModel")
const userDb = require("../model/userModel")
const EbannerDb = require("../model/ecartBanner")

exports.addProduct=async(req,res)=>{
    try {
       const {pname , price ,dicPrice ,imageUrl, discription,catogery , quantity} = req.body

        const newProduct = new ecartDb({
            pname : pname ,
            price : price ,
            dicPrice : dicPrice ,
            imageUrl :imageUrl ,
            discription : discription ,
            catogery : catogery,
            quantity:quantity
        })
        await newProduct.save()
        res.json("product successfully saved")
    } catch (error) {
        res.send('error from catch' ,error)
    }
}



exports.getProducts=async(req,res)=>{
    try {
        const data = await ecartDb.find()
        res.json(data)
    } catch (error) {
        res.send(error)
    }
}


exports.ecartUser =async(req,res)=>{
    try {
        const {username , email , mobile , password ,confirmPassword} = req.body
        const newUser=new userDb({
            username:username ,
            email : email ,
            mobile : mobile ,
            password : password ,
            confirmpassword :confirmPassword
        })
        newUser.save()
        res.json('user saved successfully')
    } catch (error) {
        res.send(error)
    }
}


exports.ecartLogin=async(req,res)=>{
    try {
        const {email , password} = req.body
        const data = await userDb.findOne({email:email})
        if(!data){
            res.json("user Not exist")
        }else{
            if(data.password == password){
                res.status(200).send('success')
            }else{
                res.send("password is not match")
            }
        }
    } catch (error) {
        res.send(error)
    }
}



exports.addtocart = async (req, res) => {
    try {
    
        await userDb.updateOne(
            { email: req.body.email },
            { $push: { ecartCart: req.body.productId } }
        );

        res.send('product added to cart');
    } catch (error) {
        res.send(error);
    }
};



exports.cart=async(req,res)=>{
    try {
        const email = req.query.email
        const data = await userDb.findOne({email:email})
        const products = data.ecartCart
        const cartDatas = []

        for(let i = 0 ; i< products.length ; i++){
            let data = await ecartDb.findOne({_id:products[i]})
            cartDatas.push(data)
        }

        res.json(cartDatas)
    } catch (error) {
        res.send(error)
    }
}



exports.addBanner = async(req,res)=>{
    try {
        const imageUrl = req.body.imageUrl
        const newUrl = new EbannerDb({
            imageUrl : imageUrl
        })
        await newUrl.save()
        res.send("imageUrl addedd successfully")
    
    } catch (error) {
        res.send(error)
    }
 
}


exports.getBanner=async(req,res)=>{
    try {
        const data = await EbannerDb.find()
        res.json(data)
    } catch (error) {
        res.send(error)
    }
}      


exports.removeFromCart = async (req, res) => {
    try {
        const result = await userDb.updateOne(
            { email: req.body.email },
            { $pull: { ecartCart: req.body.productId } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).send('Product not found in cart');
        }
        res.send('Product removed from cart');
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.updateCount=async(req,res)=>{
    try {
        if(req.query.action == 1){
            const prData = await ecartDb.findOne({_id:req.body.productId})
            await ecartDb.updateOne({_id:req.body.productId} ,{$set:{quantity:prData.quantity+1}})
            res.send("quantity increased")
        }else{
            const prData = await ecartDb.findOne({_id:req.body.productId})
            await ecartDb.updateOne({_id:req.body.productId} ,{$set:{quantity:prData.quantity-1}})
            res.send("quantity decreased")
        }
    } catch (error) {
        res.send(error)
    }
}
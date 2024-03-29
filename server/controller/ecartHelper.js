const ecartDb = require("../model/ecartModel")
const userDb = require("../model/userModel")



exports.addProduct=async(req,res)=>{
    try {
       const {pname , price ,dicPrice ,imageUrl, discription,catogery} = req.body

        const newProduct = new ecartDb({
            pname : pname ,
            price : price ,
            dicPrice : dicPrice ,
            imageUrl :imageUrl ,
            discription : discription ,
            catogery : catogery
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
        const productDetails = await ecartDb.aggregate([
            {
                $lookup: {
                  from: "ecartDb", 
                  localField: "ecartCart",
                  foreignField: "_id",
                  as: "productDetails"
                }
              }
        ])
        res.json(productDetails)
    } catch (error) {
        res.send(error)
    }
}


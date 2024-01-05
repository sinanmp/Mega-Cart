const cartDb = require("../model/cartSchema")
const orderDb=require("../model/orderSchema")
const productdb = require("../model/productModel")
const Razorpay=require("razorpay");
const userDb = require("../model/userModel");
const razorpayInstance = new Razorpay({
    key_id: process.env.KEY_VALUE,
    key_secret: process.env.KEY_SECRET,
  });

exports.orderContinue=(req,res)=>{
    res.redirect("/payment")
}



exports.submitOrder = async (req, res) => {
    console.log(req.body)
    const id = req.query.prId;
    if (id) {
        try {
            const data = await productdb.findOne({ _id: id });
            if(data.stock<=0){
                res.json({errorforStock:"no Stock"})
                return
            } 
           console.log(req.session.OrderInfo.locality+"   this is the best rout session")
            const NewOrder = {
                email: req.session.OrderInfo.email,
                username: req.session.OrderInfo.username,
                products: {
                    pname:data.pname,
                    prd_images:data.prd_images,
                    category:data.category,
                    description:data.description,
                    additional_info:data.additional_info,
                    discount:data.discount,
                    brand:data.brand,
                    price:data.price,
                    purchase:data.purchase,
                    reviews:data.reviews,
                    Ofprice:data.Ofprice,
                    discountedPrice:data.discountedPrice
                },
                totalAmount: req.session.totalPriceinPrid,
                shippingAddress: {
                    locality: req.session.OrderInfo.locality,
                    Address: req.session.OrderInfo.address,
                    city: req.session.OrderInfo.city,
                    house_no: req.session.OrderInfo.house_No,
                    postcode: req.session.OrderInfo.postcode,
                    AlternateNumber: req.session.OrderInfo.altr_number
                },
                takingFromWallet:req.session.takingFromWallet,
                PaymentMethod: req.body.payment
            };

            console.log(data)
            

            if (req.body.payment == 'Online') {
                console.log("its coming success is very dangersly")
                const randomOrderID = Math.floor(Math.random() * 1000000).toString();
                if(req.session.DisplayAmount>=1){
                    req.session.totalPriceinPrid=req.session.DisplayAmount
                }
                const options = {
                    amount: req.session.totalPriceinPrid,  
                    currency: "INR",  
                    receipt: randomOrderID,
                };      

                await new Promise((resolve, reject) => {
                    razorpayInstance.orders.create(options,async(err) => {
                        if (!err) {
                            console.log("Reached RazorPay Method on cntrlr", randomOrderID);
                            res.status(200).send({
                                razorSuccess: true,
                                msg: "order created",
                                amount: req.session.totalPriceinPrid*100,
                                key_id: process.env.KEY_VALUE,
                                name: "Sinan",
                                contact: "9037317210",
                                email: "sinanmhd5817@gmail.com",
                                orders:NewOrder
                            });
                            resolve();
                        } else {
                            console.error("Razorpay Error:", err);
                            res.status(400).send({
                                razorSuccess: false,
                                msg: "Error creating order with Razorpay",
                            });
                            reject();
                        }
                    });
                });
            }else {
                console.log("its coming here")
                if(req.session.DisplayAmount>=1){
                    req.session.totalPriceinPrid=req.session.DisplayAmount
                }
              
                if(req.session.DisplayAmount==0){
                    const NewOrder =new orderDb({   
                        email: req.session.OrderInfo.email,
                        username: req.session.OrderInfo.username,
                        products: {
                            pname:data.pname,
                            prd_images:data.prd_images,
                            category:data.category,
                            description:data.description,
                            additional_info:data.additional_info,
                            discount:data.discount,
                            brand:data.brand,
                            price:data.price,
                            purchase:data.purchase,
                            reviews:data.reviews,
                            Ofprice:data.Ofprice,
                            discountedPrice:data.discountedPrice
                        },
                        totalAmount: req.session.totalPriceinPrid,
                        shippingAddress: {
                            locality: req.session.OrderInfo.locality,
                            Address: req.session.OrderInfo.address,
                            city: req.session.OrderInfo.city,
                            house_no: req.session.OrderInfo.house_No,
                            postcode: req.session.OrderInfo.postcode,
                            AlternateNumber: req.session.OrderInfo.altr_number
                        },
                        takingFromWallet:req.session.takingFromWallet,
                        PaymentMethod: 'complete from Wallet'
                    })
                    await productdb.updateOne({ _id: id }, { $inc: { stock: -1 } });
                    await NewOrder.save();
                    console.log(id) 
                 const updateddata= await cartDb.updateMany({prId:id},{$inc:{stock:-1}});
                    console.log(updateddata+"   its updated")
                    req.session.paymentMidd='true'
                }else{
                    const NewOrder =new orderDb({   
                        email: req.session.OrderInfo.email,
                        username: req.session.OrderInfo.username,
                        products: {
                            pname:data.pname,
                            prd_images:data.prd_images,
                            category:data.category,
                            description:data.description,
                            additional_info:data.additional_info,
                            discount:data.discount,
                            brand:data.brand,
                            price:data.price,
                            purchase:data.purchase,
                            reviews:data.reviews,
                            Ofprice:data.Ofprice,
                            discountedPrice:data.discountedPrice
                        },
                        totalAmount: req.session.totalPriceinPrid,
                        shippingAddress: {
                            locality: req.session.OrderInfo.locality,
                            Address: req.session.OrderInfo.address,
                            city: req.session.OrderInfo.city,
                            house_no: req.session.OrderInfo.house_No,
                            postcode: req.session.OrderInfo.postcode,
                            AlternateNumber: req.session.OrderInfo.altr_number
                        },
                        takingFromWallet:req.session.takingFromWallet,
                        PaymentMethod: req.body.payment
                    })
                    await productdb.updateOne({ _id: id }, { $inc: { stock: -1 } });
                    await NewOrder.save();
                    console.log(id) 
                 const updateddata= await cartDb.updateMany({prId:id},{$inc:{stock:-1}});
                    console.log(updateddata+"   its updated")
                    req.session.paymentMidd='true'
                }
                console.log(req.session.takingFromWallet, typeof req.session.takingFromWallet ,  "this is taking from wallet amount")
                if(req.session.takingFromWallet>0){
                        const transaction = {
                            date: new Date(),
                            category: 'purchase',
                            amount: req.session.takingFromWallet,
                            description:"Item Ordered"
                        };
    
                        const updatedUser = await userDb.findOneAndUpdate(
                          { email: req.session.OrderInfo.email },
                          {
                              $inc: { 'wallet.totalAmount':-req.session.takingFromWallet },
                              $push: { 'wallet.transactions': transaction }
                          },
                          { new: true }
                      );      
                }
                res.json({ url:`/order/success`});
             }
        } catch (error) {         
            console.log("its coming try catch")       
            console.log(error)
            res.send(error);
        }
        return;
    }



    try {
        const prdata = await cartDb.find({ email: req.session.isAuth });
        for (let i=0; i<prdata.length;i++){
            if(prdata[i].cartQhantity>prdata[i].stock){
                res.json({errorforStock:"no Stock"})
                return
            }
        }


        const productsArray = prdata.map(item => ({
            pname: item.pname,
            prd_images: item.prd_images,
            category: item.category,
            description: item.description,
            additional_info: item.additional_info,
            discount: item.discount,
            brand: item.brand,
            price: item.price,
            purchase: item.purchase,
            reviews: item.reviews,
            active: item.active,
            unlist: item.unlist,
            catStatus: item.catStatus,
            Ofprice: item.Ofprice,
            cartQuantity: item.cartQuantity,
            discountedPrice: item.discountedPrice,
            IndividualStatus: 'pending'
        }));




        if(req.session.DisplayAmount>=1){
            req.session.totalPriceinPrid=req.session.DisplayAmount
        }
        
           console.log(prdata+" this is prdata dkjfisafjadsifjdsifie")
            NewOrder = {
                email: req.session.OrderInfo.email,
                username: req.session.OrderInfo.username,
                products:productsArray,
                totalAmount:req.session.totalPriceinPrid,
                shippingAddress: {
                    locality: req.session.OrderInfo.locality,
                    Address: req.session.OrderInfo.address,
                    city: req.session.OrderInfo.city,
                    house_no: req.session.OrderInfo.house_No,
                    postcode: req.session.OrderInfo.postcode,
                    AlternateNumber: req.session.OrderInfo.altr_number
                },
                takingFromWallet:req.session.takingFromWallet,
                PaymentMethod: req.body.payment
            };
            
           

        

        if(req.body.payment=='Online'){

            console.log("its coming success is very dangersly")
            const randomOrderID = Math.floor(Math.random() * 1000000).toString();
            const options = {
                amount:req.session.totalPriceinPrid,  
                currency: "INR",  
                receipt: randomOrderID,
            };      
            console.log(NewOrder+"     this is new order for display to check")
            await new Promise((resolve, reject) => {
                razorpayInstance.orders.create(options, (err) => {
                    if (!err) {
                        console.log("Reached RazorPay Method on cntrlr", randomOrderID);
                        res.status(200).send({
                            razorSuccess: true,
                            msg: "order created",
                            amount: req.session.totalPriceinPrid*100,
                            key_id: process.env.KEY_VALUE,
                            name: "Sinan",
                            contact: "9037317210",
                            email: "sinanmhd5817@gmail.com",
                            orders:NewOrder
                        });
                        resolve();
                    } else {
                        console.error("Razorpay Error:", err);
                        res.status(400).send({
                            razorSuccess: false,
                            msg: "Error creating order with Razorpay",
                        });
                        reject();
                    }
                });
            });
        }else{
                if(req.session.DisplayAmount==0){
                    const cartOrder=new orderDb({
                        email: req.session.OrderInfo.email,
                        username: req.session.OrderInfo.username,
                        products:productsArray,
                        totalAmount: req.session.totalPriceinPrid,
                        shippingAddress: {
                            locality: req.session.OrderInfo.locality,
                            Address: req.session.OrderInfo.address,
                            city: req.session.OrderInfo.city,
                            house_no: req.session.OrderInfo.house_No,
                            postcode: req.session.OrderInfo.postcode,
                            AlternateNumber: req.session.OrderInfo.altr_number
                        },
                        takingFromWallet:req.session.takingFromWallet,
                        PaymentMethod: 'complete from Wallet'
                    })
                    await cartOrder.save()
                    for(let i=0; i<prdata.length;i++){
                        await productdb.updateOne({ _id:prdata.prId }, { $inc: { stock: -prdata[i].cartQhantity } });
                        await cartDb.updateMany({ prId: prdata[i].prId }, { $inc: { stock: -prdata[i].cartQhantity } });
                    }
                }else{
                    const cartOrder=new orderDb({
                        email: req.session.OrderInfo.email, 
                        username: req.session.OrderInfo.username,
                        products:productsArray,
                        totalAmount: req.session.totalPriceinPrid,
                        shippingAddress: {
                            locality: req.session.OrderInfo.locality,
                            Address: req.session.OrderInfo.address,
                            city: req.session.OrderInfo.city,
                            house_no: req.session.OrderInfo.house_No,
                            postcode: req.session.OrderInfo.postcode,
                            AlternateNumber: req.session.OrderInfo.altr_number
                        },
                        takingFromWallet:req.session.takingFromWallet,
                        PaymentMethod: req.body.payment
                    })
                    console.log(productsArray)
                    await cartOrder.save()
                    for(let i=0; i<prdata.length;i++){
                        console.log(prdata[i].cartQhantity , typeof(prdata[i].cartQhantity)+"   this is quantity") 
                        await productdb.updateOne({ _id:prdata[i].prId }, { $inc: { stock: -prdata[i].cartQhantity } });
                        await cartDb.updateMany({ prId: prdata[i].prId }, { $inc: { stock: -prdata[i].cartQhantity } });
                    }
                }
             
                
            
                if(req.session.takingFromWallet>0){
                    const transaction = {
                        date: new Date(),
                        category: 'purchase',
                        amount: req.session.takingFromWallet,
                        description:"Item Ordered"
                    };

                    const updatedUser = await userDb.findOneAndUpdate(
                    { email: req.session.OrderInfo.email },
                    {
                        $inc: { 'wallet.totalAmount':-req.session.takingFromWallet },
                        $push: { 'wallet.transactions': transaction }
                    },
                    { new: true }
                );      
        }
                await cartDb.deleteMany({email:req.session.isAuth})
                req.session.paymentMidd='true'
                res.json({ url:`/order/success`});
        }
     
    } catch (err) {   
        res.status(500).send(err);  
        console.log(err)       
    }
};     


exports.cancel=(req,res)=>{
    const id=req.query.orderId
    res.redirect(`/api/reason?id=${id}`)
}


exports.cancelMain = (req, res) => {
    const orderId = req.query.id;
    orderDb.updateOne({ _id: orderId }, { $set: { status: 'Canceled' } })
        .then(() => {
            orderDb.findOne({_id:orderId})   
            .then(data=>{
              productdb.updateOne({_id:data.products[0]._id},{$inc:{stock:1}})
              .then(udata=>{
                 const transaction = {
                         date: new Date(),
                         category: 'deposit',
                         amount:data.totalAmount,
                         description:"Order Cancelled"
                            };
                                
                console.log(data.products.price)
            if(data.takingFromWallet>0){
            
             userDb.findOneAndUpdate(
                { email: req.session.isAuth },
                {
                    $inc: { 'wallet.totalAmount': parseInt(data.takingFromWallet)},
                    $push: { 'wallet.transactions': transaction }
                },
                { new: true }
            ).then(data=>{
                res.redirect(`/user/orders`);
            })
        }else{
            res.redirect(`/user/orders`);
        }
              })

            })
          
        })
        .catch(err => {
            console.log("Error in catch block:", err);
            res.send(err);
        });
};


exports.changeStatus=(req,res)=>{
    const id=req.query.id
    const status=req.body.exampleRadios
    orderDb.updateOne({_id:id},{$set:{status:status}})
    .then(data=>{
        res.redirect("/admin-order")
    }).catch(err=>{
        res.send(err)
    })
}



exports.orderRoute= async(req,res)=>{
   const id=req.query.prId
   const {order} = req.body;
   if(id){
    console.log("reached")
        console.log(order)
        const NewOrder=order.orders
        console.log(NewOrder.email)
        const NewOrder2 = new orderDb({
            email: NewOrder.email,
            username: NewOrder.username,
            products: {
                pname:NewOrder.products.pname,
                prd_images:NewOrder.products.prd_images,
                category:NewOrder.products.category,
                description:NewOrder.products.description,
                additional_info:NewOrder.products.additional_info,
                discount:NewOrder.products.discount,
                brand:NewOrder.products.brand,
                price:NewOrder.products.price,
                purchase:NewOrder.products.purchase,
                reviews:NewOrder.products.reviews,
                Ofprice:NewOrder.products.Ofprice,
                discountedPrice:NewOrder.products.discountedPrice,
                IndividualStatus:'pending'
            },
            totalAmount:req.session.totalPriceinPrid,
            shippingAddress: {
                locality:NewOrder.shippingAddress.locality,
                Address: NewOrder.shippingAddress.Address,
                city: NewOrder.shippingAddress.city,
                house_no: NewOrder.shippingAddress.house_no,
                postcode: NewOrder.shippingAddress.postcode,
                AlternateNumber: NewOrder.shippingAddress.AlternateNumber
            },
            takingFromWallet:req.session.takingFromWallet,
            PaymentMethod: NewOrder.PaymentMethod
        });
        await NewOrder2.save()
        await productdb.updateOne({_id:id},{$inc:{stock:-1}})
        await cartDb.updateMany({prId:id},{$inc:{stock:-1}})
        req.session.paymentMidd='true'
        if(req.session.takingFromWallet>0){
            const transaction = {
                date: new Date(),
                category: 'purchase',
                amount: req.session.takingFromWallet,
                description:"Item Ordered"
            };

            const updatedUser = await userDb.findOneAndUpdate(
              { email: req.session.OrderInfo.email },
              {
                  $inc: { 'wallet.totalAmount':-req.session.takingFromWallet },
                  $push: { 'wallet.transactions': transaction }
              },
              { new: true }
          );      
    }
        res.json({ url:`/order/success`});
        return
   }else{
    const NewOrder=order.orders
    for(let i=0;i<NewOrder.products.length;i++){
        const NewOrder1=new orderDb({
            email: NewOrder.email,
            username: NewOrder.username,
            products: NewOrder.products[i],
            totalAmount:req.session.totalPriceinPrid,
            shippingAddress: {
                locality:NewOrder.shippingAddress.locality,
                Address: NewOrder.shippingAddress.Address,
                city: NewOrder.shippingAddress.city,
                house_no: NewOrder.shippingAddress.house_no,
                postcode: NewOrder.shippingAddress.postcode,
                AlternateNumber: NewOrder.shippingAddress.AlternateNumber
            },
            takingFromWallet:req.session.takingFromWallet,
            PaymentMethod: NewOrder.PaymentMethod
        })
        await NewOrder1.save()
        const q = Number(NewOrder.products[i].cartQhantity);
        await productdb.updateOne({_id:NewOrder.products[i].prId},{$inc:{stock:-q}}) 
        await cartDb.updateMany({prId:NewOrder.products[i].prId},{$inc:{stock:-q}})
    }
        await cartDb.deleteMany({email:req.session.isAuth})
        console.log("its coming in else case")
        req.session.paymentMidd='true'
        if(req.session.takingFromWallet>0){
            const transaction = {
                date: new Date(),
                category: 'purchase',
                amount: req.session.takingFromWallet,
                description:"Item Ordered"
            };

            const updatedUser = await userDb.findOneAndUpdate(
              { email: req.session.OrderInfo.email },
              {
                  $inc: { 'wallet.totalAmount':-req.session.takingFromWallet },
                  $push: { 'wallet.transactions': transaction }
              },
              { new: true }
          );      
    }
        res.json({ url:`/order/success`});
   }
}



exports.takingcartForCheck=(req,res)=>{
    const email=req.query.email
    cartDb.find({email:email})
    .then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
        console.log("error in sending cartdata")
    })
}




exports.fetchOrderD=async(req,res)=>{
    const id=req.query.id
    const details= await orderDb.findOne({_id:id})
    res.send(details)
}




exports.individualOrder=async(req,res)=>{
    const data= await orderDb.findOne({_id:req.query.id})
    res.render("admin/adminSingleOrder",{order:data})
}
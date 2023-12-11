const userDb = require("../model/userModel");
const fs = require("fs");
const blockDb = require("../model/blockModel")
const orderDb=require("../model/orderSchema")
exports.register = async (req, res) => {
    const iemail = "admin@gmail.com";
    const ipass = 1234;
    try {
        if (req.body.email == iemail && req.body.password == ipass) {
            req.session.adminIsAuth=true
            req.session.adminLogerror=false
            res.redirect("/adminDash");
        } else {
            req.session.adminLogerror=true   
            req.session.adminIsAuth=false
            res.redirect("/adminLogin");
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
};

exports.find = async (req, res) => {
    try {
        const users = await userDb.find();
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message || "Internal Server Error" });
    }
};

exports.block = (req, res) => {
    const nemail = req.query.email
    blockDb.create({ email: nemail })
        .then(blockdata => {
            userDb.updateOne({ email: nemail }, { $set: { block: "true", status: "Inactive" } })
                .then(data => {
                    delete req.session.isAuth
                    res.redirect("/admin-users")
                }).catch(err => {
                    res.send(err)
                })
        }).catch(err => {
            blockDb.deleteOne({ email: nemail })
                .then(data => {
                    userDb.updateOne({ email: nemail }, { $set: { block: "false" } })
                        .then(data => {
                            res.redirect("/admin-users")
                        }).catch(err => {
                            res.send(err)
                        })
                }).catch(err => {
                    res.send(err)
                })

        })
}





exports.countUsers = async (req, res) => {
    try {
        const users = await userDb.find();
        res.send(users)
    } catch (error) {
        console.error("Error counting users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

 
exports.orderList=(req,res)=>{
 orderDb.find().sort({orderDate:-1})
 .then(data=>{
    res.send(data)
 })
    
}


exports.countOrders=(req,res)=>{
    orderDb.find()
    .then(data=>{
        res.send(data)
    })
}







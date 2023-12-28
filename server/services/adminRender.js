const axios = require("axios");
const { response } = require("express");
const userDb = require("../model/userModel");
const productdb = require("../model/productModel");
const moment = require('moment');

exports.login = (req, res) => {
    res.render("admin_login", { logError: req.session.adminLogerror }, (err, html) => {
        if (err) {
            return res.send('Internal server Error');
        }
        delete req.session.adminLogerror
        res.send(html)
    });
}

exports.dash = (req, res) => {
    axios
    .get("http://localhost:3000/api/countUsers")
        .then(response=>{
            console.log(response.data)
            const count=response.data.length
            axios.get('http://localhost:3000/api/countOrders')
            .then(data=>{
                res.render("admin/adminDashbord",{count:count,orders:data.data})
            })
            
        }).catch(err=>{
            res.send(err)
        })
        
}


exports.order = (req, res) => {
    axios
        .get('http://localhost:3000/order/list/admin')
        .then(response=>{
         res.render("admin/dashOrders",{orders:response.data});
        })

}



exports.users = (req, res) => {
    axios
        .get("http://localhost:3000/api/users")
        .then((response) => {
            res.render("admin/dashUsers", { users: response.data });
        }).catch(err => {
            console.log(err)
            res.send(err)
        })
}


exports.usersDetails = (req, res) => {
    const userid = req.query.id;
    userDb.findOne({ _id: userid })
        .then(data => {
            res.render("admin/userDetails", { user: data })
        })
}


exports.updateProcduct = (req, res) => {
    const id = req.query.id
    productdb.findOne({ _id: id })
        .then(data => {
            res.render("admin/updateProduct", { products: data })
        })

} 


exports.logout=(req,res)=>{
    req.session.adminIsAuth=false
    res.redirect("/adminLogin") 
}



exports.GetCoupenPage=(req,res)=>{
    axios
    .get('http://localhost:3000/getCoupens')
    .then(data=>{
        const coupenDatas=data.data 
        res.render("admin/adminCoupen",{coupens:coupenDatas})
    }).catch(err=>{
        res.send(err)
    })
  
}



exports.addCoupen=(req,res)=>{
    res.render("admin/addCoupen")
}
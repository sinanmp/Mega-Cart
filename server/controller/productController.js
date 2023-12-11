const userDb = require("../model/userModel");
const productDb = require("../model/productModel")
const catogorydb = require("../model/categorySchema")
const fs = require("fs");
const { resolveSoa } = require("dns");
const cartDb=require("../model/cartSchema")
exports.products = (req, res) => {
    productDb.find({ unlist: false, catStatus: true })
        .then(response => {
            res.render("admin/adminProducts", { products: response })
        }).catch(err => {
            res.send(err);
        })
}


exports.addingProduct = (req, res) => {
    catogorydb.find()
        .then(data => {
            res.render("admin/addProduct", { cat: data })
            // res.send(data)
        })      

}



exports.addProduct = (req, res) => {
    console.log(req.file);
    const product = new productDb({
        unlist: false,
        pname: req.body.prd_name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        discount:req.body.discount,
        stock:req.body.stock,
        brand:req.body.brand,
        prd_images: req.files.map(file => file.filename)
    })

    product.save()

        .then(data => {
            res.send("<script>alert('Product Added successfully!'); window.location='/admin-products';</script>");
        }).catch(err => {
            res.send(err)
        })
}




exports.updateProcduct = (req, res) => {
    const id = req.query.id

    productDb.findOne({ _id: id })
        .then(prdata => {
            console.log(prdata + "update")
            res.render("admin/updateProduct", { products: prdata })
        }).catch(err => {
            res.send(err)
        })


}


exports.productUpdate = (req, res) => {
    const productId = req.query.id
    console.log(productId + "  this is product id")
    productDb.updateOne({ _id: productId }, {
        $set: {
            pname: req.body.prd_name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            discount:req.body.discount,
            brand:req.body.brand,
            stock:req.body.stock
        }
    }).then(pdata => {
        cartDb.updateOne({prId:productId},{$set:{   pname: req.body.prd_name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            discount:req.body.discount,
            stock:req.body.stock}})
        .then(data=>{
            console.log(pdata)
            // res.redirect("/admin-products")
            res.send("<script>alert('product updated successfully!'); window.location='/admin-products';</script>");
            console.log("data updated successfull!")
        })
    }).catch(err => {
        res.send("<script>alert('Delete failed!'); window.location='/admin-products';</script>");
    })

}





exports.deleteProduct = (req, res) => {
    const productId = req.query.id;
    productDb.findOne({ _id: productId })
        .then(data => {
            productDb.updateOne({ _id: productId }, { $set: { unlist: true } })
                .then(data => {
                    cartDb.updateOne({prId:productId},{$set:{unlist:true}})
                    .then(data=>{
                        console.log(data)
                        res.redirect("/admin-products")
                    }).catch(err=>{
                        res.send(err)
                    })
                  
                })
        })
        .catch(err => {
            res.send("Error fetching product data");
        });
};



exports.unlist = (req, res) => {
    productDb.find({ unlist: true, catStatus: true })
        .then(data => {
            console.log(data)
            res.render("admin/unlisted", { products: data })
        }).catch(err => {
            res.send(err)
        })
}


exports.removeUnlist = (req, res) => {
    id = req.query.id
    console.log("remove is working")
    productDb.updateOne({ _id: id }, { $set: { unlist: false } })
        .then(data => {
            cartDb.updateOne({ prId: id }, { $set: { unlist: false } })
            .then(data=>{
                res.redirect("/unlist/api")         
            })

        }).catch(err => {
            res.send(err)
        })
}




exports.addImages = (req, res) => {
    const id = req.query.id
    productDb.findOne({ _id: id })
        .then(data => {
            const images = data.prd_images
            const id = data._id
            res.render("admin/addImages", { images: images, id: id })
        })

}


exports.removeImage = (req, res) => {
    const image = req.query.img
    const id = req.query.id
    productDb.updateOne({ _id: id }, { $pull: { prd_images: image } })
        .then(data => {
            path = `images/${image}`
            fs.unlink(path, (err => {
                res.redirect(`/add/images?id=${id}`)
            }))
        })
}



exports.uploadImage = async (req, res) => {
    const id = req.query.id
    productDb.updateOne({ _id: id }, {
        $push: {
            prd_images: req.files.map(file => file.filename)
        }
    }).then(data => {
        res.redirect("/admin-products")
    }).catch(err => {
        res.send(err)
    })
};


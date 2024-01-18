const cartDb = require("../model/cartSchema")
const catogorydb = require("../model/categorySchema")
const productDb = require("../model/productModel")


exports.category = (req, res) => {
    catogorydb.find({ status: true })
        .then(data => {
            res.render("admin/category", { category: data })
        }).catch(err => {
            res.send(err)
        })


}

exports.singleCat = (req, res) => {
    const category = req.query.cat
    console.log(category)
    productDb.find({ category: category })
        .then(data => {

            res.render("admin/singleCategory", { products: data })
        }).catch(err => {
            res.send(err)
        })

}



exports.addCategory = (req, res) => {
    catogorydb.find()
        .then(data => {
            res.render("admin/addCategory")
        })

}



exports.addCatPost = (req, res) => {
    const category = req.body.categoryName.toLowerCase();
    cat = new catogorydb({
        name: category
    })

    cat.save()
        .then(data => {
            res.redirect("/category/api")
        }).catch(err => {
            res.send("<script>alert('This catogery is already You Added!'); window.location='/add/category';</script>");
        })
}


exports.deleteCat = async (req, res) => {
    const name = req.query.catName
    try{
        await productDb.updateMany({ category: name }, { $set: { catStatus: false } })
        console.log(name,"this is the catname")
        await cartDb.updateMany({category:name},{$set:{catStatus:false}})
             console.log("catStatus updated")
         
        await catogorydb.updateOne({ name: name }, { $set: { status: false } })
         res.redirect("/category/api")

    }catch(err){
        res.send(err)
    }

        
}


exports.unlist = (req, res) => {
    catogorydb.find({ status: false })
        .then(data => {
            res.render("admin/unlistedCat", { category: data })
        }).catch(err => {
            res.send(err)
        })
}



exports.removeFUnlist = (req, res) => {
    const name = req.query.catName

    productDb.updateMany({ category: name }, { $set: { catStatus: true } })
        .then(() => {
            cartDb.updateMany({category:name},{$set:{catStatus:true}})
            .then(data=>{
                console.log("unlists removed successfully!")
                console.log(data)
            })
        })

    catogorydb.updateOne({ name: name }, { $set: { status: true } })
        .then(data => {
            res.redirect("/unlisted/cat")
        }).catch(err => {
            res.send(err)
        })
}
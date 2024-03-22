const tudoDb = require('../model/tudoSchema')



exports.getData =async (req,res)=>{
    const data = await tudoDb.find()
    res.json(data)
}


exports.addData= async (req,res)=>{
    const {text} = req.body
    const obj = new tudoDb({
        text : text
    })
    await obj.save()
}


exports.checked= async(req,res)=>{
    await tudoDb.updateOne({_id:req.query.id},{$set:{checked:true}})
}


exports.delete=async(req,res)=>{
    await tudoDb.deleteOne({_id:req.query.id})
}
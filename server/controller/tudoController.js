const tudoDb = require('../model/tudoSchema')



exports.getData =async (req,res)=>{
    try {
        const data = await tudoDb.find()
        res.json(data)   
    } catch (error) {
        res.json(error,'from try catch')

    }

}


exports.addData= async (req,res)=>{
    try {
        const {text} = req.body
        console.log(req.body,'this is text')
        const obj = new tudoDb({
            text : text
        })
        const data = await tudoDb.find({text:text})
        if(data.length){
            console.log(data)
            return res.json("this task is already added")
        }else{
            await obj.save()
            res.json("data added successfully")
        }
    } catch (error) {
        res.json(error,'from try catch') 
    }

}


exports.checked= async(req,res)=>{
    try {
        await tudoDb.updateOne({_id:req.query.id},{$set:{checked:true}})
        const data = await tudoDb.find()
        res.json(data)
    } catch (error) {
        res.json({error:error})
    }
  
}

 
exports.delete=async(req,res)=>{
    try {
        await tudoDb.deleteOne({_id:req.query.id})
        const data = await tudoDb.find()
        res.json(data)
    } catch (error) {
        res.json({error:error})
    }
 
} 
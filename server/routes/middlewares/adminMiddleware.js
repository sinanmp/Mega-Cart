

function adminIsAuth(req,res,next){

    if(req.session.adminIsAuth){

        next()
    }else{
        res.redirect("/adminLogin")
    }
}
  
function adminIsnotAuth(req,res,next){
    if(req.session.adminIsAuth){
        res.redirect("/adminDash")
    }else{  
        next()
    }   
}

module.exports={adminIsnotAuth,adminIsAuth}  
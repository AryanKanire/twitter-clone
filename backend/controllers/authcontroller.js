module.exports.signup = async(req,res)=>{
    res.json({
        data:"you hit the singup endpoint"
    })
}

module.exports.login = async(req,res)=>{
    res.json({
        data:"you hit the login endpoint"
    })
}

module.exports.logout = async(req,res)=>{
    res.json({
        data:"you hit the logout endpoint"
    })
}
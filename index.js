const express = require('express')
const jwt = require("jsonwebtoken")
const app = express();


const SECRET_KEY = "supersecretadmin";
const JWT_SECRET = "your_jwt_secret"

app.use(express.json());

const verifyJWT = (req, res, next) =>{
    const token = req.headers['authorization']
    if(!token){
      return res.status(401).json({message: "No token provided."})
    }

    try{
        //console.log(token)
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken;
        next();
    }catch(error){
       return res.status(402).json({message: "Invalid token"})
    }
}

app.get("/admin/api/data", verifyJWT, (req, res)=>{
  res.json({message: "Protected route accessible"})
})


app.post("/admin/login", (req, res)=>{
     const {secret} = req.body
     if(secret === SECRET_KEY){
    const token = jwt.sign({role: "admin"}, JWT_SECRET, {expiresIn: "24hr"})
       res.json({
        token, 
        name: "Admin",
        email: "admin@example.com",
      })
     }else{
       res.json({message: "Invalid Secret"})
     }

})

app.listen(3000, ()=>{
    console.log(`Server is running on 3000`)
})
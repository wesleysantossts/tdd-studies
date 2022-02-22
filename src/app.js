const express = require("express"), app = express(), mongoose = require("mongoose"), UserModel = require("./models/User"); 
const bcrypt = require("bcrypt"), jwt = require("jsonwebtoken"), JWTSecret = "hafhskfhash fkahdksfhaklf";

app.use(express.urlencoded({extended: false}), express.json());
mongoose.connect("mongodb://localhost:27017/guiapics").then().catch(error => console.log("Erro ao conectar com o banco de dados", error));

app.get("/", (req, res)=>{
    res.json({})
});

app.post("/user", async (req, res)=>{
  let {nome, email, password} = req.body;
  if(nome === "" || email === "" || password === ""){
    return res.sendStatus(400);
  };

  try {
    // Impedir que o usuário cadastre um email repetido.
    let userEmail = await UserModel.findOne({"email": email});

    if(userEmail != undefined){
      res.statusCode = 400;
      res.json({error: "E-mail já cadastrado."});
      return;
    }

    // criando o um hash da senha do usuário

    let {password} = req.body, salt = await bcrypt.genSalt(10), hash = await bcrypt.hash(password, salt);

    const user = await UserModel.create({nome, email, password: hash})
  
    res.json({email})
    
  } catch (error) {
    // sendStatus() - usado para retornar um status na resposta.
    res.sendStatus(500);
  }
});

app.delete("/user/:email", async(req, res)=>{
  const {email} = req.params;

  await UserModel.deleteOne({"email": email})
  res.sendStatus(200)
});

// Autenticação com JWT
app.post("/auth", async (req, res)=>{
  let {email, password} = req.body;

  let user = await UserModel.findOne({"email": email});

  if(!user){
    res.statusCode = 403;
    res.json({errors: {email: "E-mail não cadastrado."}});
    return;
  };
  
  // .compare() - método bcrypt que compara 2 valores de password e retorna um boolean
  let isPassword = await bcrypt.compare(password, user.password);

  if(!isPassword){
    res.statusCode = 403;
    res.json({errors: {password: "Senha incorreta."}});
    return;
  }

  // Quando o usuário logar, ele ficará autenticado por 48h
  // jwt.sign({email}, JWTSecret, {expiresIn: 'hours'}, callback)
  jwt.sign({email}, JWTSecret, {expiresIn: '48h'}, (err, token)=>{
    if(err){
      res.sendStatus(500);
      console.log(err);
    } 
    res.json({token});
  })
});

module.exports = app;
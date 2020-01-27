const router = require('express').Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const secrets = require("../config/secrets")
const usersModel = require("./auth-model")
const restricted = require("./authenticate-middleware")

function generateToken(user){

  const payload = {
      subject: user.id,
      username: user.username,
      department: user.department,
  }
  const options = {
      expiresIn: "1d",
  } 
  
  return jwt.sign(payload, secrets.jwtSecret, options)
}

router.post("/register", async (req, res, next) => {
  try {
    const saved = await usersModel.add(req.body)
    
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
      const { username, password } = req.body
      const user = await usersModel.findBy({ username }).first()
      const passwordValid = await bcrypt.compare(password, user.password)
    
      if (user && passwordValid) {
          const token = generateToken(user);
          
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        })
      } else {
        res.status(401).json({
          message: "Invalid Credentials",
        })
      }
    } catch (err) {
      next(err)
  }
})

module.exports = router;


  

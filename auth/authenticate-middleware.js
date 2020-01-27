const jwt = require("jsonwebtoken")
const secrets = require("../config/secrets")

module.exports = () => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization
      const decoded = jwt.verify(token, secrets.jwtSecret)

      req.userId = decoded.subject
      next()
    } catch (err) {
        console.log(req.headers)
      return res.status(401).json({ you: "shall not pass!" })
    }
  }
}
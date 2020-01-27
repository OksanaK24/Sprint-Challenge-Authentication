const bcrypt = require("bcryptjs")
const db = require("../database/dbConfig")

function find() {
  return db("users")
      .select()
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .select()
}

async function add(user) {
  user.password = await bcrypt.hash(user.password, 10)
  const [id] = await db("users")
    .insert(user)
 
  return findById(id)
}

function findById(id) {
    return db("users")
      .where({ id })
      .first()
}

module.exports = {
  add,
  find,
  findBy,
  findById,
}
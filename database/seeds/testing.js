const bcrypt = require("bcryptjs")
function hash(password){
  return bcrypt.hash(password, 10)
}

exports.seed = async (knex) => {
  await knex("users").truncate()

  await knex("users").insert([
    {username: "Oksana", password: `${await hash("GuessWhat?")}`}
    // {username: "Oksana", password: "GuessWhat?"}s
  ])
}
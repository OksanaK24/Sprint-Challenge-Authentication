const db = require("../database/dbConfig")
const supertest = require("supertest")
const usersModel = require("./auth-model")
const server = require("../api/server")
// const bcrypt = require("bcryptjs")

beforeEach(async () => {
    await db.seed.run()
})

describe("just testing everything", () =>{
    test("all users", async () => {
        const res = await usersModel.find()
        expect(res.length).toBeGreaterThanOrEqual(0)
    })

    test("insert", async () => {
        await usersModel.add({ username: "Jane", password: "HardToGuess"})
        const users = await db("users").select()
        expect(users.length).toBeGreaterThan(0)
    })

    test("findById", async() => {
        const res = await usersModel.findById(1)
        expect(res.username).toMatch(/oksana/i)
    })

    test("create new user", async () => {
        const res = await supertest(server)
            .post("/api/auth/register")
            .send({ username: "Oleksandra", password: "QwErTy1" })
        expect(res.status).toBe(201)
        expect(res.type).toBe("application/json")
        expect(res.body.username).toMatch(/oleksandra/i)
    })

    test("create new user with identical username", async () => {
        const res = await supertest(server)
            .post("/api/auth/register")
            .send({ username: "Oksana", password: "QwErTy1" })
        console.log(res.body)
        expect(res.status).toBe(500)
    })

    test("login", async () => {
        // let hash = bcrypt.hash("GuessWhat?", 14)
        const res = await supertest(server)
            .post("/api/auth/login")
            .send({ username: "Oksana", password: "GuessWhat?"})
            // .send({ username: "Oksana", password: hash})
        // const user = await usersModel.findBy({id: 1}).first()
        // if (bcrypt.compareSync(res.body.password, user.password)) {
        //     expect(res.status).toBe(200)
        //     expect(res.type).toBe("application/json")
        //     expect(res.message).toBe(`Welcome ${res.body.username}`)
        // }
        console.log(res.body)
        expect(res.status).toBe(200)
        expect(res.type).toBe("application/json")
        expect(res.body.message).toBe("Welcome Oksana!")
    })

    test("login", async () => {
        const res = await supertest(server)
            .post("/api/auth/login")
            .send({ username: "Oksana", password: "GuessWhat!"})
        console.log(res.body)
        expect(res.status).toBe(401)
        expect(res.body.message).toBe("Invalid Credentials")
    })

})
const db = require('../db')
const bcrypt = require('bcryptjs');

class UserController {
    async createUser(req, res) {
        const {username, password, name, surname, role_id, email, phone_number} = req.body
        const password_hash = await bcrypt.hash(password, 10)
        const newUser = await db.query(`INSERT INTO users (username, password_hash, name, surname, role_id, email, phone_number) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [username, password_hash, name, surname, role_id, email, phone_number])

        res.json(newUser.rows[0])
    }
    async getUsers(req, res) {
        const Users = await db.query(`SELECT * FROM users`)

        res.json(Users.rows)
    }
    async getOneUser(req, res) {
        const {id} = req.params.id
        
        const User = await db.query(`SELECT * FROM users WHERE id = $1`, [id])

        res.json(User.rows[0])        
    }
    async updateUser(req, res) {
        const {id, username, password_hash, name, surname, role_id, email, phone_number} = req.body
        const updatedUser = await db.query(`UPDATE users SET username = $1, password_hash = $2, name = $3, surname = $4, role_id = $5, email = $6, phone_number = $7 WHERE id = $8  RETURNING *`,
            [username, password_hash, name, surname, role_id, email, phone_number, id])

        res.json(updatedUser)
    }
    async ChangeUserRole(req, res) {
        const id = req.params.id  

        const changedRole = await db.query(`UPDATE users SET role_id = 1 WHERE id = $1 RETURNING *`, [id])
        res.json(changedRole)
    }  
    async deleteUser(req, res) {
        const id = req.params.id

        const deleted = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id])
        res.json(deleted)
    }
}

module.exports = new UserController()
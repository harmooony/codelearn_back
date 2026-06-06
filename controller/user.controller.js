const db = require('../db')
const bcrypt = require('bcryptjs');

class UserController {
    
    async createUser(req, res) {
        try {
            const { username, password, name, surname, role_id, email, phone_number } = req.body
            const password_hash = await bcrypt.hash(password, 10)
            
            const newUser = await db.query(
                `INSERT INTO users (username, password_hash, name, surname, role_id, email, phone_number) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [username, password_hash, name, surname, role_id || 1, email, phone_number]
            )

            res.json(newUser.rows[0])
        } catch (e) {
            res.status(500).json({ message: 'Ошибка при создании пользователя', error: e.message })
        }
    }

    
    async getUsers(req, res) {
        try {
            const users = await db.query(`SELECT id, username, name, surname, role_id, email, phone_number FROM users ORDER BY id DESC`)
            res.json(users.rows)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async getOneUser(req, res) {
        try {
            const id = req.params.id
            const user = await db.query(`SELECT id, username, name, surname, role_id, email, phone_number FROM users WHERE id = $1`, [id])
            res.json(user.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async updateUser(req, res) {
        try {
            const { id, username, name, surname, role_id, email, phone_number } = req.body
            
            const updatedUser = await db.query(
                `UPDATE users 
                 SET username = $1, name = $2, surname = $3, role_id = $4, email = $5, phone_number = $6 
                 WHERE id = $7 RETURNING *`,
                [username, name, surname, role_id, email, phone_number, id]
            )

            res.json(updatedUser.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async ChangeUserRole(req, res) {
        try {
            const id = req.params.id  
            const { role_id } = req.body

            const changedRole = await db.query(`UPDATE users SET role_id = $1 WHERE id = $2 RETURNING *`, [role_id, id])
            res.json(changedRole.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }  

    
    async deleteUser(req, res) {
        try {
            const id = req.params.id
            const deleted = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id])
            res.json(deleted.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new UserController()
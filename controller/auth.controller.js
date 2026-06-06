const db = require('../db')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'key7277'

class AuthController {

    async register(req, res) {
        try {

            const {
                username,
                password,
                name,
                surname,
                email
            } = req.body

            const candidate = await db.query(`
                SELECT *
                FROM users
                WHERE username = $1
            `, [username])

            if (candidate.rows.length > 0) {
                return res.status(400).json({
                    message: 'User already exists'
                })
            }

            const hashPassword = await bcrypt.hash(password, 5)

            const newUser = await db.query(`
                INSERT INTO users
                (
                    username,
                    password_hash,
                    name,
                    surname,
                    email,
                    role_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [
                username,
                hashPassword,
                name,
                surname,
                email,
                1
            ])

            const token = jwt.sign(
                {
                    id: newUser.rows[0].id,
                    username: newUser.rows[0].username,
                    role_id: newUser.rows[0].role_id
                },
                SECRET_KEY,
                {
                    expiresIn: '24h'
                }
            )

            res.json({ token })

        } catch (e) {

            res.status(500).json(e.message)

        }
    }

    async login(req, res) {
        try {

            const { username, password } = req.body

            const user = await db.query(`
                SELECT *
                FROM users
                WHERE username = $1
            `, [username])

            if (user.rows.length === 0) {
                return res.status(400).json({
                    message: 'User not found'
                })
            }

            const validPassword = await bcrypt.compare(
                password,
                user.rows[0].password_hash
            )

            if (!validPassword) {
                return res.status(400).json({
                    message: 'Wrong password'
                })
            }

            const token = jwt.sign(
                {
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    role_id: user.rows[0].role_id
                },
                SECRET_KEY,
                {
                    expiresIn: '24h'
                }
            )

            res.json({ token })

        } catch (e) {

            res.status(500).json(e.message)

        }
    }

    async check(req, res) {

        res.json(req.user)
    }

}

module.exports = new AuthController()
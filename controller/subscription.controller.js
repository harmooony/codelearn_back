const db = require('../db')

class SubscriptionController {
    async addSubscription(req, res) {
        try {
            const { course_id } = req.body
            const user_id = req.user.id 

            const exist = await db.query(
                `SELECT * FROM subscriptions WHERE user_id = $1 AND course_id = $2`, 
                [user_id, course_id]
            )

            if (exist.rows.length > 0) {
                return res.status(400).json({ message: 'Вы уже подписаны на этот курс' })
            }

            const newSub = await db.query(`
                INSERT INTO subscriptions (user_id, course_id) 
                VALUES ($1, $2) 
                RETURNING *
            `, [user_id, course_id])

            res.json(newSub.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async removeSubscription(req, res) {
        try {
            const course_id = req.params.courseId
            const user_id = req.user.id

            const deleted = await db.query(`
                DELETE FROM subscriptions 
                WHERE user_id = $1 AND course_id = $2 
                RETURNING *
            `, [user_id, course_id])

            res.json(deleted.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getSubscriptions(req, res) {
        try {
            const user_id = req.user.id
            const subs = await db.query(`SELECT course_id FROM subscriptions WHERE user_id = $1`, [user_id])
            res.json(subs.rows.map(row => Number(row.course_id)))
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new SubscriptionController()
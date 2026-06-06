const db = require('../db')

class FavoriteController {
    async addFavorite(req, res) {
        try {
            const { course_id } = req.body
            const user_id = req.user.id 

            const exist = await db.query(
                `SELECT * FROM favorites WHERE user_id = $1 AND course_id = $2`, 
                [user_id, course_id]
            )

            if (exist.rows.length > 0) {
                return res.status(400).json({ message: 'Курс уже в избранном' })
            }

            const newFav = await db.query(`
                INSERT INTO favorites (user_id, course_id) 
                VALUES ($1, $2) 
                RETURNING *
            `, [user_id, course_id])

            res.json(newFav.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async removeFavorite(req, res) {
        try {
            const course_id = req.params.courseId
            const user_id = req.user.id

            const deleted = await db.query(`
                DELETE FROM favorites 
                WHERE user_id = $1 AND course_id = $2 
                RETURNING *
            `, [user_id, course_id])

            res.json(deleted.rows[0])
        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getFavorites(req, res) {
        try {
            const user_id = req.user.id
            const favorites = await db.query(`SELECT course_id FROM favorites WHERE user_id = $1`, [user_id])
            res.json(favorites.rows.map(row => Number(row.course_id)))
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new FavoriteController()
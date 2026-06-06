const db = require('../db')

class CourseController {

    
async createCourse(req, res) {
    try {
        const { title, description, price, language_id } = req.body;
        
        
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const creator_id = payload.id; 

        
        const newCourse = await db.query(
            `INSERT INTO courses (title, description, price, creator_id, language_id) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, description, price || 0, creator_id, language_id]
        );

        res.json(newCourse.rows[0]);
    } catch (e) {
        console.error("ОШИБКА DB:", e);
        res.status(500).json({ message: 'Ошибка при создании курса', error: e.message });
    }
}

    
    async getCourses(req, res) {
        try {

            const courses = await db.query(`
                SELECT 
                    courses.id,
                    courses.title,
                    courses.description,
                    courses.price,
                    courses.status,
                    courses.created_at,

                    users.name || ' ' || users.surname AS creator,

                    languages.title AS language

                FROM courses

                LEFT JOIN users 
                    ON courses.creator_id = users.id

                LEFT JOIN languages
                    ON courses.language_id = languages.id

                ORDER BY courses.id
            `)

            res.json(courses.rows)

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async getOneCourse(req, res) {
        try {

            const id = req.params.id

            const course = await db.query(`
                SELECT 
                    courses.id,
                    courses.title,
                    courses.description,
                    courses.price,
                    courses.status,
                    courses.created_at,

                    users.name || ' ' || users.surname AS creator,

                    languages.title AS language

                FROM courses

                LEFT JOIN users 
                    ON courses.creator_id = users.id

                LEFT JOIN languages
                    ON courses.language_id = languages.id

                WHERE courses.id = $1
            `, [id])

            res.json(course.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async updateCourse(req, res) {
        try {

            const id = req.params.id

            const {
                title,
                description,
                price,
                creator_id,
                status,
                language_id
            } = req.body

            const updatedCourse = await db.query(`
                UPDATE courses
                SET
                    title = $1,
                    description = $2,
                    price = $3,
                    creator_id = $4,
                    status = $5,
                    language_id = $6
                WHERE id = $7
                RETURNING *
            `, [
                title,
                description,
                price,
                creator_id,
                status,
                language_id,
                id
            ])

            res.json(updatedCourse.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async deleteCourse(req, res) {
        try {

            const id = req.params.id

            const deletedCourse = await db.query(
                `DELETE FROM courses WHERE id = $1 RETURNING *`,
                [id]
            )

            res.json(deletedCourse.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getCoursesByCreator(req, res) {

        const { creator_id } = req.params

        const courses = await db.query(`
            SELECT *
            FROM courses
            WHERE creator_id = $1
            ORDER BY id DESC
        `, [creator_id])

        res.json(courses.rows)
    }

}

module.exports = new CourseController()
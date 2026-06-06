const db = require('../db')

class LessonController {

    async createLesson(req, res) {
        try {

            const {
                course_id,
                title,
                content_type_id,
                order_number
            } = req.body

            const newLesson = await db.query(`
                INSERT INTO lessons
                (course_id, title, content_type_id, order_number)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [
                course_id,
                title,
                content_type_id,
                order_number
            ])

            res.json(newLesson.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getLessons(req, res) {
        try {

            const lessons = await db.query(`
                SELECT
                    lessons.id,
                    lessons.title,
                    lessons.order_number,

                    courses.title AS course,

                    content_types.title AS content_type

                FROM lessons

                LEFT JOIN courses
                    ON lessons.course_id = courses.id

                LEFT JOIN content_types
                    ON lessons.content_type_id = content_types.id

                ORDER BY lessons.order_number
            `)

            res.json(lessons.rows)

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getOneLesson(req, res) {
        try {

            const id = req.params.id

            const lesson = await db.query(`
                    SELECT
                        lessons.id,
                        lessons.title,
                        lessons.order_number,
                        lessons.course_id,
                        lessons.content_type_id,

                        courses.title AS course,

                        content_types.title AS content_type

                FROM lessons

                LEFT JOIN courses
                    ON lessons.course_id = courses.id

                LEFT JOIN content_types
                    ON lessons.content_type_id = content_types.id

                WHERE lessons.id = $1
            `, [id])

            res.json(lesson.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getLessonsByCourse(req, res) {
        try {

            const courseId = req.params.courseId

            const lessons = await db.query(`
               SELECT
                        lessons.id,
                        lessons.title,
                        lessons.order_number,
                        lessons.course_id,
                        lessons.content_type_id,

                        courses.title AS course,

                        content_types.title AS content_type

                FROM lessons

                LEFT JOIN courses
                    ON lessons.course_id = courses.id

                LEFT JOIN content_types
                    ON lessons.content_type_id = content_types.id

                WHERE lessons.course_id = $1

                ORDER BY lessons.order_number ASC
            `, [courseId])

            res.json(lessons.rows)

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async updateLesson(req, res) {
        try {

            const id = req.params.id

            const {
                course_id,
                title,
                content_type_id,
                order_number
            } = req.body

            const updatedLesson = await db.query(`
                UPDATE lessons
                SET
                    course_id = $1,
                    title = $2,
                    content_type_id = $3,
                    order_number = $4
                WHERE id = $5
                RETURNING *
            `, [
                course_id,
                title,
                content_type_id,
                order_number,
                id
            ])

            res.json(updatedLesson.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async deleteLesson(req, res) {
        try {

            const id = req.params.id

            const deletedLesson = await db.query(`
                DELETE FROM lessons
                WHERE id = $1
                RETURNING *
            `, [id])

            res.json(deletedLesson.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    async getLessonsByType(req, res) {
        try {

            const contentTypeId = req.params.contentTypeId

            const lessons = await db.query(`
                SELECT
                    lessons.id,
                    lessons.title,
                    lessons.order_number,

                    courses.title AS course,

                    content_types.title AS content_type

                FROM lessons

                LEFT JOIN courses
                    ON lessons.course_id = courses.id

                LEFT JOIN content_types
                    ON lessons.content_type_id = content_types.id

                WHERE lessons.content_type_id = $1

                ORDER BY lessons.order_number ASC
            `, [contentTypeId])

            res.json(lessons.rows)

        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new LessonController()
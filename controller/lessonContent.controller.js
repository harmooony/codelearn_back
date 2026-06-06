const db = require('../db')

class LessonContentController {

    
    async createContent(req, res) {
        try {

            const {
                lesson_id,
                content,
                content_type_id
            } = req.body

            const newContent = await db.query(`
                INSERT INTO lessons_content
                (lesson_id, content, content_type_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [
                lesson_id,
                content,
                content_type_id
            ])

            res.json(newContent.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async getContentByLesson(req, res) {
        try {

            const lessonId = req.params.lessonId

            const contents = await db.query(`
                SELECT
                    lessons_content.id,
                    lessons_content.content,

                    lessons.title AS lesson,

                    content_types.title AS content_type

                FROM lessons_content

                LEFT JOIN lessons
                    ON lessons_content.lesson_id = lessons.id

                LEFT JOIN content_types
                    ON lessons_content.content_type_id = content_types.id

                WHERE lessons_content.lesson_id = $1

                ORDER BY lessons_content.id
            `, [lessonId])

            res.json(contents.rows)

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async updateContent(req, res) {
        try {

            const id = req.params.id

            const {
                lesson_id,
                content,
                content_type_id
            } = req.body

            const updatedContent = await db.query(`
                UPDATE lessons_content
                SET
                    lesson_id = $1,
                    content = $2,
                    content_type_id = $3
                WHERE id = $4
                RETURNING *
            `, [
                lesson_id,
                content,
                content_type_id,
                id
            ])

            res.json(updatedContent.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async deleteContent(req, res) {
        try {

            const id = req.params.id

            const deletedContent = await db.query(`
                DELETE FROM lessons_content
                WHERE id = $1
                RETURNING *
            `, [id])

            res.json(deletedContent.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

}

module.exports = new LessonContentController()
const db = require('../db')

class TaskController {

    // CREATE TASK
    async createTask(req, res) {
        try {

            const {
                lesson_id,
                description,
                starter_code,
                solution_code,
                language
            } = req.body

            const newTask = await db.query(`
                INSERT INTO tasks
                (
                    lesson_id,
                    description,
                    starter_code,
                    solution_code,
                    language
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [
                lesson_id,
                description,
                starter_code,
                solution_code,
                language
            ])

            res.json(newTask.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    // GET TASKS FOR LESSON
    async getTasksByLesson(req, res) {

        const lessonId = req.params.lessonId

        const tasks = await db.query(`
            SELECT *
            FROM tasks
            WHERE lesson_id = $1
        `, [lessonId])

        res.json(tasks.rows[0])
    }

    // UPDATE TASK
    async updateTask(req, res) {
        try {

            const id = req.params.id

            const {
                lesson_id,
                description,
                starter_code,
                solution_code,
                language
            } = req.body

            const updatedTask = await db.query(`
                UPDATE tasks
                SET
                    lesson_id = $1,
                    description = $2,
                    starter_code = $3,
                    solution_code = $4,
                    language = $5
                WHERE id = $6
                RETURNING *
            `, [
                lesson_id,
                description,
                starter_code,
                solution_code,
                language,
                id
            ])

            res.json(updatedTask.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    // DELETE TASK
    async deleteTask(req, res) {
        try {

            const id = req.params.id

            const deletedTask = await db.query(`
                DELETE FROM tasks
                WHERE id = $1
                RETURNING *
            `, [id])

            res.json(deletedTask.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

}

module.exports = new TaskController()
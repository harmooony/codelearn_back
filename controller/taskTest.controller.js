const db = require('../db')

class TaskTestController {

    
    async createTest(req, res) {
        try {

            const {
                task_id,
                input_data,
                expected_output,
                is_hidden
            } = req.body

            const newTest = await db.query(`
                INSERT INTO task_tests
                (
                    task_id,
                    input_data,
                    expected_output,
                    is_hidden
                )
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [
                task_id,
                input_data,
                expected_output,
                is_hidden
            ])

            res.json(newTest.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async getTestsByTask(req, res) {
        try {

            const taskId = req.params.taskId

            const tests = await db.query(`
                SELECT *
                FROM task_tests
                WHERE task_id = $1
                ORDER BY id
            `, [taskId])

            res.json(tests.rows)

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async updateTest(req, res) {
        try {

            const id = req.params.id

            const {
                task_id,
                input_data,
                expected_output,
                is_hidden
            } = req.body

            const updatedTest = await db.query(`
                UPDATE task_tests
                SET
                    task_id = $1,
                    input_data = $2,
                    expected_output = $3,
                    is_hidden = $4
                WHERE id = $5
                RETURNING *
            `, [
                task_id,
                input_data,
                expected_output,
                is_hidden,
                id
            ])

            res.json(updatedTest.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

    
    async deleteTest(req, res) {
        try {

            const id = req.params.id

            const deletedTest = await db.query(`
                DELETE FROM task_tests
                WHERE id = $1
                RETURNING *
            `, [id])

            res.json(deletedTest.rows[0])

        } catch (e) {
            res.status(500).json(e.message)
        }
    }

}

module.exports = new TaskTestController()
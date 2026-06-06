const axios = require('axios')
const db = require('../db') // Добавили подключение к БД

class CodeController {

    // Старый метод для простого запуска кода (оставляем как было)
    async run(req, res) {
        try {
            const { code, input } = req.body
            const response = await axios.post(
                'https://api.jdoodle.com/v1/execute',
                {
                    clientId: process.env.JDOODLE_CLIENT_ID,
                    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                    script: code,
                    stdin: input,
                    language: 'python3',
                    versionIndex: '4'
                }
            )
            res.json(response.data)
        } catch (e) {
            console.log(e.response?.data || e.message)
            res.status(500).json({
                message: 'Execution error',
                error: e.response?.data || e.message
            })
        }
    }

    // НОВЫЙ МЕТОД: Проверка задачи по тестам
    async submitTask(req, res) {
        try {
            const { task_id, code } = req.body

            // 1. Получаем инфу о задаче (чтобы знать язык)
            const taskQuery = await db.query(`SELECT language FROM tasks WHERE id = $1`, [task_id])
            if (taskQuery.rows.length === 0) {
                return res.status(404).json({ message: 'Задача не найдена' })
            }
            const language = taskQuery.rows[0].language || 'python3'

            // 2. Достаем все тесты для этой задачи
            const testsQuery = await db.query(`SELECT * FROM task_tests WHERE task_id = $1 ORDER BY id`, [task_id])
            const tests = testsQuery.rows

            if (tests.length === 0) {
                return res.status(400).json({ message: 'К этой задаче не прикреплены тесты' })
            }

            // 3. Прогоняем код через JDoodle для каждого теста
            let passedCount = 0;
            let failedTest = null;
            let actualOutput = null;
            let compileError = null;

            for (let i = 0; i < tests.length; i++) {
                const test = tests[i];
                
                const response = await axios.post('https://api.jdoodle.com/v1/execute', {
                    clientId: process.env.JDOODLE_CLIENT_ID,
                    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                    script: code,
                    stdin: test.input_data || '',
                    language: language,
                    versionIndex: '4' 
                });

                // Если ошибка компиляции/синтаксиса
                if (response.data.statusCode !== 200) {
                    compileError = response.data.output;
                    break;
                }

                // JDoodle часто добавляет перенос строки в конце, поэтому делаем .trim()
                const output = (response.data.output || '').trim();
                const expected = (test.expected_output || '').trim();

                if (output === expected) {
                    passedCount++;
                } else {
                    failedTest = test;
                    actualOutput = output;
                    break; // Останавливаемся на первом упавшем тесте
                }
            }

            // 4. Формируем ответ
            if (compileError) {
                return res.json({
                    success: false,
                    message: `Ошибка выполнения кода`,
                    errorDetails: compileError
                });
            }

            if (failedTest) {
                return res.json({
                    success: false,
                    message: `Тест ${passedCount + 1}/${tests.length} не пройден ❌`,
                    // Если тест скрытый, прячем детали
                    input: failedTest.is_hidden ? 'Скрытые данные' : failedTest.input_data,
                    expected: failedTest.is_hidden ? 'Скрытый результат' : failedTest.expected_output,
                    actual: failedTest.is_hidden ? 'Скрыто' : actualOutput
                });
            }

            // Если дошли сюда, значит все тесты пройдены!
            return res.json({
                success: true,
                message: `Все тесты (${tests.length}) успешно пройдены! ✅`,
            });

        } catch (e) {
            console.log(e.response?.data || e.message)
            res.status(500).json({ message: 'Ошибка сервера при тестировании', error: e.message })
        }
    }
}

module.exports = new CodeController()
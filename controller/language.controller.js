const db = require('../db');

class LanguageController {
    async getLanguages(req, res) {
        try {
            
            const languages = await db.query(`SELECT id, title FROM languages ORDER BY title`);
            res.json(languages.rows);
        } catch (e) {
            res.status(500).json({ message: 'Ошибка получения языков', error: e.message });
        }
    }
}

module.exports = new LanguageController();
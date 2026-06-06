const Pool = require('pg').Pool

const pool = new Pool({
  connectionString: 'postgresql://postgres.thipgrdgptycloakzcsy:DIPL06dipl12diplom2005@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool
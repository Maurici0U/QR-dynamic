const { Client } = require('pg');

async function fixRLS() {
    const client = new Client({ connectionString: process.env.DIRECT_URL });
    await client.connect();

    const tables = ['User', 'File', 'Link', 'Scan'];
    for (const table of tables) {
        await client.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
        console.log(`RLS enabled for ${table}`);
    }

    await client.end();
}
fixRLS().catch(console.error);

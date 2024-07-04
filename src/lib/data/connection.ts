import knex from 'knex';

export const connection = knex({
    client: 'better-sqlite3',
    connection: {
        filename: './src/lib/data/db.sqlite'
    },
    useNullAsDefault: true
});

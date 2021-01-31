import postgres from 'postgres';

const IN_PROD = process.env.NODE_ENV === 'production';

export const sql = postgres(process.env.DATABASE_URL!, {
  debug: (_, query, params) => {
    if (!IN_PROD) {
      const queryString = query.split('\n').join('');
      console.log({ query: queryString, params });
    }
  },
});

export function testDBConnection() {
  sql`SELECT 1+1 AS result`
    .then(() => console.log('Connected to postgres'))
    .catch((err) => {
      if (!IN_PROD) throw Error(err);
    });
}

export function closeDBConnection() {
  sql.end().then(() => console.log('Connection to Postgres closed'));
}

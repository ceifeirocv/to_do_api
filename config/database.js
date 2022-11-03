import pkg from "pg";
const {Pool} = pkg;

const pool = new Pool({
  // connectionString:"postgres://awmbedrh:QaurH00pHuqFH4YpJqImWHDX9q2nXe8b@peanut.db.elephantsql.com/awmbedrh"
  connectionString: 'postgres://postgres:postgrespw@localhost:5432/todo_db'
});

export default pool;
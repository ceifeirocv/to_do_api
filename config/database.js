import pkg from "pg";
import * as dotenv from 'dotenv';

dotenv.config();


const {Pool} = pkg;

const pool = new Pool({
  connectionString: process.env.DB_DEV
});

export default pool;
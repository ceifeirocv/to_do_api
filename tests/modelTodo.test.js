import Todo from '../models/Todos.js';
import db from '../config/database.js';


beforeEach(async() => {
  await db.query("TRUNCATE TABLE todos RESTART IDENTITY")
});

describe('Space test suite', () => {
  it('My Space test', async () => {
    const todos =await Todo.getAll();
    console.log(typeof todos);
    expect(todos).toEqual([]);
  });
});
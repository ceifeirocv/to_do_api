/* eslint-disable no-undef */
import Todo from '../models/Todo.js';
import db from '../config/database.js';

beforeEach(async () => {
  await db.query('TRUNCATE TABLE todos RESTART IDENTITY');
});

describe('Space test suite', () => {
  it('My Space test', async () => {
    const todos = await Todo.getAll();
    expect(todos).toEqual([]);
  });
});

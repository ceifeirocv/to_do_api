/* eslint-disable no-undef */
const Todo = require('../models/Todo');
const db = require('../config/database');

beforeEach(async () => {
  await db.query('TRUNCATE TABLE todos RESTART IDENTITY');
});

describe('Space test suite', () => {
  it('My Space test', async () => {
    const todos = await Todo.getAll();
    expect(todos).toEqual([]);
  });
});

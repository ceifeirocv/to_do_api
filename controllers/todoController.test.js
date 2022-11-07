import {listTodos} from './TodoController.js';

describe('listTodos Controller', () => {
  it('has a get metthod', () => {
    expect(typeof listTodos).toBe("function")
  });
});
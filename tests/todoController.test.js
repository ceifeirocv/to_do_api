/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const httpMocks = require('node-mocks-http');
const {
  listTodos, getTodo, deleteTodo, createTodo, updateTodo,
} = require('../controllers/TodoController');
const db = require('../config/database');

let req;
let res;

beforeEach(async () => {
  await db.query('TRUNCATE TABLE todos RESTART IDENTITY');
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

// List todos test
describe('listTodo Controller', () => {
  it('has a listTodo metthod', () => {
    expect(typeof listTodos).toBe('function');
  });
  it('should  return empty array', async () => {
    await listTodos(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([]);
  });

  it('should returnd a list of Todos info', async () => {
    await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
    await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);

    await listTodos(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([{
      description: 'Sed ut perspiciatis.',
      id: 1,
      in_progress: true,
      title: 'Lorem',
    },
    {
      description: 'Sed ut perspiciatis.',
      id: 2,
      in_progress: true,
      title: 'Lorem',
    }]);
  });
});

// Get a todo test
describe('getTodo Controller', () => {
  it('has a getTodo metthod', () => {
    expect(typeof getTodo).toBe('function');
  });
  it('if it not in the database should return id Todo not found', async () => {
    req = {
      method: 'GET',
      params: {
        id: '10',
      },
    };
    await getTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Todo not found, provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      method: 'GET',
      params: {
        id: '1.0',
      },
    };
    await getTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      method: 'GET',
      params: {
        id: '1a0',
      },
    };
    await getTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('should returnd Todo info', async () => {
    await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
    req = {
      method: 'GET',
      params: {
        id: '1',
      },
    };
    await getTodo(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      description: 'Sed ut perspiciatis.',
      id: 1,
      in_progress: true,
      title: 'Lorem',
    });
  });
});

// Delete a todo
describe('deleteTodo Controller', () => {
  it('has a deleteTodo metthod', () => {
    expect(typeof deleteTodo).toBe('function');
  });
  it('should return id Todo not found', async () => {
    req = {
      method: 'DELETE',
      params: {
        id: '10',
      },
    };
    await deleteTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Todo not found, provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      method: 'DELETE',
      params: {
        id: '1.0',
      },
    };
    await deleteTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      method: 'DELETE',
      params: {
        id: '1a0',
      },
    };
    await deleteTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('should delete returnd Todo info', async () => {
    await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
    req = {
      method: 'DELETE',
      params: {
        id: '1',
      },
    };
    await deleteTodo(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'To Do: Lorem deleted',
      todo: {
        description: 'Sed ut perspiciatis.',
        id: 1,
        in_progress: true,
        title: 'Lorem',
      },
    });
  });
});

// Create a Todo
describe('createTodo Controller', () => {
  it('has a create metthod', () => {
    expect(typeof createTodo).toBe('function');
  });
  it('if no body should ask for information', async () => {
    req = {
      method: 'POST',
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a Information' });
  });
  it('if no tilte should ask for a one', async () => {
    req = {
      method: 'POST',
      body: {},
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"title\" is required' });
  });
  it('if no description should ask for a one', async () => {
    req = {
      method: 'POST',
      body: { title: 'Lorem' },
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"description\" is required' });
  });
  it('if title have less than 5 char should inform, ', async () => {
    req = {
      method: 'POST',
      body: {
        title: ' Lore ',
        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
      },
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"title\" length must be at least 5 characters long' });
  });
  it('if title have more than 50 char should inform, ', async () => {
    req = {
      method: 'POST',
      body: {
        title: ' Lorem ipsum dolor sit amet, consectetuer adipiscing ',
        description: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
      },
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"title\" length must be less than or equal to 50 characters long' });
  });

  it('if descritpion have less than 20 char should inform, ', async () => {
    req = {
      method: 'POST',
      body: {
        title: 'Lorem',
        description: 'Sed ut perspiciatis',
      },
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"description\" length must be at least 20 characters long' });
  });
  it('if descritpion have more than 250 char should inform, ', async () => {
    req = {
      method: 'POST',
      body: {
        title: 'Lorem',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vol',
      },
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"description\" length must be less than or equal to 250 characters long' });
  });

  it('should return the created todo data, inferior limite text', async () => {
    req = {
      method: 'POST',
      body: {
        title: 'Lorem',
        description: 'Sed ut perspiciatis.',
      },
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: 'To Do: Lorem added to list',
      todo: {
        id: 1,
        title: 'Lorem',
        description: 'Sed ut perspiciatis.',
        in_progress: true,
      },
    });
  });
  it('should return the created todo data, superior limite text', async () => {
    req = {
      method: 'POST',
      body: {
        title: 'Lorem ipsum dolor sit amet, consectetuer adipiscin ',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vo',
      },
    };
    await createTodo(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      message: 'To Do: Lorem ipsum dolor sit amet, consectetuer adipiscin added to list',
      todo: {
        id: 1,
        title: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vo',
        in_progress: true,
      },
    });
  });

  // update a todo
  describe('updateTodo Controller', () => {
    it('has an update metthod', () => {
      expect(typeof updateTodo).toBe('function');
    });
    it('should return id Todo not found', async () => {
      req = {
        method: 'PUT',
        params: {
          id: '10',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Todo not found, provide a valid Id' });
    });
    it('if id not integer should return id error', async () => {
      req = {
        method: 'PUT',
        params: {
          id: '1.0',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
    });
    it('if id not integer should return id error', async () => {
      req = {
        method: 'PUT',
        params: {
          id: '1a0',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
        },
      };
      await deleteTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
    });
    it('if no body should ask for information', async () => {
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Provide a Information' });
    });

    it('if title have less than 5 char should inform, ', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: ' Lore ',
          description: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: '\"title\" length must be at least 5 characters long' });
    });
    it('if title have more than 50 char should inform, ', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: ' Lorem ipsum dolor sit amet, consectetuer adipiscing ',
          description: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: '\"title\" length must be less than or equal to 50 characters long' });
    });

    it('if descritpion have less than 20 char should inform, ', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: '\"description\" length must be at least 20 characters long' });
    });
    it('if descritpion have more than 250 char should inform, ', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vol',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: '\"description\" length must be less than or equal to 250 characters long' });
    });
    it('in_progress should convert string false to boolean, ', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
          in_progress: 'false',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        message: 'To Do: 1 updated',
        todo: {
          id: 1,
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
          in_progress: false,
        },
      });
    });
    it('in_progress should be boolean, ', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
          in_progress: 0,
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: '\"in_progress\" must be a boolean' });
    });

    it('should return the Updated todo data, inferior limite text', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        message: 'To Do: 1 updated',
        todo: {
          id: 1,
          title: 'Lorem',
          description: 'Sed ut perspiciatis.',
          in_progress: true,
        },
      });
    });
    it('should return the updated todo data, superior limite text', async () => {
      await db.query('INSERT INTO todos(title, description) VALUES($1, $2)', ['Lorem', 'Sed ut perspiciatis.']);
      req = {
        method: 'PUT',
        params: {
          id: '1',
        },
        body: {
          title: 'Lorem ipsum dolor sit amet, consectetuer adipiscin ',
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vo',
          in_progress: true,
        },
      };
      await updateTodo(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        message: 'To Do: 1 updated',
        todo: {
          id: 1,
          title: 'Lorem ipsum dolor sit amet, consectetuer adipiscin',
          description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia vo',
          in_progress: true,
        },
      });
    });
  });
});

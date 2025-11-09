export default {
  routes: [
    {
      method: 'GET',
      path: '/questions',
      handler: 'question.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/questions/:id',
      handler: 'question.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/questions',
      handler: 'question.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/questions/:id',
      handler: 'question.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/questions/:id',
      handler: 'question.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

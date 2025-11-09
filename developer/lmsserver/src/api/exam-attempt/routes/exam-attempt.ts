export default {
  routes: [
    {
      method: 'GET',
      path: '/exam-attempts',
      handler: 'exam-attempt.find',
    },
    {
      method: 'GET',
      path: '/exam-attempts/:id',
      handler: 'exam-attempt.findOne',
    },
    {
      method: 'POST',
      path: '/exam-attempts',
      handler: 'exam-attempt.create',
    },
    {
      method: 'PUT',
      path: '/exam-attempts/:id',
      handler: 'exam-attempt.update',
    },
    {
      method: 'DELETE',
      path: '/exam-attempts/:id',
      handler: 'exam-attempt.delete',
    },
  ],
};

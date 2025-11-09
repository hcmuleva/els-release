export default {
  routes: [
    {
      method: 'GET',
      path: '/exams',
      handler: 'exam.find',
    },
    {
      method: 'GET',
      path: '/exams/:id',
      handler: 'exam.findOne',
    },
    {
      method: 'POST',
      path: '/exams',
      handler: 'exam.create',
    },
    {
      method: 'PUT',
      path: '/exams/:id',
      handler: 'exam.update',
    },
    {
      method: 'DELETE',
      path: '/exams/:id',
      handler: 'exam.delete',
    },
  ],
};

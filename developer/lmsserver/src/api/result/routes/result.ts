export default {
  routes: [
    // Standard CRUD routes
    {
      method: 'GET',
      path: '/results',
      handler: 'result.find',
    },
    {
      method: 'GET',
      path: '/results/:id',
      handler: 'result.findOne',
    },
    {
      method: 'POST',
      path: '/results',
      handler: 'result.create',
    },
    {
      method: 'PUT',
      path: '/results/:id',
      handler: 'result.update',
    },
    {
      method: 'DELETE',
      path: '/results/:id',
      handler: 'result.delete',
    },

    // Custom routes for filtering
    {
      method: 'GET',
      path: '/results/student/:studentId',
      handler: 'result.findByStudent',
    },
    {
      method: 'GET',
      path: '/results/course/:courseId',
      handler: 'result.findByCourse',
    },
    {
      method: 'GET',
      path: '/results/subject/:subjectId',
      handler: 'result.findBySubject',
    },
    {
      method: 'GET',
      path: '/results/exam/:examId',
      handler: 'result.findByExam',
    },

    // Publish/Unpublish routes
    {
      method: 'PUT',
      path: '/results/:id/publish',
      handler: 'result.publish',
    },
    {
      method: 'PUT',
      path: '/results/:id/unpublish',
      handler: 'result.unpublish',
    },
    {
      method: 'POST',
      path: '/results/bulk-publish',
      handler: 'result.bulkPublish',
    },

    // Create result from exam attempt
    {
      method: 'POST',
      path: '/results/from-exam-attempt',
      handler: 'result.createFromExamAttempt',
    },

    // Student statistics
    {
      method: 'GET',
      path: '/results/student/:studentId/stats',
      handler: 'result.getStudentStats',
    },
  ],
};

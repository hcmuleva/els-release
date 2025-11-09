import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::result.result', ({ strapi }) => ({
  // Get all results for a student
  async findByStudent(ctx) {
    const { studentId } = ctx.params;
    const { resultType, course, subject, isPublished } = ctx.query;

    const filters: any = {
      student: { id: studentId }
    };

    if (resultType) filters.resultType = resultType;
    if (course) filters.course = { id: course };
    if (subject) filters.subject = { id: subject };
    if (isPublished !== undefined) filters.isPublished = isPublished === 'true';

    const results = await strapi.entityService.findMany('api::result.result', {
      filters,
      populate: {
        student: {
          fields: ['id', 'username', 'email']
        },
        course: {
          fields: ['id', 'name']
        },
        subject: {
          fields: ['id', 'name']
        },
        exam: {
          fields: ['id', 'title', 'examType']
        },
        examAttempt: true,
        createdBy: {
          fields: ['id', 'username', 'email']
        }
      },
      sort: { createdAt: 'desc' }
    });

    return { data: results };
  },

  // Get results by course
  async findByCourse(ctx) {
    const { courseId } = ctx.params;
    const { isPublished } = ctx.query;

    const filters: any = {
      course: { id: courseId }
    };

    if (isPublished !== undefined) filters.isPublished = isPublished === 'true';

    const results = await strapi.entityService.findMany('api::result.result', {
      filters,
      populate: {
        student: {
          fields: ['id', 'username', 'email']
        },
        course: {
          fields: ['id', 'name']
        },
        subject: {
          fields: ['id', 'name']
        },
        exam: {
          fields: ['id', 'title', 'examType']
        }
      },
      sort: { createdAt: 'desc' }
    });

    return { data: results };
  },

  // Get results by subject
  async findBySubject(ctx) {
    const { subjectId } = ctx.params;
    const { isPublished } = ctx.query;

    const filters: any = {
      subject: { id: subjectId }
    };

    if (isPublished !== undefined) filters.isPublished = isPublished === 'true';

    const results = await strapi.entityService.findMany('api::result.result', {
      filters,
      populate: {
        student: {
          fields: ['id', 'username', 'email']
        },
        course: {
          fields: ['id', 'name']
        },
        subject: {
          fields: ['id', 'name']
        },
        exam: {
          fields: ['id', 'title', 'examType']
        }
      },
      sort: { createdAt: 'desc' }
    });

    return { data: results };
  },

  // Get results by exam
  async findByExam(ctx) {
    const { examId } = ctx.params;
    const { isPublished } = ctx.query;

    const filters: any = {
      exam: { id: examId }
    };

    if (isPublished !== undefined) filters.isPublished = isPublished === 'true';

    const results = await strapi.entityService.findMany('api::result.result', {
      filters,
      populate: {
        student: {
          fields: ['id', 'username', 'email']
        },
        exam: {
          fields: ['id', 'title', 'examType']
        },
        examAttempt: true
      },
      sort: { score: 'desc' }
    });

    return { data: results };
  },

  // Publish result (make visible to student)
  async publish(ctx) {
    const { id } = ctx.params;

    const result = await strapi.entityService.update('api::result.result', id, {
      data: {
        isPublished: true,
        publishedAt: new Date()
      },
      populate: {
        student: {
          fields: ['id', 'username', 'email']
        }
      }
    });

    return { data: result };
  },

  // Unpublish result (hide from student)
  async unpublish(ctx) {
    const { id } = ctx.params;

    const result = await strapi.entityService.update('api::result.result', id, {
      data: {
        isPublished: false,
        publishedAt: null
      }
    });

    return { data: result };
  },

  // Bulk publish results
  async bulkPublish(ctx) {
    const { ids } = ctx.request.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return ctx.badRequest('ids array is required');
    }

    const publishedResults = [];

    for (const id of ids) {
      const result = await strapi.entityService.update('api::result.result', id, {
        data: {
          isPublished: true,
          publishedAt: new Date()
        }
      });
      publishedResults.push(result);
    }

    return { data: publishedResults, count: publishedResults.length };
  },

  // Calculate and create result from exam attempt
  async createFromExamAttempt(ctx) {
    const { examAttemptId } = ctx.request.body;

    if (!examAttemptId) {
      return ctx.badRequest('examAttemptId is required');
    }

    // Fetch exam attempt
    const examAttempt = await strapi.entityService.findOne(
      'api::exam-attempt.exam-attempt',
      examAttemptId,
      {
        populate: {
          student: true,
          exam: {
            populate: {
              course: true,
              subject: true
            }
          }
        }
      }
    );

    if (!examAttempt) {
      return ctx.notFound('Exam attempt not found');
    }

    if (examAttempt.status !== 'graded' && examAttempt.status !== 'submitted') {
      return ctx.badRequest('Exam attempt must be submitted or graded');
    }

    // Check if result already exists
    const existingResult = await strapi.entityService.findMany('api::result.result', {
      filters: {
        exam_attempt: { id: examAttemptId }
      }
    });

    if (existingResult.length > 0) {
      return ctx.badRequest('Result already exists for this exam attempt');
    }

    // Calculate grade based on percentage
    let grade = 'F';
    const percentage = examAttempt.percentage;

    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 80) grade = 'B+';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 70) grade = 'C+';
    else if (percentage >= 65) grade = 'C';
    else if (percentage >= 60) grade = 'D+';
    else if (percentage >= 55) grade = 'D';
    else grade = 'F';

    // Calculate GPA (4.0 scale)
    let gpa = 0;
    if (percentage >= 90) gpa = 4.0;
    else if (percentage >= 85) gpa = 3.7;
    else if (percentage >= 80) gpa = 3.3;
    else if (percentage >= 75) gpa = 3.0;
    else if (percentage >= 70) gpa = 2.7;
    else if (percentage >= 65) gpa = 2.3;
    else if (percentage >= 60) gpa = 2.0;
    else if (percentage >= 55) gpa = 1.7;
    else gpa = 0;

    // Create result
    const result = await strapi.entityService.create('api::result.result', {
      data: {
        resultType: (examAttempt as any).exam.examType || 'exam',
        score: examAttempt.score,
        maxScore: (examAttempt as any).exam.totalPoints,
        percentage: examAttempt.percentage,
        grade: grade,
        gpa: gpa,
        passed: examAttempt.passed,
        student: (examAttempt as any).student.id,
        course: (examAttempt as any).exam.course?.id || null,
        subject: (examAttempt as any).exam.subject?.id || null,
        exam: (examAttempt as any).exam.id,
        exam_attempt: examAttemptId,
        isPublished: false,
        createdBy: ctx.state.user?.id || null
      },
      populate: {
        student: {
          fields: ['id', 'username', 'email']
        },
        course: {
          fields: ['id', 'name']
        },
        subject: {
          fields: ['id', 'name']
        },
        exam: {
          fields: ['id', 'title', 'examType']
        },
        examAttempt: true
      }
    });

    return { data: result };
  },

  // Get student statistics
  async getStudentStats(ctx) {
    const { studentId } = ctx.params;

    const results = await strapi.entityService.findMany('api::result.result', {
      filters: {
        student: { id: studentId },
        isPublished: true
      },
      populate: {
        course: true,
        subject: true
      }
    });

    if (results.length === 0) {
      return {
        data: {
          totalResults: 0,
          averageScore: 0,
          averagePercentage: 0,
          averageGPA: 0,
          passedCount: 0,
          failedCount: 0,
          passRate: 0,
          byCourse: {},
          bySubject: {},
          byResultType: {}
        }
      };
    }

    // Calculate statistics
    const totalResults = results.length;
    const totalScore = results.reduce((sum, r: any) => sum + (r.score || 0), 0);
    const totalPercentage = results.reduce((sum, r: any) => sum + (r.percentage || 0), 0);
    const totalGPA = results.reduce((sum, r: any) => sum + (r.gpa || 0), 0);
    const passedCount = results.filter((r: any) => r.passed).length;
    const failedCount = totalResults - passedCount;

    // Group by course
    const byCourse = results.reduce((acc, r: any) => {
      if (r.course) {
        const courseName = r.course.name;
        if (!acc[courseName]) {
          acc[courseName] = { count: 0, totalPercentage: 0, passed: 0 };
        }
        acc[courseName].count++;
        acc[courseName].totalPercentage += r.percentage || 0;
        if (r.passed) acc[courseName].passed++;
      }
      return acc;
    }, {});

    // Calculate averages for each course
    Object.keys(byCourse).forEach(course => {
      byCourse[course].average = byCourse[course].totalPercentage / byCourse[course].count;
      byCourse[course].passRate = (byCourse[course].passed / byCourse[course].count) * 100;
    });

    // Group by subject
    const bySubject = results.reduce((acc, r: any) => {
      if (r.subject) {
        const subjectName = r.subject.name;
        if (!acc[subjectName]) {
          acc[subjectName] = { count: 0, totalPercentage: 0, passed: 0 };
        }
        acc[subjectName].count++;
        acc[subjectName].totalPercentage += r.percentage || 0;
        if (r.passed) acc[subjectName].passed++;
      }
      return acc;
    }, {});

    // Calculate averages for each subject
    Object.keys(bySubject).forEach(subject => {
      bySubject[subject].average = bySubject[subject].totalPercentage / bySubject[subject].count;
      bySubject[subject].passRate = (bySubject[subject].passed / bySubject[subject].count) * 100;
    });

    // Group by result type
    const byResultType = results.reduce((acc, r: any) => {
      const type = r.resultType;
      if (!acc[type]) {
        acc[type] = { count: 0, totalPercentage: 0, passed: 0 };
      }
      acc[type].count++;
      acc[type].totalPercentage += r.percentage || 0;
      if (r.passed) acc[type].passed++;
      return acc;
    }, {});

    // Calculate averages for each type
    Object.keys(byResultType).forEach(type => {
      byResultType[type].average = byResultType[type].totalPercentage / byResultType[type].count;
      byResultType[type].passRate = (byResultType[type].passed / byResultType[type].count) * 100;
    });

    return {
      data: {
        totalResults,
        averageScore: totalScore / totalResults,
        averagePercentage: totalPercentage / totalResults,
        averageGPA: totalGPA / totalResults,
        passedCount,
        failedCount,
        passRate: (passedCount / totalResults) * 100,
        byCourse,
        bySubject,
        byResultType
      }
    };
  }
}));

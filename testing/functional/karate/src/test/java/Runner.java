import com.intuit.karate.junit5.Karate;

class Runner {

    @Karate.Test
    Karate testCourse() {
        // Runs all features in the "features" package
        return Karate.run("classpath:features/course/create_course.feature");
    }
    @Karate.Test
    Karate testGetCourse() {
        // Runs all features in the "features" package
        return Karate.run("classpath:features/course/get_course.feature");
    }
      @Karate.Test
    Karate testExam() {
        // Runs all features in the "features" package
        return Karate.run("classpath:features/exam/create_exam.feature");
    }
}

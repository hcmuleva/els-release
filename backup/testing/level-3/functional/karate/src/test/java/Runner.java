import com.intuit.karate.junit5.Karate;

class Runner {

    @Karate.Test
    Karate runTests() {
        return Karate.run("classpath:features");
    }
}


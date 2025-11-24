FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

# Copy project
COPY pom.xml .
COPY src ./src

# Download dependencies first
RUN mvn -q -e -DskipTests install

# Default command (can be overridden)
ENTRYPOINT ["mvn", "test"]

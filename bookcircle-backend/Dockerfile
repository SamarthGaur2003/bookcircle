# ---- Build Stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Create empty .env so spring-dotenv doesn't crash (Render uses env vars directly)
RUN touch .env
RUN mvn clean package -DskipTests

# ---- Run Stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/bookcircle-0.0.1-SNAPSHOT.jar app.jar
RUN touch .env
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

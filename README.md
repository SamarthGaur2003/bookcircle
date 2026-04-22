GANPATI BAPPA MORYA

# ⚙️ Setup Instructions
## Clone the repository
git clone <repo-url>
## Configure database in application.properties
## Run the application
mvn spring-boot:run
## Test APIs using Postman

# ==============================
# SPRING BOOT - ESSENTIAL COMMANDS
# ==============================

# Run application
mvn spring-boot:run

# (Windows wrapper - recommended)
mvnw.cmd spring-boot:run


# Clean project (remove old build)
mvn clean


# Build project (compile + package)
mvn package


# Clean + full build (most used)
mvn clean install


# Run generated JAR file
java -jar target/bookcircle-0.0.1-SNAPSHOT.jar


# Fix most issues (force rebuild)
mvn clean install -U


# Run with full error logs (debug)
mvn spring-boot:run -e


# Run tests
mvn test


# Skip tests during build
mvn clean install -DskipTests


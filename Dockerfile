# ==============================================================================
# Fleet Maintenance Management System - Backend Dockerfile
# Multi-stage production build: Builder -> Minimal JRE Runtime
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Maven Builder
# ------------------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Pre-copy POM to leverage Docker layer caching for Maven dependencies
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production JRE Runtime
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="ABC Logistics DevOps Team <devops@abclogistics.com>" \
      description="Fleet Maintenance Management System - Spring Boot Backend" \
      version="1.0.0"

# Install curl for robust health checks and diagnostics
RUN apk add --no-cache curl tzdata

# Create dedicated non-root application user and group for security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy packaged JAR from builder stage
COPY --from=builder /build/target/fleet-maintenance-backend-*.jar app.jar

# Enforce secure ownership and switch to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose backend service port
EXPOSE 8090

# Default runtime environment variables
ENV SERVER_PORT=8090 \
    SPRING_PROFILES_ACTIVE=dev \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Container healthcheck: verify backend HTTP endpoint responsiveness
HEALTHCHECK --interval=15s --timeout=5s --start-period=25s --retries=3 \
  CMD curl -f http://localhost:${SERVER_PORT}/api/auth/health || exit 1

# Execute Spring Boot application
ENTRYPOINT ["sh", "-c", "exec java ${JAVA_OPTS} -jar app.jar"]

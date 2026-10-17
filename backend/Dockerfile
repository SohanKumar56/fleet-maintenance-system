# ==============================================================================
# Fleet Maintenance Management System - Backend Dockerfile (Context: backend/)
# Multi-stage production build: Builder -> Minimal JRE Runtime
# ==============================================================================

# Stage 1: Maven Builder
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B || true

COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="ABC Logistics DevOps Team <devops@abclogistics.com>" \
      description="Fleet Maintenance Management System - Spring Boot Backend" \
      version="1.0.0"

RUN apk add --no-cache curl tzdata

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /build/target/fleet-maintenance-backend-*.jar app.jar

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8090

ENV SERVER_PORT=8090 \
    SPRING_PROFILES_ACTIVE=dev \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

HEALTHCHECK --interval=15s --timeout=5s --start-period=25s --retries=3 \
  CMD curl -f http://localhost:${SERVER_PORT}/api/auth/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java ${JAVA_OPTS} -jar app.jar"]

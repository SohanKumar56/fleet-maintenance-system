pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['production', 'staging', 'development'],
            description: 'Target deployment environment'
        )
        string(
            name: 'SERVER_PORT',
            defaultValue: '8090',
            description: 'Embedded Tomcat server port for the Spring Boot backend'
        )
        string(
            name: 'DOCKER_REGISTRY',
            defaultValue: 'localhost:5000',
            description: 'Target Docker registry endpoint for publishing versioned images'
        )
        string(
            name: 'CONTAINER_PORT',
            defaultValue: '8092',
            description: 'Host port to bind the deployed Docker container'
        )
        string(
            name: 'CONTAINER_NAME',
            defaultValue: 'fleet-production-app',
            description: 'Name of the running deployed application container'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run automated JUnit unit and service tests before packaging'
        )
        booleanParam(
            name: 'RUN_SELENIUM_TESTS',
            defaultValue: true,
            description: 'Run automated Selenium WebDriver E2E test suite and quality gate'
        )
    }

    environment {
        APP_NAME         = 'fleet-maintenance-system'
        JAR_NAME         = 'fleet-maintenance-backend-0.0.1-SNAPSHOT.jar'
        DEPLOY_BASE      = "${WORKSPACE}/deployments/${params.ENVIRONMENT}"
        IMAGE_REPO       = "${params.DOCKER_REGISTRY}/fleet-maintenance-system"
        VERSION_TAG      = "build-${env.BUILD_NUMBER}"
        VERSIONED_IMAGE  = "${params.DOCKER_REGISTRY}/fleet-maintenance-system:build-${env.BUILD_NUMBER}"
        LATEST_IMAGE     = "${params.DOCKER_REGISTRY}/fleet-maintenance-system:latest"
        PATH             = "/usr/bin:/usr/local/bin:/usr/sbin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "=========================================================="
                echo "Stage 1: Checkout Source Code"
                echo "Environment Target : ${params.ENVIRONMENT}"
                echo "Backend Target Port: ${params.SERVER_PORT}"
                echo "Docker Registry    : ${params.DOCKER_REGISTRY}"
                echo "=========================================================="
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo "=========================================================="
                echo "Stage 2: Compile & Test (Backend + Frontend)"
                echo "=========================================================="
                
                // 1. Build and test Java Spring Boot backend
                dir('backend') {
                    script {
                        if (params.RUN_TESTS) {
                            echo "Running Maven clean test (22 unit & integration tests)..."
                            sh 'mvn clean test'
                        } else {
                            echo "Skipping tests as per parameter selection..."
                            sh 'mvn clean compile'
                        }
                    }
                }

                // 2. Build React frontend
                dir('frontend') {
                    echo "Installing frontend dependencies and building production assets..."
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Package') {
            steps {
                echo "=========================================================="
                echo "Stage 3: Package Application Artifacts"
                echo "=========================================================="
                
                dir('backend') {
                    echo "Packaging executable JAR with embedded Tomcat server..."
                    sh 'mvn package -DskipTests=true'
                }

                // Archive the generated build artifacts
                archiveArtifacts artifacts: 'backend/target/*.jar, frontend/dist/**', fingerprint: true, allowEmptyArchive: false
                
                // Record JUnit test results if tests were executed
                junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
            }
        }

        stage('Selenium E2E Tests') {
            when {
                expression { return params.RUN_SELENIUM_TESTS }
            }
            steps {
                echo "=========================================================="
                echo "Stage 4: Automated Selenium E2E Tests & Quality Gate"
                echo "=========================================================="
                
                script {
                    echo "Checking health of application targets (Backend: 8090, Frontend: 5173)..."
                    sh '''
                        # Ensure backend is running
                        if ! curl -s http://localhost:8090/api/auth/health > /dev/null 2>&1; then
                            echo "Launching backend Spring Boot application on port 8090..."
                            nohup java -jar backend/target/${JAR_NAME} --server.port=8090 > backend_e2e.log 2>&1 &
                            sleep 14
                        fi

                        # Ensure frontend is running
                        if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
                            echo "Serving frontend production assets on port 5173..."
                            nohup npx -y serve -s frontend/dist -l 5173 > frontend_e2e.log 2>&1 &
                            sleep 4
                        fi
                    '''

                    echo "Executing Selenium WebDriver test suite with Maven..."
                    dir('selenium-tests') {
                        sh 'mvn clean test -Dapp.url=http://localhost:5173'
                    }
                }
            }
            post {
                always {
                    echo "Publishing Selenium E2E test reports and archiving screenshots..."
                    junit testResults: 'selenium-tests/target/surefire-reports/*.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'selenium-tests/screenshots/*.png', allowEmptyArchive: true
                }
                failure {
                    echo "❌ Quality Gate Triggered: Selenium test suite encountered failures! Halting pipeline and blocking deployment."
                }
            }
        }

        stage('Docker Build & Version') {
            steps {
                echo "=========================================================="
                echo "Stage 5: Build Versioned Docker Image"
                echo "Versioned Image : ${env.VERSIONED_IMAGE}"
                echo "Latest Image    : ${env.LATEST_IMAGE}"
                echo "=========================================================="
                sh """
                    docker build -t "${env.VERSIONED_IMAGE}" -t "${env.LATEST_IMAGE}" .
                    echo "Docker image built successfully with version tag: ${env.VERSION_TAG}"
                    docker images "${env.IMAGE_REPO}"
                """
            }
        }

        stage('Publish to Registry') {
            steps {
                echo "=========================================================="
                echo "Stage 6: Publish Image to Docker Registry"
                echo "Registry Target: ${params.DOCKER_REGISTRY}"
                echo "=========================================================="
                sh """
                    echo "Pushing versioned image: ${env.VERSIONED_IMAGE}..."
                    docker push "${env.VERSIONED_IMAGE}"
                    docker push "${env.LATEST_IMAGE}"

                    # Capture registry verification evidence
                    mkdir -p docker-evidence
                    echo "Querying Docker registry catalog at http://${params.DOCKER_REGISTRY}/v2/_catalog..."
                    curl -s "http://${params.DOCKER_REGISTRY}/v2/_catalog" > docker-evidence/registry-catalog.json
                    curl -s "http://${params.DOCKER_REGISTRY}/v2/fleet-maintenance-system/tags/list" > docker-evidence/registry-tags.json

                    echo "=== Registry Catalog Evidence ==="
                    cat docker-evidence/registry-catalog.json
                    echo ""
                    echo "=== Registry Tag List Evidence ==="
                    cat docker-evidence/registry-tags.json
                    echo ""
                """
                archiveArtifacts artifacts: 'docker-evidence/*.json', allowEmptyArchive: true
            }
        }

        stage('Deploy Container') {
            steps {
                echo "=========================================================="
                echo "Stage 7: Continuous Container Deployment"
                echo "Deploying fresh container: ${params.CONTAINER_NAME} on port ${params.CONTAINER_PORT}"
                echo "Target Environment       : ${params.ENVIRONMENT}"
                echo "=========================================================="
                sh """
                    # 1. Pull the fresh versioned image from registry
                    echo "Pulling verified image: ${env.VERSIONED_IMAGE}..."
                    docker pull "${env.VERSIONED_IMAGE}"

                    # 2. Free target port and clean up previous container instances
                    if docker ps -a --format '{{.Names}}' | grep -Eq "^(${params.CONTAINER_NAME}|fleet-app)\$"; then
                        echo "Cleaning up prior container instance to avoid port collisions..."
                        docker stop "${params.CONTAINER_NAME}" fleet-app 2>/dev/null || true
                        docker rm -f "${params.CONTAINER_NAME}" fleet-app 2>/dev/null || true
                    fi

                    # 3. Spin up fresh container
                    echo "Launching fresh application container: ${params.CONTAINER_NAME}..."
                    docker run -d \\
                        --name "${params.CONTAINER_NAME}" \\
                        -p "${params.CONTAINER_PORT}:8090" \\
                        --restart unless-stopped \\
                        -e SPRING_PROFILES_ACTIVE=dev \\
                        "${env.VERSIONED_IMAGE}"

                    # 4. Wait for container initialization and verify health
                    echo "Verifying container health on port ${params.CONTAINER_PORT}..."
                    sleep 12
                    HEALTH_OK=false
                    for i in 1 2 3 4 5; do
                        if curl -s -f "http://localhost:${params.CONTAINER_PORT}/api/auth/health" > /dev/null 2>&1; then
                            echo "✅ Fresh container health verified on port ${params.CONTAINER_PORT}!"
                            HEALTH_OK=true
                            break
                        fi
                        echo "Waiting for container startup (attempt \${i}/5)..."
                        sleep 4
                    done

                    if [ "\$HEALTH_OK" = "false" ]; then
                        echo "❌ Container failed health check on port ${params.CONTAINER_PORT}!"
                        docker logs --tail 40 "${params.CONTAINER_NAME}"
                        exit 1
                    fi

                    # 5. Record deployment record
                    mkdir -p "${env.DEPLOY_BASE}"
                    cat <<EOF > "${env.DEPLOY_BASE}/container-deployment.json"
{
  "application": "${env.APP_NAME}",
  "environment": "${params.ENVIRONMENT}",
  "deployment_type": "Docker Container Continuous Deployment",
  "container_name": "${params.CONTAINER_NAME}",
  "container_port": "${params.CONTAINER_PORT}",
  "image": "${env.VERSIONED_IMAGE}",
  "registry": "${params.DOCKER_REGISTRY}",
  "deployed_at": "\$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "build_number": "${env.BUILD_NUMBER}",
  "build_url": "${env.BUILD_URL}",
  "status": "HEALTHY"
}
EOF
                    echo "=== Deployment Metadata Recorded ==="
                    cat "${env.DEPLOY_BASE}/container-deployment.json"
                """
                archiveArtifacts artifacts: "deployments/${params.ENVIRONMENT}/container-deployment.json", allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed for build #${env.BUILD_NUMBER}."
            junit testResults: '**/surefire-reports/*.xml', allowEmptyResults: true
        }
        success {
            echo "✅ Continuous Deployment Succeeded! Deployed ${env.VERSIONED_IMAGE} to container ${params.CONTAINER_NAME}."
        }
        failure {
            echo "❌ Pipeline failed! Deployment was aborted due to stage failure or quality gate trigger."
            echo "Note: If docker permission denied, run: sudo usermod -aG docker jenkins && sudo systemctl restart jenkins"
        }
    }
}
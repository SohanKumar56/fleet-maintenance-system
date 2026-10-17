pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['development', 'staging', 'production'],
            description: 'Target deployment environment'
        )
        string(
            name: 'SERVER_PORT',
            defaultValue: '8090',
            description: 'Embedded Tomcat server port for the Spring Boot backend'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run automated JUnit unit and service tests before packaging'
        )
    }

    environment {
        APP_NAME     = 'fleet-maintenance-system'
        JAR_NAME     = 'fleet-maintenance-backend-0.0.1-SNAPSHOT.jar'
        DEPLOY_BASE  = "${WORKSPACE}/deployments/${params.ENVIRONMENT}"
        PATH         = "/usr/bin:/usr/local/bin:/usr/sbin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "=========================================================="
                echo "Stage 1: Checkout Source Code"
                echo "Environment Target : ${params.ENVIRONMENT}"
                echo "Backend Target Port: ${params.SERVER_PORT}"
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

        stage('Deploy') {
            steps {
                echo "=========================================================="
                echo "Stage 4: Server Deployment (Tomcat / Nginx)"
                echo "Deploying to target environment: ${params.ENVIRONMENT}"
                echo "=========================================================="
                
                sh """
                    # Create deployment directories
                    mkdir -p "${env.DEPLOY_BASE}/backend"
                    mkdir -p "${env.DEPLOY_BASE}/frontend"

                    # 1. Deploy Spring Boot JAR (Embedded Tomcat server)
                    cp backend/target/${env.JAR_NAME} "${env.DEPLOY_BASE}/backend/"

                    # 2. Deploy React production static bundle (Nginx web server target)
                    cp -r frontend/dist/* "${env.DEPLOY_BASE}/frontend/"

                    # 3. Generate deployment metadata and configuration record
                    cat <<EOF > "${env.DEPLOY_BASE}/deployment-info.json"
{
  "application": "${env.APP_NAME}",
  "environment": "${params.ENVIRONMENT}",
  "backend_server": "Apache Tomcat (Embedded Spring Boot)",
  "backend_port": "${params.SERVER_PORT}",
  "backend_artifact": "${env.JAR_NAME}",
  "frontend_server": "Nginx Web Server",
  "frontend_dist": "${env.DEPLOY_BASE}/frontend",
  "deployed_at": "\$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
  "build_number": "${env.BUILD_NUMBER}",
  "build_url": "${env.BUILD_URL}",
  "status": "SUCCESS"
}
EOF
                    echo "Deployment Artifacts verified at: ${env.DEPLOY_BASE}"
                    cat "${env.DEPLOY_BASE}/deployment-info.json"
                """
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed for build #${env.BUILD_NUMBER}."
        }
        success {
            echo "✅ Pipeline successfully built, packaged, and deployed ${env.APP_NAME} to ${params.ENVIRONMENT} on port ${params.SERVER_PORT}."
        }
        failure {
            echo "❌ Pipeline failed! Check the console logs for step failure details."
        }
    }
}
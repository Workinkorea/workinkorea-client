// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "workinkorea-client"
        PORT = 3001

        TRAEFIK_BASIC_AUTH_USERS = credentials('traefik-basic-auth-users')
        NEXT_PUBLIC_API_URL = credentials('next-public-api-url')
    }

    stages {
        stage("Docker build") {
            // 기존 docker 중지 및 삭제
            steps {
                echo "Building.."
                script{
                    sh """
                    docker stop ${env.DOCKER_IMAGE_NAME} || true
                    docker rm ${env.DOCKER_IMAGE_NAME} || true
                    docker rmi ${env.DOCKER_IMAGE_NAME} || true
                    """

                    sh """
                    docker build \
                      --build-arg NEXT_PUBLIC_API_URL=${env.NEXT_PUBLIC_API_URL} \
                      -t ${env.DOCKER_IMAGE_NAME} .
                    """
                }
                echo "Docker build finished"
            }
        }
        stage("Test") {
            // 테스트 코드 실행
            steps {
                echo "Testing.."
                // 테스트 코드 추가 예정
                echo "Test finished"
            }
        }
        stage("Deploy") {
            // 배포
            steps {
                echo "Deploying...."
                script {
                    sh """
                        docker run -d \
                        --name workinkorea-client \
                        --network core_network \
                        --label 'traefik.enable=true' \
                        --label 'traefik.http.routers.workinkorea-client.rule=Host(`wik.byeong98.xyz`)' \
                        --label 'traefik.http.routers.workinkorea-client.entrypoints=websecure' \
                        --label 'traefik.http.routers.workinkorea-client.tls.certresolver=le' \
                        --label 'traefik.http.services.workinkorea-client.loadbalancer.server.port=${env.PORT}' \
                        --label 'traefik.http.routers.workinkorea-client.middlewares=client-auth@docker' \
                        --label 'traefik.http.middlewares.client-auth.basicauth.users=${env.TRAEFIK_BASIC_AUTH_USERS}' \
                        ${env.DOCKER_IMAGE_NAME}
                        """
                }
                echo "Deploy finished"
            }
        }
    }
}
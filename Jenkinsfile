// Jenkinsfile
pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "workinkorea-client"
        BASE_URL = "byeong98.xyz"
        PORT = 3000

        TRAEFIK_BASIC_AUTH_USERS = credentials('traefik-basic-auth-users')
        NEXT_PUBLIC_API_URL = credentials('next-public-api-url')
        DISCORD_WEBHOOK_URL = credentials('discord-webhook-url')
    }

    stages {
        stage("Docker container check"){
            steps{
                echo "Docker container check..."
                script{ 
                    def blueRunning = sh(
                        script: "docker ps -q -f name=${env.DOCKER_IMAGE_NAME}-blue",
                        returnStdout: true
                    ).trim()

                    def greenRunning = sh(
                        script: "docker ps -q -f name=${env.DOCKER_IMAGE_NAME}-green",
                        returnStdout: true
                    ).trim()

                    if(blueRunning){
                        env.COLOR = "blue"
                        env.NEW_COLOR = "green"
                    } else if(greenRunning){
                        env.COLOR = "green"
                        env.NEW_COLOR = "blue"
                    } else {
                        env.COLOR = "none"
                        env.NEW_COLOR = "blue"
                    }
                }
                echo "COLOR: ${env.COLOR}, NEW_COLOR: ${env.NEW_COLOR}"
            }
        }

        stage("Docker build") {
            // docker image build
            steps {
                echo "Building.."
                script{
                    def blueRunning = sh(
                        script: "docker ps -q -f 'name=workinkorea-server-blue'",
                        returnStdout: true
                    ).trim()

                    def greenRunning = sh(
                        script: "docker ps -q -f 'name=workinkorea-server-green'",
                        returnStdout: true
                    ).trim()

                    if (blueRunning) {
                        env.SERVER_COLOR = "blue"
                    } else if (greenRunning) {
                        env.SERVER_COLOR = "green"
                    } else {
                        // 서버가 없는 경우
                        env.SERVER_COLOR = "blue"
                    }
                    
                    echo "SERVER_COLOR: ${env.SERVER_COLOR}"

                    sleep 5
                    
                    sh '''
                    docker build \
                      --build-arg NEXT_PUBLIC_API_URL=''' + env.NEXT_PUBLIC_API_URL + ''' \
                      -t ''' + env.DOCKER_IMAGE_NAME + '''-''' + env.NEW_COLOR + ''' .
                    '''
                }
                echo "Docker build finished"
            }
        }
        
        stage("Docker run") {
            // 배포
            steps {
                echo "Docker run..."
                script {
                    sh """
                        docker run -d \
                        --name ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} \
                        --network core_network \
                        --label 'traefik.enable=false' \
                        --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.rule=Host(`wik.${env.BASE_URL}`)' \
                        --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.entrypoints=websecure' \
                        --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.tls.certresolver=le' \
                        --label 'traefik.http.services.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.loadbalancer.server.port=${env.PORT}' \
                        --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.middlewares=client-auth@docker' \
                        --label 'traefik.http.middlewares.client-auth.basicauth.users=${env.TRAEFIK_BASIC_AUTH_USERS}' \
                        ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}
                        """
                }
                echo "Docker run finished"
            }
        }

        stage("Health check and traefik switch") {
            steps{
                echo "Health check and traefik switch..."
                script{
                    def healthCheck = sh(
                            script: "docker inspect -f '{{.State.Running}}' ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}",
                            returnStdout: true
                        ).trim()
                    
                    if (healthCheck == "true"){
                        sh """
                            docker stop ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} || true
                            docker rm ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} || true
                            docker run -d \
                            --name ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} \
                            --network core_network \
                            --label 'traefik.enable=true' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.rule=Host(`wik.${env.BASE_URL}`)' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.entrypoints=websecure' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.tls.certresolver=le' \
                            --label 'traefik.http.services.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.loadbalancer.server.port=${env.PORT}' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}.middlewares=client-auth@docker' \
                            --label 'traefik.http.middlewares.client-auth.basicauth.users=${env.TRAEFIK_BASIC_AUTH_USERS}' \
                            ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}
                            """
                    } else {
                        error("Health check failed. Container is not running : ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}")
                    }
                    
                    sleep 5

                    if (env.COLOR != "none") {
                        sh "docker stop ${env.DOCKER_IMAGE_NAME}-${env.COLOR}"
                    }
                }
                echo "Health check and traefik switch finished"
            }
        }

        stage("Traefik test"){
            steps{
                echo "Traefik test..."
                script{
                    def traefikTest = sh(
                        script: """docker run --rm --network core_network curlimages/curl:latest \
                            curl -s -o /dev/null -w '%{http_code}' -H 'Host: wik.${env.BASE_URL}' \
                            http://${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}:${env.PORT}""",
                        returnStdout: true
                    ).trim()
                    
                    echo "Traefik test passed. HTTP Status: ${traefikTest}"
                    if (traefikTest != "200") {
                        error("Traefik test failed. HTTP Status: ${traefikTest}")
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // GitHub Checks 발행
                def checkStatus = currentBuild.result ?: 'SUCCESS'
                def checkConclusion = checkStatus == 'SUCCESS' ? 'SUCCESS' : 'FAILURE'
                
                publishChecks(
                    name: 'Workinkorea Client Deployment',
                    title: 'Docker Build & Deployment Check',
                    summary: "Deployment ${checkConclusion} for ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}",
                    text: """
                        ## Deployment Details
                        - **Container**: ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR}
                        - **Status**: ${checkConclusion}
                        - **Build Number**: ${env.BUILD_NUMBER}
                        - **Branch**: ${env.BRANCH_NAME ?: 'N/A'}
                        
                        ### Stages Completed
                        - Docker Container Check
                        - Docker Build
                        - Docker Run
                        - Health Check & Traefik Switch
                        - Traefik Test
                    """,
                    conclusion: checkConclusion,
                    detailsURL: "${env.BUILD_URL}"
                )
            }
        }
        
        success {
            echo "Deployment successful"
            script{
                if (env.COLOR != "none") {
                    sh """
                        docker stop ${env.DOCKER_IMAGE_NAME}-${env.COLOR} || true
                        docker rm ${env.DOCKER_IMAGE_NAME}-${env.COLOR} || true
                        docker rmi ${env.DOCKER_IMAGE_NAME}-${env.COLOR} || true
                    """
                }
            }
            discordSend description: "${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} deployed successfully",
                  title: "Success : Workinkorea-Client", 
                  webhookURL: "${env.DISCORD_WEBHOOK_URL}",
                  result: currentBuild.currentResult
            echo "old container : ${env.DOCKER_IMAGE_NAME}-${env.COLOR} stopped"
        }

        failure {
            echo "Deployment failed"
            script{
                try {
                    sh """
                        docker stop ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} || true
                        docker rm ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} || true
                        docker rmi ${env.DOCKER_IMAGE_NAME}-${env.NEW_COLOR} || true
                    """
                    sleep 5

                    if (env.COLOR != "none") {
                        sh """
                            docker run -d \
                            --name ${env.DOCKER_IMAGE_NAME}-${env.COLOR} \
                            --network core_network \
                            --label 'traefik.enable=true' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.COLOR}.rule=Host(`wik.${env.BASE_URL}`)' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.COLOR}.entrypoints=websecure' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.COLOR}.tls.certresolver=le' \
                            --label 'traefik.http.services.${env.DOCKER_IMAGE_NAME}-${env.COLOR}.loadbalancer.server.port=${env.PORT}' \
                            --label 'traefik.http.routers.${env.DOCKER_IMAGE_NAME}-${env.COLOR}.middlewares=client-auth@docker' \
                            --label 'traefik.http.middlewares.client-auth.basicauth.users=${env.TRAEFIK_BASIC_AUTH_USERS}' \
                            ${env.DOCKER_IMAGE_NAME}-${env.COLOR}
                        """
                        echo "Rollback ${env.DOCKER_IMAGE_NAME}-${env.COLOR} completed"
                    } else {
                        echo "No previous container to rollback"
                    }
                } catch (Exception e) {
                    echo "Rollback failed: ${e.message}"
                }
            }
            // Discord 알림은 항상 전송
            discordSend description: "Deployment failed. ${env.COLOR != 'none' ? 'Rollback attempted' : 'No rollback needed'}",
                  title: "Failure : Workinkorea-Client",
                  webhookURL: "${env.DISCORD_WEBHOOK_URL}",
                  result: currentBuild.currentResult
        }
    }
}
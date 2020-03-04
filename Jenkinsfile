#!groovy
pipeline {
    agent {
        label 'master' 
    }
    
    environment {
        APP_NAME="matsumoto-front"
        NAMESPACE="dev"
        GIT_URL="git@github.com:happy-travel/${APP_NAME}.git"
        GIT_CRED_ID='github'
        GIT_BRANCH="master"
        URL_REGISTRY="registry.dev.happytravel.com"
        IMAGE_NAME="${APP_NAME}:${NAMESPACE}"
        IDENTITY_URL = 'https://identity.dev.happytravel.com/'
        EDO_URL = 'https://edo-api.dev.happytravel.com/'
        SENTRY_DSN = 'https://21e4194b435946e0b2e20444d6948d25@sentry.dev.happytravel.com/4'
        DISCORD_WEBHOOK_URL=credentials('discord')
    }
    
    stages {
        stage("Checkout") {
            steps {
                git branch: "${GIT_BRANCH}", credentialsId: "${GIT_CRED_ID}", url: "${GIT_URL}"
            }
        }
        stage("Force login at docker registry") {
            steps {
                sh 'docker login https://$URL_REGISTRY -u username -p password'
            }
        }
        stage('Build docker image') {
            steps {
                withCredentials([string(credentialsId: 'VAULT_TOKEN', variable: 'VAULT_TOKEN')]) {
                    sh 'docker build -t $URL_REGISTRY/$IMAGE_NAME-$BUILD_NUMBER --build-arg "IDENTITY_URL=$IDENTITY_URL" --build-arg "EDO_URL=$EDO_URL" --build-arg "SENTRY_DSN=$SENTRY_DSN" --build-arg "BUILD_VERSION=$(git rev-parse --short HEAD)" . --no-cache'
                }
            }
        }
        stage('Push docker image to repository') {
            steps {
                sh 'docker push $URL_REGISTRY/$IMAGE_NAME-$BUILD_NUMBER'
                sh 'docker tag $URL_REGISTRY/$IMAGE_NAME-$BUILD_NUMBER $URL_REGISTRY/$IMAGE_NAME-latest'
                sh 'docker push $URL_REGISTRY/$IMAGE_NAME-latest'                
            }
        }
        stage('Deploy to k8s') {
            steps {
                dir('Helm') {
                    withCredentials([file(credentialsId: 'k8s', variable: 'k8s_cred')]) {
                        sh './setRevision.sh $BUILD_NUMBER'
                        sh 'helm --kubeconfig /$k8s_cred upgrade --install $NAMESPACE-$APP_NAME -f values_dev.yaml --wait --namespace $NAMESPACE ./'
                    }
                }
            }
        }  

    }

    post {
        always {
            echo "I AM ALWAYS first"
            notifyBuild("${currentBuild.currentResult}")
        }
        aborted {
            echo "BUILD ABORTED"
        }
        success {
            echo "BUILD SUCCESS"
            echo "Keep Current Build If branch is master"
        }
        unstable {
            echo "BUILD UNSTABLE"
        }
        failure {
            echo "BUILD FAILURE"
        }
    }
}
def getCurrentBranch () {
    return sh (
            script: 'git rev-parse --abbrev-ref HEAD',
            returnStdout: true
    ).trim()
}
def getShortCommitHash() {
    return sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
}
def getChangeAuthorName() {
    return sh(returnStdout: true, script: "git show -s --pretty=%an").trim()
}
def getChangeAuthorEmail() {
    return sh(returnStdout: true, script: "git show -s --pretty=%ae").trim()
}

def getChangeLog() {
    return sh(returnStdout: true, script: "git log -3 --date=short --pretty=format:'%ad %aN <%ae> %n%x09* %s%n'").trim()
}

def notifyBuild(String buildStatus = 'STARTED') {
    buildStatus = buildStatus ?: 'SUCCESS'

    def branchName = getCurrentBranch()
    def shortCommitHash = getShortCommitHash()
    def changeAuthorName = getChangeAuthorName()
    def changeAuthorEmail = getChangeAuthorEmail()
    def changeLog = getChangeLog()

    // Default values
    def subject = "${buildStatus}: '${env.JOB_NAME} [${env.BUILD_NUMBER}]'" + branchName + ", " + shortCommitHash
    def summary = "__**Build Number:**__ ${env.BUILD_NUMBER} " +
        "\n __**Build URL:**__ ${env.BUILD_URL} " +
        "\n __**Commit:**__ " + branchName + " " + shortCommitHash + 
        "\n __**Author:**__ " + changeAuthorName + " (" + changeAuthorEmail + ")" + 
        "\n \n __**ChangeLog:**__ " + " \n " + changeLog
        
    // Send message
    discordSend webhookURL: env.DISCORD_WEBHOOK_URL,
    description: summary,
    result: currentBuild.currentResult,
    footer: currentBuild.currentResult,
    link: env.BUILD_URL,
    title: 'Started: '+JOB_NAME+' env: '+env.NAMESPACE,
    thumbnail: 'https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2019/Jun/06/3563382950-5-matsumoto-front-logo_avatar.png'
    
    if (buildStatus == 'FAILURE') {
        emailext attachLog: true, body: summary, compressLog: true, recipientProviders: [brokenTestsSuspects(), brokenBuildSuspects(), culprits()], subject: subject, to: changeAuthorEmail
    }    
}
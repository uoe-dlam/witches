#!/usr/bin/env groovy

pipeline {
     agent {
        docker {
            image 'node:20-alpine'
            args '-p 3000:3000'
        }
    }

    environment {
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Build') {
           steps {
               echo 'Starting Build ...'
               sh 'npm install'
               sh 'npm run generate'
               echo 'Build finished'
           }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying ...'
            }
        }
    }
}
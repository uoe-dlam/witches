#!/usr/bin/env groovy

pipeline {
     agent {
        docker {
            image 'node:6-alpine'
            args '-p 3000:3000'
        }
    }

    environment {
        CI = 'true'
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Build') {
           steps {
               echo 'Starting Build ...'
               sh 'chmod -R 777 /'
               sh 'npm install nuxt'
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
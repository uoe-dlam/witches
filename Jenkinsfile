#!/usr/bin/env groovy

pipeline {
    agent any

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Build') {
           steps {
               echo 'Starting Build ...'
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
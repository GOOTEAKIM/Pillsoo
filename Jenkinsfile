pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins/agent-type: kaniko
  namespace: jenkins
spec:
  containers:
    - name: kaniko
      image: gcr.io/kaniko-project/executor:debug
      command:
        - /busybox/cat
      tty: true
      volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker/
  volumes:
    - name: docker-config
      secret:
        secretName: docker-config
            """
        }
    }

    environment {
        DOCKERHUB_USERNAME = "slowcloud"
    }

    stages {
        stage("Build Docker Image & Push to Docker Hub") {
            steps {
                container("kaniko") {
                    script {
                        def dockerImages = [
                            [imagename: "pillsoo-spring", context: "./PillSoo"],
                            [imagename: "pillsoo-python", context: "./GT/Pillsoo"]
                        ]
                        for (dockerImage in dockerImages) {
                          def dockerfile = "Dockerfile"
                          def context = dockerImage.context
                          def image = "${DOCKERHUB_USERNAME}/${dockerImage.image}:latest"
                          sh "/kaniko/executor --context ${context} --dockerfile ${dockerfile} --destination ${image}"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo "The process is completed."
        }
    }
}

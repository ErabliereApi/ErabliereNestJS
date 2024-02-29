# LearnNestJS

A repos I used to learn NestJS.

Videos:

- Fireship: https://www.youtube.com/watch?v=0M8AYU_hPas
- Acedemind https://www.youtube.com/watch?v=F_oOtaxb0L8

## Install and generate a project

```
npm install -g @nestjs/cli
nest new project-name
```

Run the project

```
cd project-name
npm run start:dev
```

### Run postman test

```
newman run .\LearnNestJS.postman_collection.json
```

## Docker

### ```docker build -t nestjsapi .```

### ```docker run -d -p 3000:3000 nestjsapi```

## Kubernetes

### ```kubectl create namespace crudapp```

### ```kubectl apply -f .\k8s\deployment.yaml -n crudapp```

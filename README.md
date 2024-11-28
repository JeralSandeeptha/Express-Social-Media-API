to use docker image for the development purpose...

(01.) We should use the start script correctly.
"dev": "nodemon -L src/index.js"

(02.) We should use docker volumes. fist one is for the node_modules and the second one is for the application.
docker run --name api -p 5050:5050 -e PORT=5050 -v "D:/Nodejs Projects/Express-Social-Media-API:/app" -v /app/node_modules api

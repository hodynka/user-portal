############ CI steps ############
npm run start

docker build -t user-portal .

docker run -p 3000:3000 user-portal .
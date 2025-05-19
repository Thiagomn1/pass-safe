# Password Manager API

This is a FullStack application that generates secure passwords for the requested sites, encrypts them and saves them to your personal account

# How to run

## Frontend

1. Navigate to the frontend folder with `cd password-manager-frontend`
   
2. Install dependencies with `npm install`

3. Run the project with `npm run dev`, the application is now running on `http://localhost:5173`

## Backend

1. Create the docker container for the MongoDB Database by running `docker-compose up -d` (The default user and password for the database is admin)

3. Install the project dependencies with `npm install`

4. Create a .env with the required variables:

```
MONGO_URI="mongodb://admin:admin@localhost:27017"
Note: update the username and password accordingly if changed in the docker compose)
JWT_SECRET= Can be any value, or generate one in https://jwtsecret.com/generate
ENCRYPTION_SECRET= Must be a 32 bit value
```

5. Run the project with `npm run dev`

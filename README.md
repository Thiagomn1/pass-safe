# PassSafe

This is a FullStack application that generates secure passwords for the requested sites, encrypts them and saves them to your personal account

# Setup

## Frontend

1. Navigate to the frontend folder with `cd frontend`
   
2. Install dependencies with `npm install`

## Backend

1. Navigate to the backgend folder with `cd api`
  
2. Create the docker container for the MongoDB Database by running `docker-compose up -d` (The default user and password for the database is admin)

3. Install the project dependencies with `npm install`

4. Create a .env with the required variables:

```
MONGO_URI="mongodb://admin:admin@localhost:27017"
# Update the username and password accordingly if changed in the docker compose)
JWT_SECRET=your_jwt_secret_here
# Can be any string. Generate one at: https://jwtsecret.com/generate
ENCRYPTION_SECRET=your_64_char_hex_secret_here
# Must be a 64-character hexadecimal string (i.e., 32 bytes).
# You can generate one using the following Node.js command:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running the Project


1. In the root folder run `npm install`
2. Start the project with `npm run dev`

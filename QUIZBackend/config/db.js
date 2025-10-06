// src/config/db.js
/********************************
 * for database setup
 * comments added before each function
 * date -started 10 dec
 * auther -Siddheshwar Ghuge
 * 
 * 
 */

const mongoose = require('mongoose');

//path module is incredibly useful for managing file system paths, ensuring they are constructed correctly, and maintaining cross-platform compatibility.
const path = require('path');


// loads environment variables from a .env file into process.env. It helps manage sensitive information like database URLs or API keys securely.
const dotenv = require('dotenv');
// Explicitly load .env file from the 'cabManagmentBackend' directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });


//This line loads environment variables defined in the .env file. Once this is called, you can access environment variables using process.env.<VARIABLE_NAME>.


// console.log("Mongo URI:", process.env.MONGO_URI); // Log the URI to check if it's being read correctly


async function connectDB() {
    try { //attempt tp connect with mongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure,This prevents your application from running in a broken state.
    }
}

module.exports = connectDB;

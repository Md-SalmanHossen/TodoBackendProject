

### 1. **Imports and Setup**

#### Keywords and Concepts
- **`require`**: This function is used to import modules in Node.js.
- **`express`**: A web framework for Node.js, used to build web applications.
- **`mongoose`**: An ODM (Object Data Modeling) library for MongoDB and Node.js, simplifying the interaction with MongoDB.
- **`jwt`**: Short for JSON Web Token, used for securely transmitting information between parties as a JSON object.
- **`dotenv`**: A module that loads environment variables from a `.env` file into `process.env`.

#### Code Explanation
```javascript
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
```
- Here, you import the necessary modules and configure dotenv to load environment variables.

### 2. **MongoDB Connection**

#### Keywords and Concepts
- **`mongoose.connect()`**: Establishes a connection to the MongoDB database.
- **`process.env`**: An object that contains environment variables.
- **`async/await`**: Syntax for handling asynchronous operations in JavaScript.

#### Code Explanation
```javascript
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
```
- You connect to the MongoDB database using a connection URI stored in an environment variable. Upon successful connection, a success message is logged, otherwise, an error message is printed.

### 3. **Defining the Data Schema**

#### Keywords and Concepts
- **`mongoose.Schema`**: A constructor for defining the schema structure of a document in MongoDB.
- **`new`**: Used to create an instance of an object.

#### Code Explanation
```javascript
const ProfileSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  EmailAddress: { type: String, required: true },
  MobileNumber: { type: String, required: true },
  City: { type: String, required: true },
});
```
- Here, you define a schema for user profiles, specifying the fields and their types, as well as indicating which fields are required.

### 4. **Creating the Model**

#### Keywords and Concepts
- **`mongoose.model()`**: Creates a model based on the defined schema.

#### Code Explanation
```javascript
const ProfileModel = mongoose.model('Profile', ProfileSchema);
```
- You create a model named `Profile` that represents the `ProfileSchema`. This model will be used to interact with the `profiles` collection in MongoDB.

### 5. **Controllers**

These functions handle various user-related actions. Each controller corresponds to a specific operation like creating a profile, logging in, or updating a profile.

#### CreateProfile

##### Code Explanation
```javascript
const CreateProfile = async (req, res) => {
  const reqBody = req.body;
  try {
    const profileData = await ProfileModel.create(reqBody);
    return res.status(200).json({ success: true, profileData });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
```
- **`async`**: Declares an asynchronous function.
- **`try/catch`**: Handles exceptions that may occur during the execution of the code.

- **Logic**:
  - Extracts the request body containing the profile data.
  - Attempts to create a new profile using `ProfileModel.create(reqBody)`.
  - If successful, it sends a response with status `200` (OK) and the created profile data.
  - If an error occurs, it catches the error and responds with status `400` (Bad Request) and the error message.

#### UserLogin

##### Code Explanation
```javascript
const UserLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await ProfileModel.findOne({ userName, password });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = jwt.sign({ data: userName }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
```
- **`jwt.sign()`**: Generates a new token with specified data and secret.
- **`if (!user)`**: Checks if the user exists.

- **Logic**:
  - Retrieves `userName` and `password` from the request body.
  - Searches for the user in the database using `findOne()`.
  - If no user is found, it responds with status `401` (Unauthorized) and an error message.
  - If found, it generates a JWT token and sends it back in the response.

#### SelectProfile

##### Code Explanation
```javascript
const SelectProfile = async (req, res) => {
  const { username } = req.user.data; // req.user contains data from JWT
  try {
    const profile = await ProfileModel.findOne({ userName: username });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
```
- **`req.user.data`**: Contains user data decoded from the JWT.

- **Logic**:
  - Extracts the username from the request's user data.
  - Searches for the profile in the database.
  - If found, it returns the profile data; otherwise, it responds with a 404 status.

#### UpdateProfile

##### Code Explanation
```javascript
const UpdateProfile = async (req, res) => {
  const username = req.user.data.userName; // Extract username from JWT
  const reqBody = req.body; // New profile data
  try {
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userName: username },
      reqBody,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.status(200).json({ success: true, updatedProfile });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
```
- **`findOneAndUpdate()`**: Finds a document and updates it in one operation.

- **Logic**:
  - Extracts the username from the JWT and new data from the request body.
  - Attempts to update the profile in the database.
  - Returns the updated profile or a 404 status if the user is not found.

### 6. **To-Do List Management**

Similar to profile management, you have controllers for handling to-do list operations. Here are some key functions:

#### CreateToDoList

##### Code Explanation
```javascript
const CreateToDoList = async (req, res) => {
  const reqBody = req.body; // Extract to-do data
  reqBody.status = 'Pending'; // Default status
  reqBody.createdAt = new Date(); // Set created date
  try {
    const todoData = await TodoModel.create(reqBody);
    return res.status(200).json({ success: true, todoData });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
```
- **`new Date()`**: Creates a new date object.

- **Logic**:
  - Sets the initial status and created date for the to-do item.
  - Attempts to create a new to-do item and returns it in the response.

#### SelectToDo

##### Code Explanation
```javascript
const SelectToDo = async (req, res) => {
  const username = req.user.data.userName; // Extract username
  try {
    const todos = await TodoModel.find({ userName: username });
    return res.status(200).json({ success: true, todos });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
```
- **`TodoModel.find()`**: Retrieves all matching documents.

- **Logic**:
  - Finds all to-do items for the logged-in user and returns them.

### 7. **JWT Authentication Middleware**

#### Keywords and Concepts
- **`middleware`**: Functions that execute during the request-response cycle, allowing you to modify the request or response.
- **`next()`**: Calls the next middleware function in the stack.

#### Code Explanation
```javascript
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']; // Retrieve token from headers
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res

.sendStatus(403); // Forbidden
    }
    req.user = user; // Save user data in request
    next(); // Move to the next middleware
  });
};
```
- **Logic**:
  - Checks for the JWT token in the request headers.
  - Verifies the token and extracts user information.
  - If verification fails, it sends a `403` status; otherwise, it proceeds to the next middleware.

### 8. **Routes Setup**

#### Keywords and Concepts
- **`app.use()`**: Mounts middleware functions.
- **`app.post()`, `app.get()`, etc.**: Define routes for handling specific HTTP requests.

#### Code Explanation
```javascript
const app = express();
app.use(express.json()); // Middleware to parse JSON

// User routes
app.post('/profile', CreateProfile);
app.post('/login', UserLogin);
app.get('/profile', authenticateJWT, SelectProfile);
app.put('/profile', authenticateJWT, UpdateProfile);

// ToDo routes
app.post('/todo', authenticateJWT, CreateToDoList);
app.get('/todo', authenticateJWT, SelectToDo);
```
- **Logic**:
  - Sets up routes for user profiles and to-do lists, specifying which HTTP method and controller function to use for each route.

### 9. **Starting the Server**

#### Keywords and Concepts
- **`app.listen()`**: Starts the server and listens for incoming requests on a specified port.

#### Code Explanation
```javascript
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```
- **Logic**:
  - Starts the server on the port specified in the environment variable and logs a message confirming the server is running.

### Conclusion

This code sets up a basic CRUD (Create, Read, Update, Delete) application using Node.js, Express, and MongoDB. The key concepts include:
- **Asynchronous programming** with `async/await` for handling database operations.
- **Middleware** for authentication using JWT.
- **Mongoose** for schema definition and interaction with MongoDB.


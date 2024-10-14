

### 1. **Dependencies & Model Imports**
```javascript
const TodoListModel = require('../models/TodoModel');
const TodoModel = require('../models/TodoModel');
```
- This imports the `TodoModel` from a separate file, which represents the MongoDB model for a to-do item. 
- `TodoListModel` and `TodoModel` appear to refer to the same model but use different variable names, which might be redundant.

---

### 2. **Create a New To-Do Item**
```javascript
exports.CreateToDoList = async (req, res) => {
  try {
    let reqBody = req.body;
    let ToDoSubject = reqBody.ToDoSubject;
    let ToDoDescription = reqBody.ToDoDescription;
    let UserName = req.headers.userName; 
    let ToDoStatus = 'New';
    let ToDoCreateDate = Date.now();
    let ToDoUpdateDate = Date.now();

    let PostBody = {
      UserName: UserName,
      ToDoSubject: ToDoSubject,
      ToDoDescription: ToDoDescription,
      ToDoStatus: ToDoStatus,
      ToDoCreateDate: ToDoCreateDate,
      ToDoUpdateDate: ToDoUpdateDate
    };

    const data = await TodoModel.create(PostBody);
    
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: err.message,
    });
  }
};
```
- **Purpose**: Creates a new to-do item with the provided subject, description, and user name.
- **Input**: Takes the subject and description from the request body, and user information from request headers.
- **Status**: Sets initial status as 'New'.
- **Response**: Returns the created item or an error if the creation fails.

---

### 3. **Fetch To-Do Items for a User**
```javascript
exports.SelectToDo = async (req, res) => {
  try {
    const data = await TodoModel.find({ UserName: UserName });

    if (data.length > 0) {
      res.status(200).json({ 
        status: "success",
        data 
      });
    } else {
      res.status(404).json({ 
        status: "fail", 
        message: "No to-do items found for this user" 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      status: "fail", 
      message: err.message 
    });
  }
};
```
- **Purpose**: Fetches all to-do items for a specific user.
- **Input**: Uses `UserName` from the request to filter the results.
- **Response**: Returns the list of to-do items if found, otherwise an error message.

---

### 4. **Update a To-Do Item**
```javascript
exports.UpdateToDo = async (req, res) => {
  try {
    let ToDoSubject = req.body.ToDoSubject;
    let ToDoDescription = req.body.ToDoDescription;
    let id = req.body._id;
    let ToDoUpdateDate = Date.now();

    let postBody = {
      ToDoSubject: ToDoSubject,
      ToDoDescription: ToDoDescription,
      ToDoUpdateDate: ToDoUpdateDate
    };

    let updateData = await TodoListModel.updateOne({ _id: id }, { $set: postBody });

    if (updateData.modifiedCount > 0) {
      res.status(200).json({
        status: "success",
        data: postBody 
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No to-do items found for this user or no changes made"
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};
```
- **Purpose**: Updates a to-do item’s subject and description.
- **Input**: Takes the updated details and item ID from the request body.
- **Response**: Returns success if the update was successful, otherwise a failure message.

---

### 5. **Update To-Do Status**
```javascript
exports.UpdateToDoStatus = async (req, res) => {
  try {
    let ToDoStatus = req.body.ToDoStatus;
    let id = req.body._id;
    let ToDoUpdateDate = Date.now();

    let postBody = {
      ToDoStatus: ToDoStatus,
      ToDoUpdateDate: ToDoUpdateDate
    };

    let updateData = await TodoListModel.updateOne({ _id: id }, { $set: postBody }, { upsert: true });

    if (updateData.modifiedCount > 0) {
      res.status(200).json({
        status: "success",
        data: postBody
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No to-do items found for this user or no changes made"
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};
```
- **Purpose**: Updates the status of a to-do item (e.g., from 'New' to 'Completed').
- **Input**: Accepts the status and item ID from the request body.
- **Response**: Sends success if the status is updated, otherwise a failure message.

---

### 6. **Remove a To-Do Item**
```javascript
exports.RemoveToDo = async (req, res) => {
  try {
    let id = req.body._id;

    let removeData = await TodoListModel.deleteOne({ _id: id });

    if (removeData.deletedCount > 0) {
      res.status(200).json({
        status: "success",
        message: "To-do item removed successfully"
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No to-do items found with the given ID"
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};
```
- **Purpose**: Deletes a to-do item by its ID.
- **Input**: Takes the item ID from the request body.
- **Response**: Returns success if the deletion was successful or a failure message if no matching item was found.

---

### 7. **Filter To-Do Items by Status**
```javascript
exports.FilterToDoByStatus = async (req, res) => {
  try {
    let UserName = req.body.UserName;
    let ToDoStatus = req.body.ToDoStatus;

    const data = await TodoModel.find({
      UserName: UserName,
      ToDoStatus: ToDoStatus
    });

    if (data.length > 0) {
      res.status(200).json({
        status: "success",
        data
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No to-do items found for this user with the specified status"
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};
```
- **Purpose**: Fetches to-do items for a user that match a specific status.
- **Input**: Requires `UserName` and `ToDoStatus` from the request body.
- **Response**: Returns matching items or a message if no items were found.

---

### 8. **Filter To-Do Items by Date**
```javascript
exports.FilterToDoByDate = async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const filteredTodos = await TodoModel.find({
      ToDoCreateDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      }
    });

    if (filteredTodos.length === 0) {
      return res.status(404).json({ message: "No todos found for the given date." });
    }

    res.json(filteredTodos);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```
- **Purpose**: Retrieves to-do items created on a specific date.
- **Input**: Takes a date from the request body.
- **Response**: Returns items created on that date or an error message if no items are found.

---

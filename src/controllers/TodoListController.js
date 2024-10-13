const TodoListModel = require('../models/TodoModel');
const TodoModel = require('../models/TodoModel');

exports.CreateToDoList = async (req, res) => {
  try {
    let reqBody = req.body;

    let ToDoSubject = reqBody.ToDoSubject;
    let ToDoDescription = reqBody.ToDoDescription;
    let UserName = req.headers.userName; // Ensure this matches the header key sent
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

    // Use TodoModel to create the new to-do item
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

//read todo
exports.SelectToDo = async (req, res) => {
  try {
    console.log('Fetching todos for User:', UserName); // Log UserName

    const data = await TodoModel.find({ 
      UserName: UserName 
    });

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
    console.error('Error in SelectToDo:', err);
    res.status(500).json({ 
      status: "fail", 
      message: err.message 
    });
  }
};


// update todo
exports.UpdateToDo = async (req, res) => {
  try {
    
    let ToDoSubject = req.body.ToDoSubject;
    let ToDoDescription = req.body.ToDoDescription;
    let id = req.body._id; // Use 'id' instead of '_id' for consistency
    let ToDoUpdateDate = Date.now(); // Set the update date

    let postBody = {
      ToDoSubject: ToDoSubject,
      ToDoDescription: ToDoDescription,
      ToDoUpdateDate: ToDoUpdateDate // Add this line to include the update date
    };

    // Use updateOne to update the document by ID
    let updateData = await TodoListModel.updateOne({ _id: id }, { $set: postBody });

    // Check if the update was successful
    if (updateData.modifiedCount > 0) {
      res.status(200).json({
        status: "success",
        data: postBody // Return the updated data
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No to-do items found for this user or no changes made"
      });
    }
  } catch (err) {
    console.error('Error in UpdateToDo:', err);
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};

// update status
exports.UpdateToDoStatus = async (req, res) => {
  try {

    let ToDoStatus = req.body.ToDoStatus;
    let id = req.body._id; // Use 'id' instead of '_id' for consistency
    let ToDoUpdateDate = Date.now(); // Set the update date

    let postBody = {
      ToDoStatus: ToDoStatus,
      ToDoUpdateDate: ToDoUpdateDate // Add this line to include the update date
    };

    // Use updateOne to update the document by ID
    let updateData = await TodoListModel.updateOne(
      { _id: id }, 
      { $set: postBody },
      {upsert:true}
    );

    // Check if the update was successful
    if (updateData.modifiedCount > 0) {
      res.status(200).json({
        status: "success",
        data: postBody // Return the updated data
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No to-do items found for this user or no changes made"
      });
    }
  } catch (err) {
    console.error('Error in UpdateToDo:', err);
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};


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

//select todo for read
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

//remove todo
exports.RemoveToDo = async (req, res) => {
  try {
    let id = req.body._id; // Get the ID of the todo to be removed

    // Use deleteOne to remove the document by ID
    let removeData = await TodoListModel.deleteOne({ _id: id });

    // Check if the deletion was successful
    if (removeData.deletedCount > 0) {
      res.status(200).json({
        status: "success",
        message: "To-do item removed successfully" // Optional success message
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No to-do items found with the given ID"
      });
    }
  } catch (err) {
    console.error('Error in RemoveToDo:', err);
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};


//SelectToDo for filter by status
exports.FilterToDoByStatus = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the entire request body

    let UserName = req.body.UserName;
    let ToDoStatus = req.body.ToDoStatus;

    console.log('UserName:', UserName); // Log extracted values
    console.log('ToDoStatus:', ToDoStatus);

    // Find todos for the specified user and status
    const data = await TodoModel.find({
      UserName: UserName,
      ToDoStatus: ToDoStatus
    });

    console.log('Found data:', data); // Log the found data

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
    console.error('Error in FilterToDoByStatus:', err);
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
};


//filter todo by date 


exports.FilterToDoByDate = async (req, res) => {
  const { date } = req.body; // Expecting a date in YYYY-MM-DD format

  // Validate the date format (optional but recommended)
  if (!date) {
      return res.status(400).json({ message: "Date is required" });
  }

  // Convert the date to a valid range for querying
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

  try {
     const filteredTodos = await TodoModel.find({
        ToDoCreateDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        }
     });
  

      // Check if any todos were found
      if (filteredTodos.length === 0) {
          return res.status(404).json({ message: "No todos found for the given date." });
      }

      res.json(filteredTodos);
  } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}




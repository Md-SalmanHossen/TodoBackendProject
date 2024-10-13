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
      TodDoDescription: ToDoDescription,
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

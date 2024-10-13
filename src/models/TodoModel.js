const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    UserName: {
      type: String,
    },
    ToDoSubject: {
      type: String,
    },
    ToDoDescription: {
      type: String,
    },
    ToDoStatus: {
      type: String,
    },
    ToDoCreateDate: {
      type: Date,
    },
    ToDoUpdateDate: {
      type: Date,
    },
  },
  { versionKey: false }
);

const TodoListModel = mongoose.model("List", DataSchema);
module.exports = TodoListModel;

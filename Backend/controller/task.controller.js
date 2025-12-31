const { eq } = require("drizzle-orm");
const db = require("../db");
const { TaskTable } = require("../model/task.model");
exports.getAllTask = async (req, res) => {
  try {
    const tasks = await db.select().from(TaskTable);

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("getAllTask error:", error);

    return res.status(500).json({
      message: "Failed to fetch Task",
    });
  }
};
exports.createTask = async (req, res) => {
  const { Date, Work } = req.body;
  if (Date == "" || !Date) {
    return res.status(400).json({ Message: "Date is missing or invalid" });
  } else if (!Work || Work == "") {
    return res.status(400).json({ Message: "Work is missing or invalid" });
  } else {
    const [result] = await db
      .insert(TaskTable)
      .values({ Work, Date })
      .returning({ id: TaskTable.id });
    return res.status(201).json({ Message: result.id });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await db
      .delete(TaskTable)
      .where(eq(TaskTable.id, id))
      .returning({ id: TaskTable.id });

    if (result.length === 0) {
      return res.status(404).json({ message: "Task Not Found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("deleteTaskById error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const { Work, Date } = body;
    console.log(body);
    const updatetask = {};
    if (Work !== undefined) {
      updatetask.Work = Work;
    }
    if (Date !== undefined) {
      updatetask.Date = Date;
    }
    if (Object.keys(updatetask).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }
    const result = await db
      .update(TaskTable)
      .set(updatetask)
      .where(eq(TaskTable.id, id))
      .returning({ id: TaskTable.id });
    if (result.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task updated successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("PATCH Task ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

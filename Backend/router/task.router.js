const express = require("express");
const controller = require("../controller/task.controller");
const router = express.Router();
router.get("/", controller.getAllTask);
router.post("/", controller.createTask);
router.delete("/:id", controller.deleteTask);
router.patch("/:id", controller.updateTask);
module.exports = router;

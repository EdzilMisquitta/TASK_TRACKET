import React, { useEffect, useState } from "react";
import "../Components/Task.css";
function Task() {
  /* ===============================
     STATE: ALL TASKS (MAIN DATA)
     =============================== */
  const [Tasks, SetTasks] = useState([
    {
      id: "342470e7-01de-438c-b976-93de5f7abbc0",
      Work: "Eat Food",
      Date: "2025-12-11",
    },
  ]);
  //READ OPERATION
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:8000/Tasks");
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      SetTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ===============================
     STATE: SINGLE TASK (FORM INPUT)
     =============================== */
  const [Task, SetTask] = useState({
    Work: "",
    Date: "",
  });

  /* ===============================
     HANDLER: FORM INPUT CHANGE
     Updates single Task object
     =============================== */
  function TaskHandler(e) {
    const { name, value } = e.target;

    // Dynamically update Work or Date
    SetTask((prevstate) => ({
      ...prevstate,
      [name]: value,
    }));
  }

  /* ===============================
     HANDLER: FORM SUBMIT
     Adds new task to Tasks array
     =============================== */
  async function SubmitHandler(e) {
    e.preventDefault();

    const { Work, Date } = Task;

    //CREATE OPERATION
    try {
      const response = await fetch("http://localhost:8000/Tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Work,
          Date,
        }),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      // Reset form
      SetTask({ Work: "", Date: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  }

  /* ===============================
     STATE: EDITING ID LIST
     Stores IDs of rows in edit mode
     =============================== */
  const [EditingID, setEditingID] = useState([]);

  /* ===============================
     HANDLER: START EDITING
     Adds ID to EditingID list
     =============================== */
  function EditingHandler(id) {
    setEditingID((prevstate) =>
      prevstate.includes(id) ? prevstate : [...prevstate, id]
    );
  }

  /* ===============================
     STATE: UPDATED TASKS
     Temporary edited values (per ID)
     =============================== */
  const [UpdatedTask, setUpdatedTask] = useState({});

  /* ===============================
     HANDLER: SAVE EDITED TASK
     Updates main Tasks state
     =============================== */
  async function SaveHandler(id) {
    let data = UpdatedTask[id];

    //UPDATE OPERATION
    try {
      const response = await fetch(`http://localhost:8000/Tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
    fetchTasks();

    // Remove saved task from UpdatedTask
    setUpdatedTask((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    // Remove ID from editing mode
    setEditingID((prev) => prev.filter((item) => item !== id));
  }

  /* ===============================
     HANDLER: UPDATE EDITED INPUT
     Stores edits per task ID
     =============================== */
  function UpdateTaskHandler(id, e) {
    const { value, name } = e.target;

    setUpdatedTask((prevstate) => ({
      ...prevstate,
      [id]: {
        ...prevstate[id],
        [name]: value,
        id: id,
      },
    }));
  }

  /* ===============================
     HANDLER: DELETE TASK
     Removes task from list
     =============================== */
  async function deletehandler(id) {
    //DELETE OPERATION
    try {
      const response = await fetch(`http://localhost:8000/Tasks/${id}`, {
        method: "DELETE",
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Delete failed");
      }

      //Remove task locally
      SetTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  /* ===============================
     UI RENDERING
     =============================== */
  return (
    <div>
      {/* --------- ADD TASK FORM --------- */}
      <form onSubmit={SubmitHandler} className="Form">
        <input
          type="text"
          placeholder="Enter Task"
          name="Work"
          value={Task.Work}
          onChange={TaskHandler}
          className="FormInput"
        />

        <input
          type="date"
          name="Date"
          value={Task.Date}
          onChange={TaskHandler}
          className="FormInput"
        />

        <button className="FormButton" type="submit">
          Submit
        </button>
      </form>

      {/* --------- TASK LIST --------- */}

      {Tasks.map((item) => (
        <div key={item.id} className="Task">
          {/* DATE FIELD */}
          {EditingID.includes(item.id) ? (
            <input
              type="date"
              defaultValue={item.Date}
              name="Date"
              onChange={(e) => UpdateTaskHandler(item.id, e)}
              className="EditInputbar"
            />
          ) : (
            <h2
              style={{
                color: "white",
                backgroundColor: "#0477BF",
                padding: "20px",
                borderRadius: "20px",
              }}
            >
              {item.Date}
            </h2>
          )}

          {/* WORK FIELD */}
          {EditingID.includes(item.id) ? (
            <input
              type="text"
              defaultValue={item.Work}
              name="Work"
              onChange={(e) => UpdateTaskHandler(item.id, e)}
              className="EditInputbar"
            />
          ) : (
            <h2
              style={{
                color: "white",
                backgroundColor: "#0477BF",
                padding: "20px",
                borderRadius: "20px",
              }}
            >
              {item.Work}
            </h2>
          )}

          {/* ACTION BUTTONS */}
          {EditingID.includes(item.id) ? (
            <button type="button" onClick={() => SaveHandler(item.id)}>
              Save
            </button>
          ) : (
            <button type="button" onClick={() => EditingHandler(item.id)}>
              Edit
            </button>
          )}

          <button type="button" onClick={() => deletehandler(item.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Task;

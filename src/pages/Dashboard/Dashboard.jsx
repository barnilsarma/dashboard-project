import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import axios from "axios";
import { Toaster, toast } from 'sonner';

const Dashboard = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigned, setAssigned] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState({}); // Ensure data starts as null
  const [admin, setAdmin] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/room/${id}`);

        if (response.data?.msg) {
          setData(response.data.msg);
          setAdmin(response.data.msg.admin?.email || ""); // Ensure admin email is always a string
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    toast.promise(fetchData(), {
      loading: "Loading Dashboard Details!!",
      success: "Completed!!",
      error: "Error in loading Dashboard Details!!"
    });
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!taskTitle || !dueDate) {
      alert("Please enter task title and due date.");
      return;
    }
    console.log(taskTitle,dueDate,assigned,id);
    const formattedDueDate = new Date(dueDate).toISOString();
    const handlePost = async () => {
      const res=await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/task`, {
        name: taskTitle,
        due: formattedDueDate,
        status: "PENDING",
        assigned: assigned,
        roomId:id
      });
      setTaskTitle("");
      setDueDate("");
    };
    

    toast.promise(handlePost(), {
      loading: "Assigning Task!! Please wait...",
      success: "Task Assigned!!",
      error: "Error in assigning task. Please try again later!!"
    });
  };

  const updateTaskStatus = async (e, taskId) => {
    e.preventDefault();

    const handlePatch = async () => {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/task/${taskId}`, {
        status: "COMPLETED",
      });
    };

    toast.promise(handlePatch(), {
      loading: "Updating task status... Please wait!!",
      success: "Successfully updated task status!!",
      error: "Error in updating task status. Please try again!!"
    });
  };

  const deleteTask = async (e, taskId) => {
    e.preventDefault();

    const handleDelete = async () => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/task/${taskId}`);
    };

    toast.promise(handleDelete(), {
      loading: "Deleting Task... Please wait!!",
      success: "Task Deleted!!",
      error: "Error in deleting task!! Please try again..."
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    setLoggedIn(false);
  };

  return (
    <>
      {!localStorage.getItem("email") ? (
        <div className={styles.loginCont}>
          You need to login to view this page
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      ) : null}

      <div className={styles.dashboardContainer}>
        <h1 className={styles.title}>{data.name}</h1>

        {/* Task Input Form */}
        {
          admin===localStorage.getItem("email")?
          <div className={styles.taskForm}>
            <h2 className={styles.subTitle}>Assign a New Task</h2>
            <div className={styles.formControls}>
              <input
                type="text"
                placeholder="Assign person"
                value={assigned}
                onChange={(e) => setAssigned(e.target.value)}
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className={styles.inputField}
              />
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={styles.inputField}
              />
              <button onClick={addTask} className={styles.addButton}>Add Task</button>
            </div>
          </div>:null
        }
        {/* Task List */}
        {data?.tasks?.length > 0 ? (
          <div className={styles.taskList}>
            {data.tasks
              .filter(task => task.status === "PENDING")
              .map(task => (
                <div key={task.id} className={styles.taskCard}>
                  <div className={styles.taskContent}>
                    <h3 className={styles.taskTitle}>{task.name}</h3>
                    <p className={styles.taskDate}>Due Date: {task.due}</p>
                    <p className={task.status === "COMPLETED" ? styles.completed : styles.pending}>
                      Status: {task.status}
                    </p>
                    <div className={styles.taskActions}>
                      {task.status === "PENDING" && admin === localStorage.getItem("email") && (
                        <button
                          onClick={(e) => updateTaskStatus(e, task.id)}
                          className={styles.completeButton}>
                          Mark as Completed
                        </button>
                      )}
                      {admin === localStorage.getItem("email") && (
                        <button
                          onClick={(e) => deleteTask(e, task.id)}
                          className={styles.deleteButton}>
                          Delete Task
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </div>
      <Toaster />
    </>
  );
};

export default Dashboard;

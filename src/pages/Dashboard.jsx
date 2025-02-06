import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("internTasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("internTasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (taskTitle && dueDate) {
      setTasks([
        ...tasks,
        { id: Date.now(), title: taskTitle, dueDate, status: "Pending" },
      ]);
      setTaskTitle("");
      setDueDate("");
    } else {
      alert("Please enter task title and due date.");
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
    localStorage.setItem("internTasks",JSON.stringify(filteredTasks));
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Intern Task Dashboard</h1>
      
      {/* Task Input Form */}
      <div className={styles.taskForm}>
        <h2 className={styles.subTitle}>Assign a New Task</h2>
        <div className={styles.formControls}>
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.inputField}
          />
          <button onClick={addTask} className={styles.addButton}>Add Task</button>
        </div>
      </div>

      {/* Task List */}
      <div className={styles.taskList}>
        {tasks.map(task => (
          <div key={task.id} className={styles.taskCard}>
            <div className={styles.taskContent}>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <p className={styles.taskDate}>Due Date: {task.dueDate}</p>
              <p className={task.status === "Completed" ? styles.completed : styles.pending}>
                Status: {task.status}
              </p>
              <div className={styles.taskActions}>
                {task.status === "Pending" && (
                  <button
                    onClick={() => updateTaskStatus(task.id, "Completed")}
                    className={styles.completeButton}>
                    Mark as Completed
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className={styles.deleteButton}>
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

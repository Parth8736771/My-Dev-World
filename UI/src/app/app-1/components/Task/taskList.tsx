import React from "react";
import type { TASK } from "../../Modals/modals";
import TaskCard from "./taskCard";
import "./Task.css";

interface Props {
    tasks: TASK[];
    onTaskClick: (task: TASK) => void;
}
const taskList = ({ tasks, onTaskClick }: Props) => {
    return (
        <>
            <div className="row">
                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    <div className="task-grid">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={onTaskClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default taskList;

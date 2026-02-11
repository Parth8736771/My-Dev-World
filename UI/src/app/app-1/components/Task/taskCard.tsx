import React from "react";
import type { TASK } from "../../Modals/modals";

interface Props {
    task: TASK;
    onClick: (task: TASK) => void;
}

const taskCard = ({ task, onClick }: Props) => {
    return (
        <>
            {" "}
            <div className="project-card" onClick={() => onClick(task)}>
                <div className="card-header">
                    <h3>{task.name}</h3>
                    <span className="priority">{task.priority}</span>
                </div>

                <p className="description">{task.description}</p>

                <div className="card-footer">
                    <span className="tag">{task.tag}</span>
                    {/* <span className="task-count">
                        {} Tasks
                    </span> */}
                </div>
            </div>
        </>
    );
};

export default taskCard;

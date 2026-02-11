import React from "react";
import type { PROJECT } from "../../Modals/modals";

interface Props {
    project: PROJECT;
    onClick: (project: PROJECT) => void;
}

const projectCard = ({ project, onClick }: Props) => {
    return (
        <>
            <div className="project-card" onClick={() => onClick(project)}>
                <div className="card-header">
                    <h3>{project.name}</h3>
                    <span className="priority">P{project.priority}</span>
                </div>

                <p className="description">{project.description}</p>

                <div className="card-footer">
                    <span className="tag">{project.tag}</span>
                    <span className="task-count">
                        {project.tasks.length} Tasks
                    </span>
                </div>
            </div>
        </>
    );
};

export default projectCard;

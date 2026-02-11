import React from "react";
import type { WORKSPACE } from "../../Modals/modals";

interface WorkspaceModalProps {
    isOpen: boolean;
    workspace: WORKSPACE | null;
    onClose: () => void;
}

const workspaceModal: React.FC<WorkspaceModalProps> = ({
    isOpen,
    workspace,
    onClose,
}) => {
    if (!isOpen || !workspace) return null;

    return (
        <>
            {" "}
            <div className="modal-backdrop">
                <div className="modal-container">
                    <header className="modal-header">
                        TEST2
                        <h2>{workspace.name}</h2>
                        <button onClick={onClose}>✕</button>
                    </header>

                    <section className="modal-body">
                        <p>
                            <strong>Description:</strong>{" "}
                            {workspace.description}
                        </p>
                        <p>
                            <strong>Tag:</strong> {workspace.tag}
                        </p>
                        <p>
                            <strong>Priority:</strong> {workspace.priority}
                        </p>
                        <p>
                            <strong>Created:</strong>{" "}
                            {new Date(
                                workspace.createdDate,
                            ).toLocaleDateString()}
                        </p>

                        <hr />

                        <h3>Projects</h3>

                        {workspace.projects.length === 0 ? (
                            <p>No projects found.</p>
                        ) : (
                            <ul className="project-list">
                                {workspace.projects.map((project) => (
                                    <li
                                        key={project.id}
                                        className="project-item"
                                    >
                                        <div>
                                            <strong>{project.name}</strong>
                                            <p>{project.description}</p>
                                        </div>
                                        <span className="tag">
                                            {project.tag}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default workspaceModal;

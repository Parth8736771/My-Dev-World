import React from "react";
import type { WORKSPACE } from "../../Modals/modals";
interface Props {
    workspace: WORKSPACE;
    onClick: (workspace: WORKSPACE) => void;
}
const workspaceCard = ({ workspace, onClick }: Props) => {
    return (
        <>
            <div className="workspace-card" onClick={() => onClick(workspace)}>
                <div className="card-header">
                    <h3>{workspace.name}</h3>
                    <span className="priority">P{workspace.priority}</span>
                </div>
                .<p className="description">{workspace.description}</p>
                <div className="card-footer">
                    <span className="tag">{workspace.tag}</span>
                    <span className="project-count">
                        {workspace.projects.length} Projects
                    </span>
                </div>
            </div>
        </>
    );
};

export default workspaceCard;

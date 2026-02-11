import { useState } from "react";
import type { WORKSPACE } from "../../Modals/modals";
import "./workspace.css";
import WorkspaceCard from "./workspaceCard";

interface Props {
    workspaces: WORKSPACE[];
    onWorkspaceClick: (workspace: WORKSPACE) => void;
}

const workspaceList = ({ workspaces, onWorkspaceClick }: Props) => {
    // const [selectedWorkspace, setSelectedWorkspace] =
    //     useState<WORKSPACE | null>(null);

    return (
        <>
            <div className="row workspace-list">
                {workspaces.length === 0 ? (
                    <p>No workspaces available.</p>
                ) : (
                    <div className="workspace-grid">
                        {workspaces.map((ws) => (
                            <WorkspaceCard
                                key={ws.id}
                                workspace={ws}
                                onClick={onWorkspaceClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default workspaceList;

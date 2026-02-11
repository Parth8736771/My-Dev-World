import React from "react";
import type { PROJECT } from "../../Modals/modals";
import ProjectCard from "./projectCard";

interface Props {
    projects: PROJECT[];
    onProjectClick: (project: PROJECT) => void;
}

const projectList = ({ projects, onProjectClick }: Props) => {
    return (
        <>
            {/* <h2 className="component-title">Projects</h2>
            {projects.length === 0 ? (
                <p>No projects available.</p>
            ) : (
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>{project.name}</li>
                    ))}
                </ul>
            )} */}
            <div className="row">
                {projects.length === 0 ? (
                    <p>No projects available.</p>
                ) : (
                    <div className="project-grid">
                        {projects.map((prj) => (
                            <ProjectCard
                                key={prj.id}
                                project={prj}
                                onClick={onProjectClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default projectList;

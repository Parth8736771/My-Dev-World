import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import {
    MenuOption,
    type FormData,
    type PROJECT,
    type TASK,
    type WORKSPACE,
} from "../../Modals/modals";
import WorkspaceList from "../Workspace/workspaceList";
import { CreateAPIEndPoints, EndPointsName } from "../../Api/api";
import ProjectList from "../Project/projectList";
import TaskList from "../Task/taskList";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import "./dashboard.css";

const dashboard = () => {
    const [activeView, setActiveView] = useState<string>(MenuOption.WORKSPACE);
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] =
        useState<WORKSPACE | null>(null);
    const [selectedProject, setSelectedProject] = useState<PROJECT | null>(
        null,
    );
    const [selectedTask, setSelectedTask] = useState<TASK | null>(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [modal, setModal] = React.useState(false);
    const [formData, setFormData] = React.useState<FormData>({
        name: "",
        description: "",
        tag: "",
        categoryId: 1,
        priority: 1,
        workspaceId: 0,
        projectId: 0,
        taskLink: "",
    });

    useEffect(() => {
        fetchData();
    }, [activeView]);

    const navigate = useNavigate();

    const fetchData = () => {
        try {
            if (activeView === MenuOption.WORKSPACE) {
                CreateAPIEndPoints(EndPointsName.workspaces)
                    .fetchAll()
                    .then((response) => {
                        setWorkspaces(response.data);
                    });
            } else if (activeView === MenuOption.PROJECT) {
                CreateAPIEndPoints(EndPointsName.projects)
                    .fetchAll()
                    .then((response) => {
                        setProjects(response.data);
                    });
            } else if (activeView === MenuOption.TASK) {
                CreateAPIEndPoints(EndPointsName.tasks)
                    .fetchAll()
                    .then((response) => {
                        setTasks(response.data);
                    });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleWorkspaceClick = (workspace: WORKSPACE) => {
        setSelectedWorkspace(workspace);
        console.log("Selected Workspace:", workspace);
        navigate(`/workspaces/${workspace.id}`);
    };

    const handleProjectClick = (project: PROJECT) => {
        setSelectedProject(project);
        console.log("Selected Project:", project);
        navigate(`/workspaces/${project.workspaceId}/projects/${project.id}`);
    };

    const handleTaskClick = (task: TASK) => {
        setSelectedTask(task);
        console.log("Selected Task:", task);
        navigate(
            `/workspaces/${task.workspaceId}/projects/${task.projectId}/tasks/${task.id}`,
        );
    };

    const handleCreate = async () => {
        let activeEndpointsName = EndPointsName.workspaces;
        try {
            if (activeView === MenuOption.PROJECT) {
                activeEndpointsName = EndPointsName.projects;
            } else if (activeView === MenuOption.TASK) {
                activeEndpointsName = EndPointsName.tasks;
            }
            CreateAPIEndPoints(activeEndpointsName)
                .create(formData)
                .then(() => {
                    setFormData({
                        name: "",
                        description: "",
                        tag: "",
                        categoryId: 1,
                        priority: 1,
                        workspaceId: 0,
                        projectId: 0,
                        taskLink: "",
                    });
                    toggleModal();
                    fetchData();
                });
        } catch (error) {
            console.error(error);
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case MenuOption.WORKSPACE:
                return (
                    <WorkspaceList
                        workspaces={workspaces}
                        onWorkspaceClick={handleWorkspaceClick}
                    />
                );
            case MenuOption.PROJECT:
                return (
                    <ProjectList
                        projects={projects}
                        onProjectClick={handleProjectClick}
                    />
                );
            case MenuOption.TASK:
                return <TaskList tasks={tasks} onTaskClick={handleTaskClick} />;
            default:
                return "Select a view";
        }
    };

    const toggleModal = () => setModal(!modal);

    return (
        <>
            <Sidebar setActiveView={setActiveView} activeView={activeView} />
            <section className="section-container">
                <div className="row title-row-with-button">
                    <h2 className="component-title">{activeView}</h2>
                    {activeView === MenuOption.WORKSPACE && (
                        <div className="btns-container">
                            <button
                                className="btn btn-secondary"
                                onClick={toggleModal}
                            >
                                Create new {activeView} _test1
                            </button>
                        </div>
                    )}
                </div>
                <div className="row">
                    <div className="col col-md-9 p-4">{renderContent()}</div>
                </div>
            </section>

            <div className="modal-wrapper">
                <Modal
                    isOpen={modal}
                    toggle={toggleModal}
                    className="modal-wrapper"
                >
                    <ModalHeader toggle={toggleModal} className="modal-header">
                        Create New {activeView} _Test
                    </ModalHeader>
                    <ModalBody>
                        <Form className="form">
                            <FormGroup className="form-group">
                                <Label for="name" className="">
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="description">Description</Label>
                                <Input
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="tag">Tag</Label>
                                <Input
                                    type="textarea"
                                    name="tag"
                                    id="tag"
                                    value={formData.tag}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tag: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="categoryId">Category</Label>
                                <Input
                                    type="number"
                                    name="categoryId"
                                    id="categoryId"
                                    value={formData.categoryId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            categoryId: Number(e.target.value),
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="priority">Priority</Label>
                                <Input
                                    type="number"
                                    name="priority"
                                    id="priority"
                                    value={formData.priority}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            priority: Number(e.target.value),
                                        })
                                    }
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleCreate}>
                            Create
                        </Button>
                        <Button color="secondary" onClick={toggleModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
};

export default dashboard;

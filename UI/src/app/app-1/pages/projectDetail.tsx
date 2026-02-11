import React from "react";
import type { PROJECT, TASK } from "../Modals/modals";
import { CreateAPIEndPoints, EndPointsName } from "../Api/api";
import { useNavigate, useParams } from "react-router";
import TaskCard from "../components/Task/taskCard";
import "../components/Project/project.css";
import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import task from "../components/Task/task";

const projectDetail = () => {
    const { projectId, workspaceId } = useParams();
    const navigate = useNavigate();

    const prjId = Number(projectId);
    const [project, setProject] = React.useState<PROJECT | null>(null);
    const [selectedTask, setSelectedTask] = React.useState<TASK | null>(null);
    const [modal, setModal] = React.useState(false);

    const initialProjectFormData: PROJECT = {
        id: project?.id ?? 0,
        name: project?.name ?? "",
        description: project?.description ?? "",
        tag: project?.tag ?? "",
        categoryId: project?.categoryId ?? 1,
        priority: project?.priority ?? 1,
        createdDate: project?.createdDate ?? new Date().toDateString(),
        workspaceId: project?.workspaceId ?? 0,
        taskLink: project?.taskLink ?? "",
        tasks: project?.tasks ?? [],
    };
    const initialTaskFormData = {
        name: "",
        description: "",
        tag: "",
        categoryId: 1,
        priority: 1,
        projectId: prjId,
        taskLink: "",
        workspaceId: Number(workspaceId),
    };
    const [formData, setFormData] = React.useState(initialTaskFormData);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [editModal, setEditModal] = React.useState(false);
    const [editProjectFormData, setEditProjectFormData] = React.useState(
        initialProjectFormData,
    );
    const [editTaskModal, setEditTaskModal] = React.useState(false);
    const [editTaskFormData, setEditTaskFormData] =
        React.useState(initialTaskFormData);
    const [editingTaskId, setEditingTaskId] = React.useState(null);

    const toggleModal = () => setModal(!modal);
    const toggleEditModal = () => setEditModal(!editModal);
    const toggleEditTaskModal = () => setEditTaskModal(!editTaskModal);

    const fetchProjectDetails = async (prjId: number) => {
        try {
            CreateAPIEndPoints(EndPointsName.projects)
                .fetchById(prjId)
                .then((response) => {
                    setProject(() => response.data);
                });
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    };

    const handleTaskClick = (task: TASK) => {
        setSelectedTask(task);
        navigate(
            `/workspaces/${task?.workspaceId}/projects/${task.projectId}/tasks/${task.id}`,
        );
    };

    React.useEffect(() => {
        fetchProjectDetails(prjId);
    }, [projectId]);

    const handleCreateTask = async () => {
        try {
            CreateAPIEndPoints(EndPointsName.tasks)
                .create(formData)
                .then(() => {
                    setFormData(initialTaskFormData);
                    toggleModal();
                    fetchProjectDetails(prjId);
                });
        } catch (error) {
            console.error("Error in handle Create Project", error);
        }
    };

    const handleSetEditProject = () => {
        setEditProjectFormData(initialProjectFormData);
        setEditModal(true);
    };
    const handleEditProject = async () => {
        try {
            CreateAPIEndPoints(EndPointsName.projects)
                .update(prjId, editProjectFormData)
                .then(() => {
                    setEditModal(false);
                    fetchProjectDetails(prjId);
                });
        } catch (error) {
            console.error("Error in handle Edit Project", error);
        }
    };

    const handleDeleteProject = () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                CreateAPIEndPoints(EndPointsName.projects)
                    .delete(prjId)
                    .then(() => {
                        navigate("/");
                    });
            } catch (error) {
                console.error("Error in handle Delete Project", error);
            }
        }
    };

    const handleBackButton = () => {
        navigate(`/workspaces/${workspaceId}`);
    };

    return (
        <div className="wrapper">
            <div className="container project">
                <div className="d-flex">
                    <div className="box">
                        <div className="left">
                            <h2 className="title">{project?.name}</h2>
                            <p className="description">
                                {project?.description}
                            </p>
                            <p className="tag">
                                <strong>Tag: </strong> {project?.tag}
                            </p>
                            <p className="priority">
                                <strong>Priority: </strong> {project?.priority}
                            </p>
                            <p className="created-date">
                                <strong>Created: </strong>{" "}
                                {project
                                    ? new Date(
                                          project.createdDate,
                                      ).toLocaleDateString()
                                    : ""}
                            </p>
                        </div>
                    </div>
                    <div className="box">
                        <div className="right">
                            <button
                                className="btn-orange"
                                onClick={() => toggleModal()}
                            >
                                Create New Task
                            </button>
                            <button
                                className="btn-orange"
                                onClick={() => handleSetEditProject()}
                            >
                                Edit Project
                            </button>
                            <button
                                className="btn-orange"
                                onClick={() => handleDeleteProject()}
                            >
                                Delete Project
                            </button>
                            <button
                                className="btn-orange"
                                onClick={() => handleBackButton()}
                            >
                                Back to Workspace
                            </button>
                        </div>
                    </div>
                </div>

                <hr />
                <div className="project-task-details">
                    <h3 className="sub-title">Tasks</h3>
                    {project === null || project.tasks.length === 0 ? (
                        <p>No Tasks found.</p>
                    ) : (
                        <div className="project-grid">
                            {project?.tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={handleTaskClick}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CREATE NEW TASK MODAL */}
                <Modal isOpen={modal} toggle={toggleModal} className="modal">
                    <ModalHeader
                        toggle={toggleModal}
                        className="modal-header-new-project"
                    >
                        Create New Task
                    </ModalHeader>
                    <ModalBody>
                        <div className="form">
                            <FormGroup className="form-group">
                                <Label for="name" className="">
                                    Name
                                </Label>
                                <Input
                                    className="form-control-new-project"
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
                                    className="form-control-new-project"
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
                                <Label for="taskLink">Task Link</Label>
                                <Input
                                    className="form-control-new-project"
                                    type="textarea"
                                    name="taskLink"
                                    id="taskLink"
                                    value={formData.taskLink}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            taskLink: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="tag">Tag</Label>
                                <Input
                                    className="form-control-new-project"
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
                                    className="form-control-new-project"
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
                                    className="form-control-new-project"
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
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleCreateTask}>
                            Create
                        </Button>
                        <Button color="secondary" onClick={toggleModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* HANDLE UPDATE PROJECT MODAL */}
                <Modal
                    isOpen={editModal}
                    toggle={toggleEditModal}
                    className="modal"
                >
                    <ModalHeader toggle={toggleModal} className="modal-header">
                        Update Project
                    </ModalHeader>
                    <ModalBody>
                        <div className="form">
                            <FormGroup className="form-group">
                                <Label for="name" className="">
                                    Name
                                </Label>
                                <Input
                                    className="form-control-new-project"
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={editProjectFormData.name}
                                    onChange={(e) =>
                                        setEditProjectFormData({
                                            ...editProjectFormData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="description">Description</Label>
                                <Input
                                    className="form-control-new-project"
                                    type="textarea"
                                    name="description"
                                    id="description"
                                    value={editProjectFormData.description}
                                    onChange={(e) =>
                                        setEditProjectFormData({
                                            ...editProjectFormData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>

                            <FormGroup className="form-group">
                                <Label for="tag">Tag</Label>
                                <Input
                                    className="form-control-new-project"
                                    type="textarea"
                                    name="tag"
                                    id="tag"
                                    value={editProjectFormData.tag}
                                    onChange={(e) =>
                                        setEditProjectFormData({
                                            ...editProjectFormData,
                                            tag: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="categoryId">Category</Label>
                                <Input
                                    className="form-control-new-project"
                                    type="number"
                                    name="categoryId"
                                    id="categoryId"
                                    value={editProjectFormData.categoryId}
                                    onChange={(e) =>
                                        setEditProjectFormData({
                                            ...editProjectFormData,
                                            categoryId: Number(e.target.value),
                                        })
                                    }
                                />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="priority">Priority</Label>
                                <Input
                                    className="form-control-new-project"
                                    type="number"
                                    name="priority"
                                    id="priority"
                                    value={editProjectFormData.priority}
                                    onChange={(e) =>
                                        setEditProjectFormData({
                                            ...editProjectFormData,
                                            priority: Number(e.target.value),
                                        })
                                    }
                                />
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleEditProject}>
                            Update
                        </Button>
                        <Button color="secondary" onClick={toggleEditModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};

export default projectDetail;

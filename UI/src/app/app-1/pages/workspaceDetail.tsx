import React, { useEffect } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { CreateAPIEndPoints, EndPointsName } from "../Api/api";
import type { PROJECT, WORKSPACE } from "../Modals/modals";
import "../components/Workspace/workspace.css";
import ProjectCard from "../components/Project/projectCard";
import "../components/Workspace/workspace.css";
import "../components/Project/project.css";
import {
    Alert,
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";

const workspaceDetail = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const wkspId: number = Number(workspaceId);

    useEffect(() => {
        fetchWorkspaceDetails(wkspId);
    }, [workspaceId]);

    const [workspace, setWorkspace] = React.useState<WORKSPACE | null>(null);
    const [selectedProject, setSelectedProject] =
        React.useState<PROJECT | null>(null);
    const [modal, setModal] = React.useState(false);
    const initialWorkspaceFormData: WORKSPACE = {
        id: workspace?.id ?? 0,
        name: workspace?.name ?? "",
        description: workspace?.description ?? "",
        tag: workspace?.tag ?? "",
        categoryId: workspace?.categoryId ?? 1,
        priority: workspace?.priority ?? 1,
        createdDate: workspace?.createdDate ?? new Date().toDateString(),
        projects: workspace?.projects ?? [],
    };
    const initialProjectFormData = {
        name: "",
        description: "",
        tag: "",
        categoryId: 1,
        priority: 1,
        workspaceId: workspaceId,
        projectId: 0,
        taskLink: "",
    };
    const [formData, setFormData] = React.useState(initialProjectFormData);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [editModal, setEditModal] = React.useState(false);
    const [editWorkspaceFormData, setEditWorkspaceFormData] = React.useState(
        initialWorkspaceFormData,
    );
    const [editProjectModal, setEditProjectModal] = React.useState(false);
    const [editProjectFormData, setEditProjectFormData] = React.useState(
        initialProjectFormData,
    );
    const [editingProjectId, setEditingProjectId] = React.useState(null);

    const toggleModal = () => setModal(!modal);
    const toggleEditModal = () => setEditModal(!editModal);
    const toggleEditProjectModal = () => setEditProjectModal(!editProjectModal);

    const fetchWorkspaceDetails = async (workspaceId: number) => {
        try {
            CreateAPIEndPoints(EndPointsName.workspaces)
                .fetchById(wkspId)
                .then((response) => {
                    setWorkspace(response.data);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error fetching workspace details:", error);
            setLoading(false);
        }
    };

    const handleProjectClick = (project: PROJECT) => {
        setSelectedProject(project);
        navigate(`/workspaces/${workspace?.id}/projects/${project.id}`);
    };

    const handleCreateProject = async () => {
        try {
            CreateAPIEndPoints(EndPointsName.projects)
                .create(formData)
                .then(() => {
                    setFormData(initialProjectFormData);
                    toggleModal();
                    fetchWorkspaceDetails(wkspId);
                });
        } catch (error) {
            console.error("Error in handle Create Project", error);
        }
    };

    const handleSetEditWorkspace = () => {
        setEditWorkspaceFormData(initialWorkspaceFormData);
        setEditModal(true);
    };
    const handleEditWorkspace = async () => {
        try {
            CreateAPIEndPoints(EndPointsName.workspaces)
                .update(wkspId, editWorkspaceFormData)
                .then(() => {
                    setEditModal(false);
                    fetchWorkspaceDetails(wkspId);
                });
        } catch (error) {
            console.error("Error in handle Edit Workspace", error);
        }
    };

    const handleDeleteWorkspace = () => {
        if (window.confirm("Are you sure you want to delete this workspace?")) {
            try {
                CreateAPIEndPoints(EndPointsName.workspaces)
                    .delete(wkspId)
                    .then(() => {
                        navigate("/");
                    });
            } catch (error) {
                console.error("Error in handle Delete Workspace", error);
            }
        }
    };

    const handleBackButton = () => {
        navigate("/");
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert color="danger">{error}</Alert>;
    if (!workspace) return <Alert color="warning">Workspace not found</Alert>;

    return (
        <div className="wrapper">
            <div className="container">
                <div className="d-flex">
                    <div className="box">
                        <div className="left">
                            <h2 className="title">{workspace?.name}</h2>
                            <p className="description">
                                {workspace?.description}
                            </p>
                            <p className="tag">
                                <strong>Tag: </strong> {workspace?.tag}
                            </p>
                            <p className="priority">
                                <strong>Priority: </strong>{" "}
                                {workspace?.priority}
                            </p>
                            <p className="created-date">
                                <strong>Created: </strong>{" "}
                                {workspace
                                    ? new Date(
                                          workspace.createdDate,
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
                                Create New project
                            </button>
                            <button
                                className="btn-orange"
                                onClick={() => handleSetEditWorkspace()}
                            >
                                Edit Workspace
                            </button>
                            <button
                                className="btn-orange"
                                onClick={() => handleDeleteWorkspace()}
                            >
                                Delete Workspace
                            </button>
                            <button
                                className="btn-orange"
                                onClick={() => handleBackButton()}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                <hr />
                <div className="workpace-project-details">
                    <h3 className="sub-title">Projects</h3>
                    {workspace && workspace.projects.length === 0 ? (
                        <p>No projects found.</p>
                    ) : (
                        <div className="project-grid">
                            {workspace?.projects.map((prj) => (
                                <ProjectCard
                                    key={prj.id}
                                    project={prj}
                                    onClick={handleProjectClick}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* CREATE NEW PROJECT MODAL */}
                <Modal isOpen={modal} toggle={toggleModal} className="">
                    <ModalHeader
                        toggle={toggleModal}
                        className="modal-header-new-project"
                    >
                        Create New Project _test2
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
                        <Button color="primary" onClick={handleCreateProject}>
                            Create
                        </Button>
                        <Button color="secondary" onClick={toggleModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* HANDLE UPDATE WORKSPACE MODAL */}
                <Modal
                    isOpen={editModal}
                    toggle={toggleEditModal}
                    className="modal"
                >
                    <ModalHeader
                        toggle={toggleModal}
                        className="modal-header-new-project"
                    >
                        Update Workspace
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
                                    value={editWorkspaceFormData.name}
                                    onChange={(e) =>
                                        setEditWorkspaceFormData({
                                            ...editWorkspaceFormData,
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
                                    value={editWorkspaceFormData.description}
                                    onChange={(e) =>
                                        setEditWorkspaceFormData({
                                            ...editWorkspaceFormData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup>
                            {/* <FormGroup>
                                <Label for="taskLink">Task Link</Label>
                                <Input
                                    type="textarea"
                                    name="taskLink"
                                    id="taskLink"
                                    value={editWorkspaceFormData.taskLink}
                                    onChange={(e) =>
                                        setEditWorkspaceFormData({
                                            ...editWorkspaceFormData,
                                            taskLink: e.target.value,
                                        })
                                    }
                                />
                            </FormGroup> */}
                            <FormGroup className="form-group">
                                <Label for="tag">Tag</Label>
                                <Input
                                    className="form-control-new-project"
                                    type="textarea"
                                    name="tag"
                                    id="tag"
                                    value={editWorkspaceFormData.tag}
                                    onChange={(e) =>
                                        setEditWorkspaceFormData({
                                            ...editWorkspaceFormData,
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
                                    value={editWorkspaceFormData.categoryId}
                                    onChange={(e) =>
                                        setEditWorkspaceFormData({
                                            ...editWorkspaceFormData,
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
                                    value={editWorkspaceFormData.priority}
                                    onChange={(e) =>
                                        setEditWorkspaceFormData({
                                            ...editWorkspaceFormData,
                                            priority: Number(e.target.value),
                                        })
                                    }
                                />
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleEditWorkspace}>
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

export default workspaceDetail;

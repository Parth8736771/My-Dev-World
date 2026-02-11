import React, { useEffect } from "react";
import { CreateAPIEndPoints, EndPointsName } from "../Api/api";
import { useNavigate, useParams } from "react-router-dom";
import type { TASK } from "../Modals/modals";
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

const TaskDetail = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const tskId = Number(taskId);

    const [task, setTask] = React.useState<TASK | null>(null);

    const [modal, setModal] = React.useState(false);

    const initialTaskFormData: TASK = {
        id: task?.id ?? 0,
        name: task?.name ?? "",
        description: task?.description ?? "",
        tag: task?.tag ?? "",
        categoryId: task?.categoryId ?? 1,
        priority: task?.priority ?? 1,
        createdDate: task?.createdDate ?? new Date().toDateString(),
        workspaceId: task?.workspaceId ?? 0,
        projectId: task?.projectId ?? 0,
        taskLink: task?.taskLink ?? "",
        status: task?.status ?? "",
    };

    const [editModal, setEditModal] = React.useState(false);
    const [editTaskFormData, setEditTaskFormData] =
        React.useState(initialTaskFormData);

    const toggleModal = () => setModal(!modal);
    const toggleEditModal = () => setEditModal(!editModal);

    const fetchTaskDetails = (taskId: number) => {
        try {
            CreateAPIEndPoints(EndPointsName.tasks)
                .fetchById(tskId)
                .then((response) => {
                    setTask(response.data);
                });
        } catch (error) {
            console.log("error fetching task details", error);
        }
    };

    useEffect(() => {
        fetchTaskDetails(tskId);
    }, [taskId]);

    const handleSetEditTask = () => {
        setEditTaskFormData(initialTaskFormData);
        setEditModal(true);
    };
    const handleEditTask = async () => {
        try {
            CreateAPIEndPoints(EndPointsName.tasks)
                .update(tskId, editTaskFormData)
                .then(() => {
                    setEditModal(false);
                    fetchTaskDetails(tskId);
                });
        } catch (error) {
            console.error("Error in handle Edit Task", error);
        }
    };

    const handleDeleteTask = () => {
        if (window.confirm("Are you sure you want to delete this tasks?")) {
            try {
                CreateAPIEndPoints(EndPointsName.tasks)
                    .delete(tskId)
                    .then(() => {
                        navigate("/");
                    });
            } catch (error) {
                console.error("Error in handle Delete Task", error);
            }
        }
    };

    const handleBackButton = () => {
        navigate(
            `/workspaces/${task?.workspaceId}/projects/${task?.projectId}`,
        );
    };

    const handleTaskLink = (taskLink: string) => {
        navigate(taskLink);
    };

    return (
        <>
            {" "}
            <div className="container task">
                <div className="d-flex">
                    <div className="box">
                        <div className="left">
                            <h2 className="title">{task?.name}</h2>
                            <p className="description">{task?.description}</p>
                            <p className="tag">
                                <strong>Tag: </strong> {task?.tag}
                            </p>
                            <p className="priority">
                                <strong>Priority: </strong> {task?.priority}
                            </p>
                            <p className="created-date">
                                <strong>Created: </strong>{" "}
                                {task
                                    ? new Date(
                                          task.createdDate,
                                      ).toLocaleDateString()
                                    : ""}
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    handleTaskLink(task?.taskLink ?? "")
                                }
                            >
                                {task?.taskLink ?? "EMPTY"}
                            </button>
                        </div>
                    </div>
                    <div className="box">
                        <div className="left">
                            {/* <button
                                className="btn btn-primary"
                                onClick={() => toggleModal()}
                            >
                                Create New Task
                            </button> */}
                            <button
                                className="btn btn-primary"
                                onClick={() => handleSetEditTask()}
                            >
                                Edit Task
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleDeleteTask()}
                            >
                                Delete Task
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleBackButton()}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* HANDLE UPDATE TASK MODAL */}
                <Modal
                    isOpen={editModal}
                    toggle={toggleEditModal}
                    className="modal"
                >
                    <ModalHeader toggle={toggleModal} className="modal-header">
                        Update TASK
                    </ModalHeader>
                    <ModalBody>
                        <div className="form">
                            <FormGroup className="form-group">
                                <Label for="name" className="">
                                    Name
                                </Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={editTaskFormData.name}
                                    onChange={(e) =>
                                        setEditTaskFormData({
                                            ...editTaskFormData,
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
                                    value={editTaskFormData.description}
                                    onChange={(e) =>
                                        setEditTaskFormData({
                                            ...editTaskFormData,
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
                                    type="textarea"
                                    name="tag"
                                    id="tag"
                                    value={editTaskFormData.tag}
                                    onChange={(e) =>
                                        setEditTaskFormData({
                                            ...editTaskFormData,
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
                                    value={editTaskFormData.categoryId}
                                    onChange={(e) =>
                                        setEditTaskFormData({
                                            ...editTaskFormData,
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
                                    value={editTaskFormData.priority}
                                    onChange={(e) =>
                                        setEditTaskFormData({
                                            ...editTaskFormData,
                                            priority: Number(e.target.value),
                                        })
                                    }
                                />
                            </FormGroup>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleEditTask}>
                            Update
                        </Button>
                        <Button color="secondary" onClick={toggleEditModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
};

export default TaskDetail;

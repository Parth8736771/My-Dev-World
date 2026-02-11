import React, { useState } from "react";
import {
    Container,
    FormGroup,
    Label,
    Input,
    Button,
    Card,
    CardBody,
    CardHeader,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../learnings.css";
import { CreateAPIEndPoints } from "../../../app-1/Api/api";

type Question = { id: number; q: string; a: string };
type Flashcard = { id: number; front: string; back: string };
type Topic = {
    id: number;
    name: string;
    notes: string;
    questions: Question[];
    flashcards: Flashcard[];
};

const LearningCreate: React.FC = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [topics, setTopics] = useState<Topic[]>([]);
    const navigate = useNavigate();

    const addTopic = () => {
        setTopics((t) => [
            ...t,
            {
                id: Date.now(),
                name: "",
                notes: "",
                questions: [],
                flashcards: [],
            },
        ]);
    };

    const updateTopic = (id: number, patch: Partial<Topic>) => {
        setTopics((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    };

    const removeTopic = (id: number) => {
        setTopics((t) => t.filter((x) => x.id !== id));
    };

    const addQuestion = (topicId: number) => {
        const q: Question = { id: Date.now(), q: "", a: "" };
        setTopics((t) =>
            t.map((x) =>
                x.id === topicId ? { ...x, questions: [...x.questions, q] } : x,
            ),
        );
    };

    const updateQuestion = (
        topicId: number,
        questionId: number,
        patch: Partial<Question>,
    ) => {
        setTopics((t) =>
            t.map((x) =>
                x.id === topicId
                    ? {
                          ...x,
                          questions: x.questions.map((qq) =>
                              qq.id === questionId ? { ...qq, ...patch } : qq,
                          ),
                      }
                    : x,
            ),
        );
    };

    const removeQuestion = (topicId: number, questionId: number) => {
        setTopics((t) =>
            t.map((x) =>
                x.id === topicId
                    ? {
                          ...x,
                          questions: x.questions.filter(
                              (q) => q.id !== questionId,
                          ),
                      }
                    : x,
            ),
        );
    };

    const addFlashcard = (topicId: number) => {
        const f: Flashcard = { id: Date.now(), front: "", back: "" };
        setTopics((t) =>
            t.map((x) =>
                x.id === topicId
                    ? { ...x, flashcards: [...x.flashcards, f] }
                    : x,
            ),
        );
    };

    const updateFlashcard = (
        topicId: number,
        flashcardId: number,
        patch: Partial<Flashcard>,
    ) => {
        setTopics((t) =>
            t.map((x) =>
                x.id === topicId
                    ? {
                          ...x,
                          flashcards: x.flashcards.map((ff) =>
                              ff.id === flashcardId ? { ...ff, ...patch } : ff,
                          ),
                      }
                    : x,
            ),
        );
    };

    const removeFlashcard = (topicId: number, flashcardId: number) => {
        setTopics((t) =>
            t.map((x) =>
                x.id === topicId
                    ? {
                          ...x,
                          flashcards: x.flashcards.filter(
                              (f) => f.id !== flashcardId,
                          ),
                      }
                    : x,
            ),
        );
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Please provide a title");
            return;
        }

        const content = JSON.stringify({ topics });
        try {
            await CreateAPIEndPoints("learnings").createAsync({
                title,
                summary,
                content,
            });
            navigate("/learnings");
        } catch (err) {
            console.error(err);
            alert("Failed to save learning");
        }
    };

    return (
        <div className="learnings-create">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>New Learning</h2>
                    <div>
                        <Button color="secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>{" "}
                        <Button color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>

                <Card className="mb-3">
                    <CardBody>
                        <FormGroup>
                            <Label>Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Summary</Label>
                            <Input
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                        </FormGroup>
                    </CardBody>
                </Card>

                <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4>Topics</h4>
                        <Button color="success" onClick={addTopic}>
                            + Topic
                        </Button>
                    </div>

                    {topics.map((tpc) => (
                        <Card key={tpc.id} className="mb-2">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <Input
                                    value={tpc.name}
                                    placeholder="Topic name (e.g. React, JavaScript)"
                                    onChange={(e) =>
                                        updateTopic(tpc.id, {
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    color="danger"
                                    onClick={() => removeTopic(tpc.id)}
                                >
                                    Remove
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Label>Notes / Content</Label>
                                    <Input
                                        type="textarea"
                                        rows={5}
                                        value={tpc.notes}
                                        onChange={(e) =>
                                            updateTopic(tpc.id, {
                                                notes: e.target.value,
                                            })
                                        }
                                    />
                                </FormGroup>

                                <div className="mb-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6>Q&A</h6>
                                        <Button
                                            color="primary"
                                            onClick={() => addQuestion(tpc.id)}
                                        >
                                            + Q
                                        </Button>
                                    </div>
                                    {tpc.questions.map((q) => (
                                        <div
                                            key={q.id}
                                            className="p-2 border rounded mb-2"
                                        >
                                            <Input
                                                placeholder="Question"
                                                value={q.q}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        tpc.id,
                                                        q.id,
                                                        { q: e.target.value },
                                                    )
                                                }
                                                className="mb-1"
                                            />
                                            <Input
                                                placeholder="Answer"
                                                value={q.a}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        tpc.id,
                                                        q.id,
                                                        { a: e.target.value },
                                                    )
                                                }
                                            />
                                            <div className="mt-1 text-end">
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeQuestion(
                                                            tpc.id,
                                                            q.id,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6>Flashcards</h6>
                                        <Button
                                            color="primary"
                                            onClick={() => addFlashcard(tpc.id)}
                                        >
                                            + Card
                                        </Button>
                                    </div>
                                    {tpc.flashcards.map((f) => (
                                        <div
                                            key={f.id}
                                            className="p-2 border rounded mb-2"
                                        >
                                            <Input
                                                placeholder="Front (prompt)"
                                                value={f.front}
                                                onChange={(e) =>
                                                    updateFlashcard(
                                                        tpc.id,
                                                        f.id,
                                                        {
                                                            front: e.target
                                                                .value,
                                                        },
                                                    )
                                                }
                                                className="mb-1"
                                            />
                                            <Input
                                                placeholder="Back (answer)"
                                                value={f.back}
                                                onChange={(e) =>
                                                    updateFlashcard(
                                                        tpc.id,
                                                        f.id,
                                                        {
                                                            back: e.target
                                                                .value,
                                                        },
                                                    )
                                                }
                                            />
                                            <div className="mt-1 text-end">
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeFlashcard(
                                                            tpc.id,
                                                            f.id,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default LearningCreate;

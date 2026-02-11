import React, { useEffect, useState } from "react";
import {
    Container,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Label,
    Input,
    Spinner,
    Alert,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
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

type Learning = {
    id: number;
    title: string;
    summary?: string;
    content?: string;
    createdAt?: string;
};

const LearningEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [learning, setLearning] = useState<Learning | null>(null);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await CreateAPIEndPoints(
                    "learnings",
                ).fetchByIdAsync(Number(id));
                setLearning(data);
                setTitle(data.title);
                setSummary(data.summary || "");
                try {
                    const parsed = data.content
                        ? JSON.parse(data.content)
                        : { topics: [] };
                    setTopics(parsed.topics || []);
                } catch (err) {
                    setTopics([]);
                }
            } catch (err) {
                console.error(err);
                setMessage("Failed to load learning");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

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

    const updateTopic = (topicId: number, patch: Partial<Topic>) => {
        setTopics((t) =>
            t.map((x) => (x.id === topicId ? { ...x, ...patch } : x)),
        );
    };

    const removeTopic = (topicId: number) => {
        setTopics((t) => t.filter((x) => x.id !== topicId));
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
        if (!title.trim() || !learning) {
            setMessage("Title is required");
            return;
        }

        setSaving(true);
        const content = JSON.stringify({ topics });
        try {
            await CreateAPIEndPoints("learnings").updateAsync(learning.id, {
                ...learning,
                title,
                summary,
                content,
            });
            setMessage("Saved successfully!");
            setTimeout(() => navigate("/learnings"), 1000);
        } catch (err) {
            console.error(err);
            setMessage("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner />
            </Container>
        );
    }

    return (
        <div className="learning-edit">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Edit Learning</h2>
                    <div>
                        <Button color="secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? <Spinner size="sm" /> : "Save"}
                        </Button>
                    </div>
                </div>

                {message && (
                    <Alert
                        color={
                            message.includes("success") ? "success" : "danger"
                        }
                    >
                        {message}
                    </Alert>
                )}

                <Card className="mb-3">
                    <CardBody>
                        <FormGroup>
                            <Label>Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., React Fundamentals"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Summary</Label>
                            <Input
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Brief description"
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

                    {topics.length === 0 && (
                        <Card className="mb-2">
                            <CardBody className="text-muted">
                                No topics yet. Click "+ Topic" to get started.
                            </CardBody>
                        </Card>
                    )}

                    {topics.map((tpc) => (
                        <Card key={tpc.id} className="mb-2">
                            <CardHeader className="d-flex justify-content-between align-items-center bg-light">
                                <div style={{ flex: 1 }}>
                                    <Input
                                        value={tpc.name}
                                        placeholder="Topic name (e.g. React Hooks, JavaScript Async)"
                                        onChange={(e) =>
                                            updateTopic(tpc.id, {
                                                name: e.target.value,
                                            })
                                        }
                                        bsSize="sm"
                                    />
                                </div>
                                <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => removeTopic(tpc.id)}
                                    className="ms-2"
                                >
                                    Remove
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Label>Notes / Content</Label>
                                    <Input
                                        type="textarea"
                                        rows={4}
                                        value={tpc.notes}
                                        placeholder="Add detailed notes here..."
                                        onChange={(e) =>
                                            updateTopic(tpc.id, {
                                                notes: e.target.value,
                                            })
                                        }
                                    />
                                </FormGroup>

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6>Questions & Answers</h6>
                                        <Button
                                            color="primary"
                                            size="sm"
                                            onClick={() => addQuestion(tpc.id)}
                                        >
                                            + Q&A
                                        </Button>
                                    </div>
                                    {tpc.questions.map((q) => (
                                        <div
                                            key={q.id}
                                            className="p-3 border rounded mb-2"
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                            }}
                                        >
                                            <div className="mb-2">
                                                <Input
                                                    placeholder="Question..."
                                                    value={q.q}
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            tpc.id,
                                                            q.id,
                                                            {
                                                                q: e.target
                                                                    .value,
                                                            },
                                                        )
                                                    }
                                                    bsSize="sm"
                                                />
                                            </div>
                                            <div className="d-flex gap-2 align-items-start">
                                                <Input
                                                    placeholder="Answer..."
                                                    value={q.a}
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            tpc.id,
                                                            q.id,
                                                            {
                                                                a: e.target
                                                                    .value,
                                                            },
                                                        )
                                                    }
                                                    bsSize="sm"
                                                    style={{ flex: 1 }}
                                                />
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
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6>Flashcards</h6>
                                        <Button
                                            color="info"
                                            size="sm"
                                            onClick={() => addFlashcard(tpc.id)}
                                        >
                                            + Card
                                        </Button>
                                    </div>
                                    {tpc.flashcards.map((f) => (
                                        <div
                                            key={f.id}
                                            className="p-3 border rounded mb-2"
                                            style={{
                                                backgroundColor: "#f0f7ff",
                                            }}
                                        >
                                            <div className="mb-2">
                                                <Input
                                                    placeholder="Front (question/prompt)..."
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
                                                    bsSize="sm"
                                                />
                                            </div>
                                            <div className="d-flex gap-2 align-items-start">
                                                <Input
                                                    placeholder="Back (answer)..."
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
                                                    bsSize="sm"
                                                    style={{ flex: 1 }}
                                                />
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

export default LearningEdit;

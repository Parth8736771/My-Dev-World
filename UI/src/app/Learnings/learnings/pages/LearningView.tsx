import React, { useEffect, useMemo, useState } from "react";
import {
    Container,
    Button,
    Card,
    CardBody,
    CardHeader,
    Spinner,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../learnings.css";
import QuizPlayer from "../components/QuizPlayer";
import FlashcardPlayer from "../components/FlashcardPlayer";
import { CreateAPIEndPoints } from "../../../app-1/Api/api";

type Learning = {
    id: number;
    title: string;
    summary?: string;
    content?: string;
    createdAt?: string;
};

type Question = { id: number; q: string; a: string };
type Flashcard = { id: number; front: string; back: string };
type Topic = {
    id: number;
    name: string;
    notes: string;
    questions: Question[];
    flashcards: Flashcard[];
};

const LearningView: React.FC = () => {
    const { id } = useParams();
    const [item, setItem] = useState<Learning | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [mode, setMode] = useState<"read" | "quiz" | "flashcard">("read");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await CreateAPIEndPoints(
                    "learnings",
                ).fetchByIdAsync(Number(id));
                setItem(data);
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
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const allQuestions = useMemo(
        () => topics.flatMap((t) => t.questions || []),
        [topics],
    );
    const allCards = useMemo(
        () => topics.flatMap((t) => t.flashcards || []),
        [topics],
    );

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner />
            </Container>
        );
    }

    if (!item) {
        return (
            <Container>
                <Card>
                    <CardBody className="text-danger">
                        Learning not found
                    </CardBody>
                </Card>
            </Container>
        );
    }

    return (
        <div className="learning-view">
            <Container>
                <div className="view-header">
                    <div>
                        <h2>{item.title}</h2>
                        <p className="muted">{item.summary}</p>
                    </div>
                    <div className="button-group">
                        <Button color="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        <Button
                            color="primary"
                            onClick={() =>
                                navigate(`/learnings/edit/${item.id}`)
                            }
                        >
                            Edit
                        </Button>
                        <Button
                            color="warning"
                            onClick={() => {
                                if (allQuestions.length === 0) {
                                    alert("No questions available");
                                    return;
                                }
                                setMode("quiz");
                            }}
                        >
                            Quiz
                        </Button>
                        <Button
                            color="info"
                            onClick={() => {
                                if (allCards.length === 0) {
                                    alert("No flashcards available");
                                    return;
                                }
                                setMode("flashcard");
                            }}
                        >
                            Flashcards
                        </Button>
                    </div>
                </div>

                {mode === "read" && (
                    <div>
                        {topics.length === 0 && (
                            <Card>
                                <CardBody className="text-muted">
                                    No structured content found. Edit or add
                                    topics, questions, and flashcards.
                                </CardBody>
                            </Card>
                        )}

                        {topics.map((t) => (
                            <Card key={t.id} className="mb-3">
                                <CardHeader className="bg-light">
                                    <h5 className="mb-0">
                                        {t.name || "Untitled Topic"}
                                    </h5>
                                </CardHeader>
                                <CardBody>
                                    {t.notes && (
                                        <div className="topic-notes mb-3">
                                            <strong>Notes:</strong>
                                            <div className="mt-2">
                                                {t.notes
                                                    .split("\n")
                                                    .map((line, i) => (
                                                        <p
                                                            key={i}
                                                            className="mb-1"
                                                        >
                                                            {line}
                                                        </p>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {t.questions && t.questions.length > 0 && (
                                        <div className="mb-3">
                                            <h6 className="mb-2">
                                                Q&A ({t.questions.length})
                                            </h6>
                                            {t.questions.map((q) => (
                                                <div
                                                    key={q.id}
                                                    className="p-2 border-start ps-3 mb-2"
                                                    style={{
                                                        borderLeftWidth: 4,
                                                        borderLeftColor:
                                                            "#0d6efd",
                                                    }}
                                                >
                                                    <strong>Q:</strong>{" "}
                                                    {q.q || <em>--empty--</em>}
                                                    <br />
                                                    <strong>A:</strong>{" "}
                                                    {q.a || <em>--empty--</em>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {t.flashcards &&
                                        t.flashcards.length > 0 && (
                                            <div>
                                                <h6 className="mb-2">
                                                    Flashcards (
                                                    {t.flashcards.length})
                                                </h6>
                                                <div className="row">
                                                    {t.flashcards.map((f) => (
                                                        <div
                                                            key={f.id}
                                                            className="col-md-6 col-lg-4 mb-2"
                                                        >
                                                            <div className="card-mini p-2 border rounded">
                                                                <small className="text-muted">
                                                                    Front:
                                                                </small>
                                                                <p className="mb-1">
                                                                    {f.front || (
                                                                        <em>
                                                                            --
                                                                        </em>
                                                                    )}
                                                                </p>
                                                                <small className="text-muted">
                                                                    Back:
                                                                </small>
                                                                <p className="mb-0">
                                                                    {f.back || (
                                                                        <em>
                                                                            --
                                                                        </em>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}

                {mode === "quiz" && (
                    <QuizPlayer
                        questions={allQuestions}
                        onExit={() => setMode("read")}
                    />
                )}

                {mode === "flashcard" && (
                    <FlashcardPlayer
                        flashcards={allCards}
                        onExit={() => setMode("read")}
                    />
                )}
            </Container>
        </div>
    );
};

export default LearningView;

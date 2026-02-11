import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";

type Flashcard = { id: number; front: string; back: string };

interface FlashcardPlayerProps {
    flashcards: Flashcard[];
    onExit: () => void;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
    flashcards,
    onExit,
}) => {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    if (flashcards.length === 0) {
        return (
            <Card>
                <CardBody>
                    <p className="text-muted">No flashcards available.</p>
                    <Button color="secondary" onClick={onExit}>
                        Exit
                    </Button>
                </CardBody>
            </Card>
        );
    }

    const current = flashcards[index];

    const handleNext = () => {
        setFlipped(false);
        setIndex((i) => Math.min(i + 1, flashcards.length - 1));
    };

    const handlePrev = () => {
        setFlipped(false);
        setIndex((i) => Math.max(i - 1, 0));
    };

    return (
        <Card className="flashcard-player">
            <CardBody>
                <div className="mb-3">
                    <h5>Flashcard Mode</h5>
                    <small className="text-muted">
                        Card {index + 1} of {flashcards.length}
                    </small>
                </div>

                <div
                    className="flashcard-display p-5 border-3 rounded text-center mb-3 cursor-pointer"
                    onClick={() => setFlipped((f) => !f)}
                    style={{
                        minHeight: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: flipped ? "#e7f3ff" : "#fff8e7",
                        borderColor: flipped ? "#0d6efd" : "#ffc107",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                >
                    <div>
                        {!flipped ? (
                            <div>
                                <small className="text-muted">FRONT</small>
                                <h4 className="mt-2 mb-0">
                                    {current.front || <em>--empty--</em>}
                                </h4>
                            </div>
                        ) : (
                            <div>
                                <small className="text-muted">BACK</small>
                                <h4 className="mt-2 mb-0">
                                    {current.back || <em>--empty--</em>}
                                </h4>
                            </div>
                        )}
                        <small className="text-muted mt-2 d-block">
                            Click to flip
                        </small>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <Button
                        color="secondary"
                        onClick={handlePrev}
                        disabled={index === 0}
                    >
                        Previous
                    </Button>

                    <Button
                        color="primary"
                        onClick={() => setFlipped((f) => !f)}
                    >
                        {flipped ? "Show Front" : "Show Back"}
                    </Button>

                    <Button
                        color="success"
                        onClick={handleNext}
                        disabled={index >= flashcards.length - 1}
                    >
                        Next Card
                    </Button>

                    <Button color="light" onClick={onExit} className="ms-auto">
                        Exit Flashcards
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default FlashcardPlayer;

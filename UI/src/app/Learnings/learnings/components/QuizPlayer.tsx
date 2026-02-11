import React, { useState } from "react";
import { Button, Card, CardBody } from "reactstrap";

type Question = { id: number; q: string; a: string };

interface QuizPlayerProps {
    questions: Question[];
    onExit: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions, onExit }) => {
    const [index, setIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    if (questions.length === 0) {
        return (
            <Card>
                <CardBody>
                    <p className="text-muted">
                        No questions available for this quiz.
                    </p>
                    <Button color="secondary" onClick={onExit}>
                        Exit
                    </Button>
                </CardBody>
            </Card>
        );
    }

    const current = questions[index];

    const handleNext = () => {
        setShowAnswer(false);
        setIndex((i) => Math.min(i + 1, questions.length - 1));
    };

    const handlePrev = () => {
        setShowAnswer(false);
        setIndex((i) => Math.max(i - 1, 0));
    };

    return (
        <Card className="quiz-player">
            <CardBody>
                <div className="mb-3">
                    <h5>Quiz Mode</h5>
                    <small className="text-muted">
                        Question {index + 1} of {questions.length}
                    </small>
                </div>

                <div
                    className="quiz-question p-4 border rounded mb-3"
                    style={{ minHeight: 120 }}
                >
                    <h6>{current.q || <em>--empty question--</em>}</h6>

                    {showAnswer && (
                        <div className="mt-3 p-3 bg-light rounded">
                            <strong>Answer:</strong>
                            <p className="mb-0 mt-2">
                                {current.a || <em>--empty answer--</em>}
                            </p>
                        </div>
                    )}
                </div>

                <div className="d-flex gap-2">
                    <Button
                        color="secondary"
                        onClick={handlePrev}
                        disabled={index === 0}
                    >
                        Previous
                    </Button>

                    {!showAnswer ? (
                        <Button
                            color="primary"
                            onClick={() => setShowAnswer(true)}
                        >
                            Reveal Answer
                        </Button>
                    ) : (
                        <Button
                            color="success"
                            onClick={handleNext}
                            disabled={index >= questions.length - 1}
                        >
                            Next Question
                        </Button>
                    )}

                    <Button color="light" onClick={onExit} className="ms-auto">
                        Exit Quiz
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default QuizPlayer;

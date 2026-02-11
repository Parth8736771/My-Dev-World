import React from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

type Learning = {
    id: number;
    title: string;
    summary?: string;
    createdAt?: string;
};

const LearningsList: React.FC<{ items: Learning[]; onRefresh: () => void }> = ({
    items,
}) => {
    const navigate = useNavigate();

    return (
        <ListGroup>
            {items.length === 0 && (
                <ListGroupItem className="muted">
                    No learnings yet. Create one!
                </ListGroupItem>
            )}
            {items.map((it) => (
                <ListGroupItem
                    key={it.id}
                    className="d-flex justify-content-between align-items-start"
                >
                    <div>
                        <h5 style={{ margin: 0 }}>{it.title}</h5>
                        <small className="muted">{it.summary}</small>
                    </div>
                    <div className="d-flex gap-2">
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => navigate(`/learnings/${it.id}`)}
                        >
                            View
                        </Button>
                        <Button
                            color="secondary"
                            size="sm"
                            onClick={() => navigate(`/learnings/edit/${it.id}`)}
                        >
                            Edit
                        </Button>
                    </div>
                </ListGroupItem>
            ))}
        </ListGroup>
    );
};

export default LearningsList;

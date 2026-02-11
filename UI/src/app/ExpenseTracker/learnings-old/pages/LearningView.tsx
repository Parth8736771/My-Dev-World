import React, { useEffect, useState } from "react";
import { Container, Button } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../learnings.css";

type Learning = {
    id: number;
    title: string;
    summary?: string;
    content?: string;
    createdAt?: string;
};

const LearningView: React.FC = () => {
    const { id } = useParams();
    const [item, setItem] = useState<Learning | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/learnings/${id}`);
                if (res.ok) setItem(await res.json());
            } catch (err) {
                console.error(err);
            }
        })();
    }, [id]);

    if (!item) return <Container>Loading...</Container>;

    return (
        <div className="learning-view">
            <Container>
                <div className="view-header">
                    <h2>{item.title}</h2>
                    <div>
                        <Button color="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    </div>
                </div>
                <p className="muted">{item.summary}</p>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: item.content || "" }}
                />
            </Container>
        </div>
    );
};

export default LearningView;

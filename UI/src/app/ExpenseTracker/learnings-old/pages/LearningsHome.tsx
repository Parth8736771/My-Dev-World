import React, { useEffect, useState } from "react";
import { Container, Button, Spinner } from "reactstrap";
import LearningsList from "../components/LearningsList";
import { useNavigate } from "react-router-dom";
import "../learnings.css";

type Learning = {
    id: number;
    title: string;
    summary?: string;
    createdAt?: string;
};

const LearningsHome: React.FC = () => {
    const [items, setItems] = useState<Learning[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/learnings");
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="learnings-home">
            <Container>
                <div className="learnings-header">
                    <div>
                        <h1>Learnings</h1>
                        <p className="muted">
                            Save notes, Q&A, tutorials and snippets.
                        </p>
                    </div>
                    <div>
                        <Button
                            color="primary"
                            onClick={() => navigate("/learnings/create")}
                        >
                            + New
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="center">
                        <Spinner />
                    </div>
                ) : (
                    <LearningsList items={items} onRefresh={load} />
                )}
            </Container>
        </div>
    );
};

export default LearningsHome;

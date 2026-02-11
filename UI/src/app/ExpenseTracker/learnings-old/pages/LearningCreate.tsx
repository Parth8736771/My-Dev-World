import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../learnings.css";

const LearningCreate: React.FC = () => {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            await fetch("/api/learnings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, summary, content }),
            });
            navigate("/learnings");
        } catch (err) {
            console.error(err);
            alert("Failed to save");
        }
    };

    return (
        <div className="learnings-create">
            <Container>
                <h2>New Learning</h2>
                <Form>
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
                    <FormGroup>
                        <Label>Content</Label>
                        <Input
                            type="textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                        />
                    </FormGroup>
                    <div className="actions">
                        <Button color="primary" onClick={handleSave}>
                            Save
                        </Button>{" "}
                        <Button color="secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default LearningCreate;

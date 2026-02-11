import React, { useState, useEffect } from "react";
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback,
    Row,
    Col,
    ButtonGroup,
} from "reactstrap";
import {
    getCategories,
    getCommonNames,
    addCommonName,
    getExpenseTypes,
    addExpenseType,
} from "../../utils/CONSTANT";
import type { ExpenseData } from "../Modal/Modals";
import "./ExpensesForm.css";

interface ExpensesFormProps {
    expense?: Partial<ExpenseData>;
    onSave: (expense: Partial<ExpenseData>, keepOpen?: boolean) => void;
    onCancel: () => void;
    expenseType?: string;
}

const ExpensesForm: React.FC<ExpensesFormProps> = ({
    expense,
    onSave,
    onCancel,
    expenseType,
}) => {
    const [formData, setFormData] = useState<Partial<ExpenseData>>({
        id: 0,
        type: expenseType || getExpenseTypes()[0],
        amount: 0,
        name: "",
        description: "",
        notes: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        taskId: 0,
        ...expense,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [keepOpen, setKeepOpen] = useState(false);

    const [rSelected, setRSelected] = useState<string | undefined>("");

    useEffect(() => {
        if (expense && expense.id) {
            setFormData({
                //3,
                ...formData,
                ...expense,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expense?.id]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "Name is required";
        }

        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }

        if (!formData.type) {
            newErrors.type = "Type is required";
        }

        if (!formData.date) {
            newErrors.date = "Date is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleExpenseTypeChange = (type: string) => {
        setFormData((prev) => ({
            ...prev,
            type: type,
        }));
    };

    const handleSave = async (e?: React.FormEvent, keep?: boolean) => {
        if (e) e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // if (rSelected !== undefined) {
            //     formData.type = rSelected;
            // }
            if (!formData.date || isNaN(new Date(formData.date).getTime())) {
                setErrors({ ...errors, date: "Please enter a valid date" });
                return;
            }

            // Persist typed entries into lists for future reuse
            if (formData.name && !getCommonNames().includes(formData.name)) {
                addCommonName(formData.name);
            }
            if (
                formData.category &&
                !getCategories().includes(formData.category)
            ) {
                // add new category
                // addCategory is available in CONSTANT but not imported here; to keep file small, use addCommonName for names only
                // If category adding is needed persistently, call addCategory from CONSTANT
                // eslint-disable-next-line no-console
                console.log(
                    "New category detected (save handled by manage modal):",
                    formData.category,
                );
            }
            // If type is new, add it
            if (formData.type && !getExpenseTypes().includes(formData.type)) {
                addExpenseType(formData.type);
            }

            await onSave(formData, keep ?? keepOpen);

            if (keep ?? keepOpen) {
                // reset form for next entry but keep modal open
                setFormData({
                    id: 0,
                    type: formData.type || getExpenseTypes()[0],
                    amount: 0,
                    name: "",
                    description: "",
                    notes: "",
                    category: "",
                    date: new Date().toISOString().split("T")[0],
                    taskId: 0,
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const types = getExpenseTypes();
    const names = getCommonNames();
    const categories = getCategories();

    const getDateValue = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        // Only return empty for completely invalid dates, allow partial input
        return !isNaN(date.getTime())
            ? date.toISOString().slice(0, 10)
            : dateStr;
    };

    return (
        <div className="expenses-form-container">
            <Form onSubmit={(e) => handleSave(e)} className="expenses-form">
                <div className="text-danger">
                    {errors && Object.keys(errors).length > 0
                        ? Object.values(errors).join(", ")
                        : null}
                </div>
                <div className="form-top">
                    <div className="form-title">
                        {formData.id ? "Edit" : "New"} Entry
                    </div>
                    <div className="form-top-actions">
                        <Button
                            close
                            aria-label="Close"
                            onClick={onCancel}
                            className="top-close"
                        />
                    </div>
                </div>
                <Row>
                    <ButtonGroup className="btn-group">
                        <Button
                            color="success"
                            outline
                            value="Income"
                            onClick={() => handleExpenseTypeChange("Income")}
                            // onClick={() => setRSelected("Income")}
                            active={rSelected === "Income"}
                        >
                            Income
                        </Button>
                        <Button
                            color="danger"
                            outline
                            value="Expense"
                            onClick={() => handleExpenseTypeChange("Expense")}
                            active={rSelected === "Expense"}
                        >
                            Expense
                        </Button>
                        <Button
                            color="warning"
                            outline
                            value="Saving"
                            onClick={() => handleExpenseTypeChange("Saving")}
                            active={rSelected === "Saving"}
                        >
                            Saving
                        </Button>
                    </ButtonGroup>
                    <p>Selected: {rSelected}</p>
                    {errors.type && <FormFeedback>{errors.type}</FormFeedback>}

                    {/* <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="type" className="form-label">
                                Type <span className="required">*</span>
                            </Label>
                            <Input
                                type="select"
                                name="type"
                                id="type"
                                value={formData.type || ""}
                                onChange={handleChange}
                                invalid={!!errors.type}
                                className="form-input"
                            >
                                <option value="">Select Type</option>
                                {types.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </Input>
                            {errors.type && (
                                <FormFeedback>{errors.type}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col> */}
                    <Col md="6">
                        <FormGroup>
                            <Label for="amount" className="form-label">
                                Amount <span className="required">*</span>
                            </Label>
                            <Input
                                type="number"
                                name="amount"
                                id="amount"
                                placeholder="0.00"
                                value={formData.amount || ""}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                invalid={!!errors.amount}
                                className="form-input"
                            />
                            {errors.amount && (
                                <FormFeedback>{errors.amount}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="name" className="form-label">
                                Name <span className="required">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name || ""}
                                onChange={handleChange}
                                placeholder="Select or type name"
                                list="expense-names"
                                className="form-input"
                            />
                            <datalist id="expense-names">
                                {names.map((n) => (
                                    <option key={n} value={n} />
                                ))}
                            </datalist>
                            {errors.name && (
                                <FormFeedback>{errors.name}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="category" className="form-label">
                                Category
                            </Label>
                            <Input
                                type="text"
                                name="category"
                                id="category"
                                value={formData.category || ""}
                                onChange={handleChange}
                                placeholder="Select or type category"
                                list="expense-categories"
                                className="form-input"
                            />
                            <datalist id="expense-categories">
                                {categories.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md="6">
                        <FormGroup>
                            <Label for="date" className="form-label">
                                Date <span className="required">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="date"
                                id="date"
                                value={formData.date || ""}
                                onChange={handleChange}
                                invalid={!!errors.date}
                                className="form-input"
                            />
                            {errors.date && (
                                <FormFeedback>{errors.date}</FormFeedback>
                            )}
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <Label for="description" className="form-label">
                                Description
                            </Label>
                            <Input
                                type="text"
                                name="description"
                                id="description"
                                placeholder="Enter description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <FormGroup>
                    <Label for="notes" className="form-label">
                        Notes
                    </Label>
                    <Input
                        type="textarea"
                        name="notes"
                        id="notes"
                        placeholder="Add any additional notes..."
                        value={formData.notes || ""}
                        onChange={handleChange}
                        rows={3}
                        className="form-input"
                    />
                </FormGroup>

                <div className="form-actions">
                    <div className="left-actions">
                        <label
                            className="d-flex align-items-center gap-2"
                            style={{ fontSize: 13 }}
                        >
                            <Input
                                type="checkbox"
                                id="keepOpen"
                                checked={keepOpen}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setKeepOpen(e.target.checked)}
                            />
                            <span>Keep form open after save</span>
                        </label>
                    </div>
                    <div className="right-actions">
                        <Button
                            color="primary"
                            onClick={(e) => handleSave(e, true)}
                            disabled={isSubmitting}
                            className="btn-submit add-another"
                        >
                            {isSubmitting ? "Saving..." : "Save & Add Another"}
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-submit"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : formData.id
                                  ? "Update"
                                  : "Save"}
                        </Button>
                        <Button
                            color="secondary"
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="btn-cancel"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default ExpensesForm;

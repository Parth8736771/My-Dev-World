import React, { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Input,
    ListGroup,
    ListGroupItem,
} from "reactstrap";
import {
    getExpenseTypes,
    addExpenseType,
    getCommonNames,
    addCommonName,
    getCategories,
    addCategory,
    DATA_STORAGE_KEYS,
} from "../../utils/CONSTANT";

interface ManageDataModalProps {
    isOpen: boolean;
    toggle: () => void;
    onUpdated?: () => void;
}

const ManageDataModal: React.FC<ManageDataModalProps> = ({
    isOpen,
    toggle,
    onUpdated,
}) => {
    const [activeTab, setActiveTab] = useState<string>("types");
    const [newValue, setNewValue] = useState<string>("");

    const [types, setTypes] = useState<string[]>(getExpenseTypes());
    const [names, setNames] = useState<string[]>(getCommonNames());
    const [categories, setCategories] = useState<string[]>(getCategories());

    const addCurrent = () => {
        const v = newValue.trim();
        if (!v) return;
        if (activeTab === "types") {
            const newList = addExpenseType(v);
            setTypes(newList);
        } else if (activeTab === "names") {
            const newList = addCommonName(v);
            setNames(newList);
        } else if (activeTab === "categories") {
            const newList = addCategory(v);
            setCategories(newList);
        }
        setNewValue("");
        onUpdated?.();
    };

    const removeItem = (tab: string, value: string) => {
        // Remove by reading current list, filtering, and writing back to localStorage
        try {
            const raw = localStorage.getItem(
                tab === "types"
                    ? DATA_STORAGE_KEYS.TYPES
                    : tab === "names"
                      ? DATA_STORAGE_KEYS.NAMES
                      : DATA_STORAGE_KEYS.CATEGORIES,
            );
            const arr = raw ? JSON.parse(raw) : null;
            if (arr && Array.isArray(arr)) {
                const filtered = arr.filter((x: string) => x !== value);
                localStorage.setItem(
                    tab === "types"
                        ? DATA_STORAGE_KEYS.TYPES
                        : tab === "names"
                          ? DATA_STORAGE_KEYS.NAMES
                          : DATA_STORAGE_KEYS.CATEGORIES,
                    JSON.stringify(filtered),
                );
                // update local state
                if (tab === "types") setTypes(filtered);
                if (tab === "names") setNames(filtered);
                if (tab === "categories") setCategories(filtered);
                onUpdated?.();
            }
        } catch (e) {
            console.error("Failed to remove item", e);
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="md">
            <ModalHeader toggle={toggle}>Manage Data</ModalHeader>
            <ModalBody>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTab === "types" ? "active" : ""}
                            onClick={() => setActiveTab("types")}
                        >
                            Types
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === "names" ? "active" : ""}
                            onClick={() => setActiveTab("names")}
                        >
                            Names
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={
                                activeTab === "categories" ? "active" : ""
                            }
                            onClick={() => setActiveTab("categories")}
                        >
                            Categories
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} className="mt-3">
                    <TabPane tabId="types">
                        <Input
                            placeholder="Add new type and press Add"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                        <div className="mt-2 d-flex gap-2">
                            <Button color="primary" onClick={addCurrent}>
                                Add
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => setNewValue("")}
                            >
                                Clear
                            </Button>
                        </div>

                        <ListGroup className="mt-3">
                            {types.map((t) => (
                                <ListGroupItem
                                    key={t}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div>{t}</div>
                                    <div>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            onClick={() =>
                                                removeItem("types", t)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </TabPane>

                    <TabPane tabId="names">
                        <Input
                            placeholder="Add new name and press Add"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                        <div className="mt-2 d-flex gap-2">
                            <Button color="primary" onClick={addCurrent}>
                                Add
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => setNewValue("")}
                            >
                                Clear
                            </Button>
                        </div>

                        <ListGroup className="mt-3">
                            {names.map((n) => (
                                <ListGroupItem
                                    key={n}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div>{n}</div>
                                    <div>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            onClick={() =>
                                                removeItem("names", n)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </TabPane>

                    <TabPane tabId="categories">
                        <Input
                            placeholder="Add new category and press Add"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                        />
                        <div className="mt-2 d-flex gap-2">
                            <Button color="primary" onClick={addCurrent}>
                                Add
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => setNewValue("")}
                            >
                                Clear
                            </Button>
                        </div>

                        <ListGroup className="mt-3">
                            {categories.map((c) => (
                                <ListGroupItem
                                    key={c}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div>{c}</div>
                                    <div>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            onClick={() =>
                                                removeItem("categories", c)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </TabPane>
                </TabContent>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ManageDataModal;

import React from "react";

const container = () => {
    return (
        <>
            <section className="file-container">
                {/* <!-- Drag & Drop Area --> */}
                <div className="drop-zone" id="dropZone">
                    <div className="drop-zone-content">
                        <span className="drop-icon">⬇️</span>
                        <p>Drag files here or click to browse</p>
                        <small>
                            Supported: Images, PDFs, Documents, Excel files
                        </small>
                    </div>
                    <input
                        type="file"
                        id="fileInput"
                        className="file-input"
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                    />
                </div>

                {/* <!-- Files Grid --> */}
                <div className="files-grid" id="filesGrid">
                    {/* Files will be rendered here */}
                </div>

                {/* <!-- Empty State --> */}
                <div className="empty-state" id="emptyState">
                    <span className="empty-icon">📭</span>
                    <h3>No files in this category</h3>
                    <p>
                        Drag files here or use "Add Files" button to get started
                    </p>
                </div>
            </section>
        </>
    );
};

export default container;

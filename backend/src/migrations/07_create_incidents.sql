CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    type_id INTEGER NOT NULL,
    area_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    status_id INTEGER NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,

    assigned_to INTEGER,
    closed_by INTEGER,
    closed_at DATETIME,

    FOREIGN KEY (type_id) REFERENCES types(id),
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (status_id) REFERENCES status(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (closed_by) REFERENCES users(id)
);
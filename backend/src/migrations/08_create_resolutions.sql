CREATE TABLE IF NOT EXISTS resolutions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    incident_id INTEGER NOT NULL,
    solution TEXT,
    root_cause_id INTEGER NOT NULL,

    FOREIGN KEY (incident_id) REFERENCES incidents(id),
    FOREIGN KEY (root_cause_id) REFERENCES root_cause(id)
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    area_id INTEGER NOT NULL,

    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (area_id) REFERENCES areas(id)
);
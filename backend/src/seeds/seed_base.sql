INSERT OR IGNORE INTO roles (id, name) VALUES
(1, 'OPERATOR'),
(2, 'TECHNICIAN'),
(3, 'SUPERVISOR'),
(4, 'MANAGER');

INSERT OR IGNORE INTO status (id, name) VALUES
(1, 'OPEN'),
(2, 'ASSIGNED'),
(3, 'IN_PROGRESS'),
(4, 'SOLVED'),
(5, 'CLOSED');

INSERT OR IGNORE INTO areas (id, name) VALUES
(1, 'IT'),
(2, 'HR'),
(3, 'FINANCE'),
(4, 'OPERATIONS'),
(5, 'PRODUCTION'),
(6, 'QUALITY'),
(7, 'LOGISTIC');

INSERT OR IGNORE INTO types (id, name) VALUES
(1, 'HARDWARE'),
(2, 'SOFTWARE'),
(3, 'NETWORK');

INSERT OR IGNORE INTO root_cause (id, name) VALUES
(1, 'USER_ERROR'),
(2, 'SYSTEM_FAILURE'),
(3, 'NETWORK_ISSUE');

INSERT OR IGNORE INTO users (id, name, lastname, password, role_id, area_id) VALUES
(1, 'Juan', 'Perez', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 1, 1),
(2, 'Maria', 'Gomez', '123456', 1, 4),
(3, 'Carlos', 'Ruiz', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 2, 2),
(4, 'Lucia', 'Fernandez', '123456', 2, 5),
(5, 'Diego', 'Martinez', '123456', 2, 2),
(6, 'Sofia', 'Lopez', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 3, 1),
(7, 'Martin', 'Sanchez', '123456', 3, 3),
(8, 'Laura', 'Diaz', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 4, 1);
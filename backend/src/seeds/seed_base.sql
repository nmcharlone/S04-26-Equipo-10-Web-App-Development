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

INSERT OR IGNORE INTO areas (name) VALUES
('IT'),
('HR'),
('FINANCE'),
('OPERATIONS'),
('PRODUCTION'),
('QUALITY'),
('LOGISTIC');


INSERT OR IGNORE INTO types (name) VALUES
('HARDWARE'),
('SOFTWARE'),
('NETWORK');

INSERT OR IGNORE INTO root_cause (name) VALUES
('USER_ERROR'),
('SYSTEM_FAILURE'),
('NETWORK_ISSUE');

INSERT INTO users (name, lastname, password, role_id, area_id) VALUES

-- Operadores
('Juan', 'Perez', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 1, 1),
('Maria', 'Gomez', '123456', 1, 4),

-- Técnicos
('Carlos', 'Ruiz', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 2, 2),
('Lucia', 'Fernandez', '123456', 2, 5),
('Diego', 'Martinez', '123456', 2, 2),

-- Supervisores
('Sofia', 'Lopez', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 3, 1),
('Martin', 'Sanchez', '123456', 3, 3),

-- Gerente
('Laura', 'Diaz', '$2b$10$y5GVf9wpTOBDBJEqWjIx0OLaZZCqu2Dnpai5/Ki2S2BiYwguRcACm', 4, 1);

INSERT INTO incidents (
    type_id,
    area_id,
    description,
    status_id,
    created_at,
    created_by,
    assigned_to,
    closed_by,
    closed_at
) VALUES

-- CERRADOS
(1, 1, 'Linea de ensamblaje detenida por falla de sensor', 5,
datetime('now', '-28 days'),
1, 3, 6,
datetime('now', '-27 days')),

(2, 5, 'Sistema ERP sin acceso desde logistica', 5,
datetime('now', '-26 days'),
2, 4, 7,
datetime('now', '-25 days')),

(3, 4, 'Intermitencia de red en deposito principal', 5,
datetime('now', '-24 days'),
2, 4, 7,
datetime('now', '-23 days')),

(1, 2, 'Compresor industrial detenido por sobrecalentamiento', 5,
datetime('now', '-22 days'),
1, 5, 6,
datetime('now', '-21 days')),

(2, 3, 'Error en carga de reportes de calidad', 5,
datetime('now', '-20 days'),
2, 4, 7,
datetime('now', '-19 days')),

(1, 1, 'Falla electrica en cinta transportadora', 5,
datetime('now', '-18 days'),
1, 3, 6,
datetime('now', '-17 days')),

(3, 5, 'Caida de conexion VPN en oficinas administrativas', 5,
datetime('now', '-16 days'),
2, 4, 7,
datetime('now', '-15 days')),

(1, 2, 'Motor de bomba hidraulica con vibracion excesiva', 5,
datetime('now', '-14 days'),
1, 5, 6,
datetime('now', '-13 days')),

-- RESUELTOS
(1, 1, 'Sensor de temperatura fuera de rango', 5,
datetime('now', '-12 days'),
1, 3, 6,
datetime('now', '-11 days')),

(2, 5, 'Usuarios no pueden imprimir etiquetas', 5,
datetime('now', '-11 days'),
2, 4, 7,
datetime('now', '-10 days')),

(1, 2, 'Perdida de presion en sistema neumatico', 5,
datetime('now', '-10 days'),
1, 5, 6,
datetime('now', '-9 days')),

(3, 4, 'Microcortes de red en area de expedicion', 5,
datetime('now', '-9 days'),
2, 4, 7,
datetime('now', '-8 days')),

(2, 3, 'Aplicacion de control de calidad no responde', 5,
datetime('now', '-8 days'),
2, 4, 7,
datetime('now', '-7 days')),

(1, 1, 'Parada inesperada de brazo robotico', 5,
datetime('now', '-7 days'),
1, 3, 6,
datetime('now', '-6 days')),

(1, 2, 'Ruido anormal en generador auxiliar', 5,
datetime('now', '-6 days'),
1, 5, 6,
datetime('now', '-5 days')),

(3, 5, 'Switch principal reiniciandose aleatoriamente', 5,
datetime('now', '-5 days'),
2, 4, 7,
datetime('now', '-4 days')),

(2, 4, 'Sistema de inventario lento', 5,
datetime('now', '-4 days'),
2, 4, 7,
datetime('now', '-3 days')),

(1, 1, 'Falla en panel de control de produccion', 5,
datetime('now', '-3 days'),
1, 3, 6,
datetime('now', '-2 days'));

INSERT INTO resolutions (
    incident_id,
    solution,
    root_cause_id
) VALUES

-- INCIDENTES CERRADOS

(1,
'Reemplazo de sensor defectuoso y recalibracion de linea',
2),

(2,
'Reinicio de servicios ERP y ajuste de permisos de acceso',
2),

(3,
'Reemplazo de switch de red y estabilizacion de enlace',
3),

(4,
'Mantenimiento correctivo del compresor y limpieza de ventilacion',
2),

(5,
'Correccion de configuracion en modulo de reportes',
1),

(6,
'Reemplazo de fusible industrial y revision electrica',
2),

(7,
'Reconfiguracion de VPN corporativa y reinicio de firewall',
3),

(8,
'Alineacion de bomba hidraulica y ajuste de rodamientos',
2),

-- INCIDENTES RESUELTOS

(9,
'Recalibracion del sensor y actualizacion de firmware',
2),

(10,
'Reinstalacion de drivers de impresion y limpieza de cola',
1),

(11,
'Reparacion de fuga neumatica y reemplazo de valvula',
2),

(12,
'Optimización del enlace de red y reemplazo de cableado',
3),

(13,
'Reinicio de aplicacion y ajuste de configuracion de memoria',
2),

(14,
'Reemplazo de actuador defectuoso del brazo robotico',
2),

(15,
'Mantenimiento preventivo del generador auxiliar',
2),

(16,
'Actualizacion de firmware del switch principal',
3),

(17,
'Optimización de consultas del sistema de inventario',
2),

(18,
'Reinicio del panel HMI y reemplazo de fuente de alimentacion',
2);
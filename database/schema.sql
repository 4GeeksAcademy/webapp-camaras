
-- ==============================================
-- Esquema de Base de Datos para WebApp Cámaras
-- ==============================================

-- Crear tabla de Roles
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Crear tabla de Usuarios
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES Roles(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de Cámaras
CREATE TABLE Cameras (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    username VARCHAR(50),
    password VARCHAR(50),
    connection_method VARCHAR(20),
    location_lat DECIMAL(9,6),
    location_lng DECIMAL(9,6),
    is_active BOOLEAN DEFAULT TRUE
);

-- Crear tabla de Registros ALPR
CREATE TABLE ALPR_Records (
    id SERIAL PRIMARY KEY,
    camera_id INT REFERENCES Cameras(id),
    plate_number VARCHAR(20) NOT NULL,
    detected_at TIMESTAMP DEFAULT NOW(),
    image_url VARCHAR(255),
    additional_data JSON
);

-- Crear tabla de Tipos de Objetos del Mapa
CREATE TABLE Map_Object_Types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Crear tabla de Objetos del Mapa
CREATE TABLE Map_Objects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type_id INT REFERENCES Map_Object_Types(id),
    geojson JSONB NOT NULL,
    color VARCHAR(7),
    created_by INT REFERENCES Users(id),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de Filtros
CREATE TABLE Filters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    filter_query JSON NOT NULL
);

-- Crear tabla de Filtros de Usuario
CREATE TABLE User_Filters (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    filter_id INT REFERENCES Filters(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- ==============================================
-- Datos de ejemplo
-- ==============================================

-- Insertar Roles básicos
INSERT INTO Roles (name, description) VALUES 
('Admin', 'Administrador con permisos completos'),
('Editor', 'Puede editar objetos del mapa'),
('Viewer', 'Solo puede visualizar');

-- Insertar Tipos de Objetos del Mapa
INSERT INTO Map_Object_Types (name, description) VALUES
('Línea', 'Objeto de tipo línea'),
('Polígono', 'Objeto de tipo polígono'),
('Marcador', 'Punto específico en el mapa');

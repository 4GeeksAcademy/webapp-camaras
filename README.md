
# 📷 WebApp de Gestión de Cámaras y ALPR

Aplicación web para la gestión de cámaras de tránsito AXIS, registros ALPR (Reconocimiento Automático de Matrículas) y mapa interactivo con Leaflet.

---

## 🚀 Tecnologías
- **Frontend:** React + Leaflet
- **Backend:** Flask / Node.js (API RESTful)
- **Base de Datos:** PostgreSQL (GeoJSON almacenado en JSONB)
- **DevOps:** GitHub Codespaces / Docker (opcional)

---

## 📂 Estructura del Proyecto
```
root/
├── backend/
├── frontend/
└── database/
```

---

## 🗄️ Esquema de Base de Datos

### 1️⃣ Roles
| Campo        | Tipo      |
|--------------|-----------|
| id (PK)      | INT       |
| name         | VARCHAR   |
| description  | TEXT      |

### 2️⃣ Users
| Campo         | Tipo      |
|---------------|-----------|
| id (PK)       | INT       |
| username      | VARCHAR   |
| email         | VARCHAR   |
| password_hash | VARCHAR   |
| role_id (FK)  | INT       |
| created_at    | TIMESTAMP |

### 3️⃣ Cameras
| Campo           | Tipo     |
|-----------------|----------|
| id (PK)         | INT      |
| name            | VARCHAR  |
| ip_address      | VARCHAR  |
| username        | VARCHAR  |
| password        | VARCHAR  |
| connection_method | VARCHAR|
| location_lat    | DECIMAL  |
| location_lng    | DECIMAL  |
| is_active       | BOOLEAN  |

### 4️⃣ ALPR_Records
| Campo          | Tipo      |
|----------------|-----------|
| id (PK)        | INT       |
| camera_id (FK) | INT       |
| plate_number   | VARCHAR   |
| detected_at    | TIMESTAMP |
| image_url      | VARCHAR   |
| additional_data| JSON      |

### 5️⃣ Map_Object_Types
| Campo        | Tipo     |
|--------------|----------|
| id (PK)      | INT      |
| name         | VARCHAR  |
| description  | TEXT     |

### 6️⃣ Map_Objects
| Campo        | Tipo     |
|--------------|----------|
| id (PK)      | INT      |
| name         | VARCHAR  |
| type_id (FK) | INT      |
| geojson      | JSONB    |
| color        | VARCHAR  |
| created_by   | INT      |
| is_public    | BOOLEAN  |
| created_at   | TIMESTAMP|
| updated_at   | TIMESTAMP|

### 7️⃣ Filters
| Campo         | Tipo   |
|---------------|--------|
| id (PK)       | INT    |
| name          | VARCHAR|
| description   | TEXT   |
| filter_query  | JSON   |

### 8️⃣ User_Filters
| Campo         | Tipo   |
|---------------|--------|
| id (PK)       | INT    |
| user_id (FK)  | INT    |
| filter_id (FK)| INT    |
| is_active     | BOOLEAN|

---

## 🌐 Definición de Endpoints (API REST)

### 🔐 Auth
| Método | Endpoint     | Descripción        |
|--------|--------------|--------------------|
| POST   | /api/login   | Iniciar sesión     |
| POST   | /api/logout  | Cerrar sesión      |
| GET    | /api/me      | Info del usuario   |

### 👤 Users
| Método | Endpoint         | Descripción     |
|--------|------------------|-----------------|
| GET    | /api/users       | Listar usuarios |
| GET    | /api/users/:id   | Ver usuario     |
| POST   | /api/users       | Crear usuario   |
| PUT    | /api/users/:id   | Editar usuario  |
| DELETE | /api/users/:id   | Eliminar usuario|

### 📷 Cameras
| Método | Endpoint           | Descripción       |
|--------|--------------------|-------------------|
| GET    | /api/cameras       | Listar cámaras    |
| GET    | /api/cameras/:id   | Ver cámara        |
| POST   | /api/cameras       | Crear cámara      |
| PUT    | /api/cameras/:id   | Editar cámara     |
| DELETE | /api/cameras/:id   | Eliminar cámara   |

### 🚘 ALPR Records
| Método | Endpoint                | Descripción              |
|--------|-------------------------|--------------------------|
| GET    | /api/alpr-records       | Listar registros         |
| GET    | /api/alpr-records/:id   | Ver registro             |
| DELETE | /api/alpr-records/:id   | Eliminar registro        |

### 🗺️ Map Objects
| Método | Endpoint             | Descripción        |
|--------|----------------------|--------------------|
| GET    | /api/map-objects     | Listar objetos     |
| GET    | /api/map-objects/:id | Ver objeto         |
| POST   | /api/map-objects     | Crear objeto       |
| PUT    | /api/map-objects/:id | Editar objeto      |
| DELETE | /api/map-objects/:id | Eliminar objeto    |

### 🎨 Map Object Types
| Método | Endpoint               | Descripción    |
|--------|------------------------|----------------|
| GET    | /api/map-object-types  | Listar tipos   |

### 🔎 Filters
| Método | Endpoint      | Descripción        |
|--------|---------------|--------------------|
| GET    | /api/filters  | Listar filtros     |
| POST   | /api/filters  | Crear filtro       |
| PUT    | /api/filters/:id | Editar filtro    |
| DELETE | /api/filters/:id | Eliminar filtro  |

### 🧩 User Filters
| Método | Endpoint           | Descripción         |
|--------|--------------------|---------------------|
| GET    | /api/user-filters  | Listar filtros user |
| POST   | /api/user-filters  | Activar filtro      |
| DELETE | /api/user-filters/:id | Desactivar filtro |


CREATE TABLE usuarios (
    correo VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    llavePublica TEXT,
    tipoFirma VARCHAR(10)
);

CREATE TABLE archivos (
    id SERIAL PRIMARY KEY, 
    correo VARCHAR(255) REFERENCES usuarios(correo) ON DELETE CASCADE,
    nombre VARCHAR(50) NOT NULL,
    contenido BYTEA,
    hash TEXT,
    firma TEXT,
    tipoFirma VARCHAR(10)
);
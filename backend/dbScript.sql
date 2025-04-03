CREATE TABLE usuarios (
    correo VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    llavePublica TEXT
);

CREATE TABLE archivos (
	id SERIAL PRIMARY KEY, 
    correo VARCHAR(255) REFERENCES usuarios(correo) ON DELETE CASCADE,
    nombre VARCHAR(50) NOT NULL,
    contenido TEXT,
    hash TEXT,
    tipoFirma VARCHAR(10)
);

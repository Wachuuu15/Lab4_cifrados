# Laboratorio 4 - Cifrados Asimétricos
<a id="readme-top"></a>

## 📜 Descripción

El objetivo del ejercicio es desarrollar una aplicación frontend que permita a los usuarios:

* Registrarse y almacenar su contraseña de manera segura.
* Autenticarse con JWT.
* Firmar archivos digitalmente con ECC o RSA.
* Proteger la integridad de los archivos con SHA-256.
* Acceder a archivos cifrados usando su llave privada.

# 🚀 Elección de Frontend: **React**

Para este proyecto, elegimos **React** como tecnología para el frontend. Con el fin de enfocar el frontend en el uso de componentes para los elementos visuales.

## 📦 Dependencias

Las principales dependencias del frontend son:
- **React-dom**
- **React-router-dom**

## 📋 Funcionalidades

### 🖥️ Formulario de Login/Register
- Entrada de **Email** y **Contraseña**.
- Botón de **Iniciar Sesión** o **Registrar**.
- Envío de credenciales al backend en **Node.js**.
- Almacenamiento seguro del token JWT en el navegador.

### 🏠 Pantalla de Inicio
- Botón para **generar nuevas llaves privadas/públicas** (se descarga la privada y la pública se almacena en el backend).
- Formulario para **guardar un archivo**, con opción de firmarlo digitalmente.
- Listado de **archivos disponibles** recuperados desde el backend.
- Botón para **descargar un archivo** desde el servidor.
- Opcion para **validar la firma de un archivo** antes de descargarlo.


# 🚀 Elección de Backend: **JavaScript con Express**

Para este proyecto, elegimos **Node.js con Express** como tecnología para el backend. A continuación, explicamos las razones detrás de esta decisión:

## 📌 1. Compatibilidad con el Frontend (React con Byte)
- Ambos utilizan **JavaScript**, lo que permite reutilizar código y mantener una lógica uniforme.
- Facilita la comunicación entre frontend y backend a través de JSON y la API.

## ⚡ 2. Simplicidad y Velocidad de Desarrollo
- Express.js es un framework ligero y rápido, ideal para construir APIs REST.
- Node.js permite manejar múltiples conexiones concurrentes de forma eficiente.
- Muchas librerías listas para las distintas caracteristicas del laboratorio (`jsonwebtoken`, `bcryptjs`, `crypto`, `multer`).

## 🔒 3. Seguridad y Cifrado
- **Autenticación con JWT** usando `jsonwebtoken`.
- **Hashing de contraseñas con SHA-256** usando `bcryptjs` o `crypto`.
- **Firma digital con ECC/RSA** usando `crypto`.
- **Gestión de archivos** con `fs` y `multer`.

## 🌍 4. Comunidad y Soporte
- Gran comunidad y abundante documentación.
- Amplia adopción en aplicaciones web modernas.

### ⚙️ Funcionalidades del Backend

#### 🔐 **Autenticación y Seguridad**
- **Registro de usuarios** con almacenamiento seguro de contraseñas usando `bcryptjs`.
- **Inicio de sesión** con validación de credenciales y generación de **tokens JWT**.
- **Middleware de autenticación** para proteger rutas privadas mediante JWT.

#### 📁 **Gestión de Archivos**
- **Subida de archivos** con `multer`, permitiendo a los usuarios almacenar documentos cifrados.
- **Descarga de archivos** solo si el usuario está autenticado y autorizado.
- **Firma digital de archivos** con **ECC o RSA** usando el módulo `crypto`.
- **Verificación de firmas digitales** para garantizar la autenticidad de los documentos.

#### 🔑 **Cifrado y Descifrado**
- **Cifrado de archivos** utilizando claves públicas antes de su almacenamiento.
- **Descifrado de archivos** usando la clave privada del usuario autenticado.
- **Protección de integridad** mediante la generación y verificación de **hashes SHA-256**.

#### 📡 **API RESTful**
- **Endpoints** para la autenticación (`/auth/login`, `/auth/register`).
- **Rutas protegidas** para el manejo de archivos (`/files/upload`, `/files/download`).
- **Endpoints de cifrado y firma** (`/crypto/encrypt`, `/crypto/decrypt`, `/crypto/sign`, `/crypto/verify`).

---

# 📌 Conclusión  
Se eligió **React** y **Node.js con Express** porque facilita la integración de cualquier proyecto que comprende distintas conexiones y funcionalidades. Esto gracias al entorno que ambos frameworks otorgan. React aporta gran valor y facilidad para el desarrollo web; y Node.js acelera el desarrollo, cuenta con un ecosistema fuerte para manejar autenticación, firma digital y cifrado de archivos.

## 🚀 Instalación y Uso

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Wachuuu15/Lab4_cifrados.git
   ```

### Frontend
1. Instalar dependencias:
   ```bash
   cd Frontend
   npm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Backend
1. Instalar dependencias:
   ```bash
   cd Backend
   npm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   npm run start
   ```

## 👥 Contribuciones
Si deseas contribuir al proyecto, por favor sigue los siguientes pasos:

1. Realiza un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.


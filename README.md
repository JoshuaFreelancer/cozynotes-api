# 📝 CozyNotes

> Una aplicación full-stack de gestión de notas moderna, rápida y con una interfaz "Bento" altamente interactiva.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js_24-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Sequelize](https://img.shields.io/badge/Sequelize_6-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

---

## ✨ Características Principales

- **Editor de Texto Enriquecido:** Integración nativa con Tiptap Headless Editor para formateo avanzado y listas de tareas.
- **Arquitectura UI/UX:** Diseño responsivo basado en Grid (Bento UI) con temas de colores dinámicos.
- **Gestión de Estado Centralizada:** Manejo de estado del cliente fluido y predecible utilizando Zustand.
- **Soft Deletion & Papelera:** Sistema de recuperación de notas de 7 días impulsado por el modelo `paranoid` de Sequelize.
- **Base de Datos Relacional:** Modelado robusto en MySQL/MariaDB.

## 🛠️ Entornos y Versiones

### Infraestructura Base
- **Node.js:** `24.11.1`
- **npm:** `11.6.2`
- **Sistemas Objetivo:** Linux y macOS

### Frontend
- **Core:** React `19.2.5`, Vite `8.0.9`, React Router DOM `7.14.2`
- **Estado y Herramientas:** Zustand `5.0.12`, Tiptap `3.22.4`, Sileo `0.1.5`

### Backend
- **Core:** Express `5.2.1`
- **Base de Datos:** Sequelize `6.37.8`, Sequelize CLI `6.6.5`, MySQL2 `3.22.2`
- **Seguridad:** bcryptjs `3.0.3`

---

## 🚀 Requisitos Previos e Instalación

Para correr este proyecto en local, asegúrate de tener instalado Node.js (24.x) y una instancia de MariaDB o MySQL activa y accesible.

### Configuración Rápida (Recomendada)

El proyecto incluye un script de inicialización que automatiza todo el proceso.

1. Asegura que tu servidor MariaDB/MySQL esté en ejecución.
2. Revisa `backend/.env` (si no existe, el script lo creará automáticamente basado en `backend/.env.example`).
3. Ejecuta el bootstrap desde la raíz del proyecto:

```bash
bash setup.sh
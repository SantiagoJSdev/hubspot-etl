# Proyecto ETL HubSpot

## 🎯 Objetivo

Implementar un flujo ETL (Extract, Transform, Load) para mover datos de **Leads (Contacts)** y **Deals** desde la API de HubSpot a un Data Warehouse en **PostgreSQL**. El proyecto utiliza NestJS y sigue una arquitectura limpia para la separación de responsabilidades.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

* **Node.js** (v18 o superior)
* **npm** 
* **PostgreSQL**: Una instancia de base de datos PostgreSQL corriendo localmente o en la nube.
* **Token de HubSpot**: Un "Token de Acceso Privado" (Private App Token) de HubSpot.

## 🚀 Pasos de Instalación y Ejecución

1.  **Clonar el Repositorio:**
    ```sh
    git clone [URL_DEl_REPO]
    cd hubspot-etl
    ```

2.  **Instalar Dependencias:**
    ```sh
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto (puedes duplicar `.env.example`) y llénalo con tus credenciales:

    ```env
    # HubSpot
    HUBSPOT_PRIVATE_APP_TOKEN=tu_token_privado_aqui

    # PostgreSQL (Formato URL)
    DATABASE_URL="postgresql://USUARIO:PASSWORD@HOST:PUERTO/NOMBRE_DB"
    ```

4.  **Configurar la Base de Datos (¡Importante!):**
    * Conéctate a tu instancia de PostgreSQL.
    * Crea la base de datos (ej. `hubspot_dw`).
    * Ejecuta el siguiente script SQL para crear las tablas `deals` y `leads`

    ```sql
    CREATE TABLE deals (
        id SERIAL PRIMARY KEY,
        hubspot_deal_id VARCHAR(255) UNIQUE NOT NULL,
        nombre_trato VARCHAR(255),
        monto DECIMAL(12, 2),
        etapa VARCHAR(255),
        fecha_creacion_hubspot TIMESTAMPTZ,
        fecha_cierre_hubspot TIMESTAMPTZ,
        fecha_etl_actualizado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX idx_deals_hubspot_id ON deals(hubspot_deal_id);

    CREATE TABLE leads (
        id SERIAL PRIMARY KEY,
        hubspot_contact_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        nombre VARCHAR(255),
        apellido VARCHAR(255),
        fecha_creacion_hubspot TIMESTAMPTZ,
        fecha_etl_actualizado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX idx_leads_hubspot_id ON leads(hubspot_contact_id);
    ```

5.  **Iniciar la Aplicación:**
    ```sh
    npm run start:dev
    ```

---
*(Sección a completar luego)*
## 🤖 Endpoints de la API

### Sincronización (ETL)
* `POST /data-sync/run`: Inicia el proceso ETL completo manualmente.

### Analítica (Consultas)
* `GET /analytics/...`: (Por definir)
---
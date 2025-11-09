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


# 🚀 Proyecto ETL: HubSpot a Data Warehouse con NestJS

Este proyecto implementa un proceso ETL (Extract, Transform, Load) para sincronizar datos de **Deals (Tratos)** y **Contacts (Leads)** desde la API de HubSpot a un **Data Warehouse (DW)** basado en PostgreSQL, utilizando **NestJS** para la orquestación y el **SDK oficial de HubSpot** para la extracción.

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular, separada en componentes clave para un flujo ETL robusto:

1.  **HubspotModule (Extract):** Se encarga de la comunicación con la API de HubSpot, maneja la autenticación y la paginación de los datos.
2.  **DataSyncModule (Transform/Orchestrate):** El orquestador principal que dirige el flujo E -> T -> L. Contiene la lógica de transformación de datos (aplanamiento, limpieza y estandarización).
3.  **WarehouseModule (Load):** Responsable de la persistencia de datos en PostgreSQL, utilizando `node-postgres` para realizar operaciones de **`UPSERT` masivo (`ON CONFLICT`)**.
4.  **AnalyticsModule:** Expone APIs RESTful para consultar métricas clave directamente desde el Data Warehouse.

## 🔑 Configuración de Credenciales (.env)

El proyecto requiere las siguientes variables de entorno. Note que la autenticación con HubSpot usa un token de acceso directo.

| Variable | Descripción | Valor |
| :--- | :--- | :--- |
| `DATABASE_URL` | URL de conexión a PostgreSQL (Ej: `postgresql://user:pass@host:port/dbname`). | `postgresql://...` |
| **`HUBSPOT_PRIVATE_APP_TOKEN`** | **Token de Acceso (AccessToken) de la aplicación privada/personal de HubSpot.** Este es el valor de la clave de acceso de desarrollo. | `CP6m1cumMxIg...` |

## ⚠️ Advertencia sobre la Autenticación de HubSpot (CRÍTICA)

El token actual (`HUBSPOT_PRIVATE_APP_TOKEN`) es un **`accessToken` de vida corta** (aprox. 30 minutos) proporcionado por la interfaz de desarrollo de HubSpot.

* **Estado Actual:** El `HubspotService` usa este token para la prueba de concepto y la conexión es exitosa.
* **Problema de Estabilidad:** En un entorno de producción, este token **expirará rápidamente**, causando fallos en el ETL.
* **Solución de Producción:** La solución robusta y estable (que la API requiere) es implementar el flujo **OAuth 2.0** que utiliza un **Refresh Token** junto con el `Client ID` y `Client Secret` para la renovación automática. Esta configuración es necesaria para la estabilidad a largo plazo.

## 🌐 Endpoints de la API

El servidor NestJS opera en el puerto 3000.

### 1. Sincronización (ETL Manual)
Dispara el proceso completo de Extracción, Transformación y Carga.

| Método | Path | Descripción |
| :--- | :--- | :--- |
| **POST** | `/data-sync/run` | Inicia el proceso de E-T-L de Deals y Leads de HubSpot a PostgreSQL. |

### 2. Analítica (Consultas al DW)
APIs que consultan la data limpia y transformada en el Data Warehouse.

| Método | Path | Descripción | Ejemplo de Respuesta |
| :--- | :--- | :--- | :--- |
| **GET** | `/analytics/revenue-summary` | Devuelve el **total de ingresos** y el **conteo de Tratos Ganados** (`closedwon`). | `{"total_revenue": 23500.0, "won_deals_count": 2}` |
| **GET** | `/analytics/leads-count` | Devuelve el número total de **Leads** (Contactos) almacenados en el DW. | `{"total_leads": 50}` |

---


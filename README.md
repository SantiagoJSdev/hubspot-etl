# Proyecto ETL HubSpot

## 🎯 Objetivo

Implementar un flujo ETL (Extract, Transform, Load) para mover datos de **Leads (Contacts)** y **Deals** desde la API de HubSpot a un Data Warehouse en **PostgreSQL**. El proyecto utiliza NestJS y sigue una arquitectura limpia para la separación de responsabilidades.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

* **Node.js** (v18 o superior)
* **npm** 
* **PostgreSQL**: Una instancia de base de datos PostgreSQL corriendo localmente o en la nube.
* **Token de HubSpot**: Un "Token de Acceso Privado" (Private App Token) de HubSpot.

## 🛠️ Herramientas y Tecnologías Utilizadas

Este proyecto fue construido con las siguientes tecnologías clave para garantizar un flujo ETL robusto, tipado y escalable:

*  **NestJS**: UnFramework de Backend: NestJS (TypeScript).

Razón: Proporciona una arquitectura modular y orientada a objetos (OOP) que facilita la separación de responsabilidades (Extract, Transform, Load) en servicios aislados.

*  **PostgreSQL**: Base de Datos (Data Warehouse): PostgreSQL.

Razón: Es robusto, gratuito y ofrece soporte nativo para UPSERT (ON CONFLICT DO UPDATE), esencial para la idempotencia del proceso de carga (L).

* **Conector DB**: node-postgres (pg).

Razón: Se utiliza directamente sin un ORM para un control total sobre las consultas SQL masivas y optimizadas (unnest).

* **Extracción (E)**: @hubspot/api-client (SDK Oficial).

Razón: Proporciona manejo nativo de la paginación y la autenticación, reduciendo la complejidad del código HTTP manual.

* **Documentación API**: Swagger (@nestjs/swagger).

Razón: Genera una interfaz OpenAPI interactiva (/api/docs), vital para probar y documentar los endpoints de orquestación y analítica.


## 💡 Decisiones Técnicas Clave

Las siguientes decisiones arquitectónicas se tomaron para garantizar la calidad, la idempotencia y la mantenibilidad del proyecto:

1. Manejo de la Carga (Load) y la Idempotencia
Técnica: Se implementó una lógica de UPSERT masivo (INSERT INTO ... ON CONFLICT (hubspot_deal_id) DO UPDATE SET ...) en WarehouseService.

Justificación: Esto garantiza que el proceso ETL pueda ejecutarse múltiples veces sin crear duplicados. 

2. Tipado Estricto de Datos (End-to-End)
Técnica: Se definieron DTOs de tres tipos (RawDto, TransformedDto, ResponseDto) para tipar cada etapa del flujo ETL (E, T, L).

Justificación: Se eliminó el uso de any en servicios, garantizando la seguridad de tipos y facilitando el refactoring y la depuración del código.

3. Arquitectura y Separación de Intereses (Clean Code)
Técnica: Separación de strings de consultas SQL y listas de propiedades de HubSpot a archivos de constantes (.sql.ts, .constants.ts).

Justificación: Mantiene los servicios de negocio (AnalyticsService, WarehouseService) limpios, centrándose solo en la lógica de conexión y orquestación, no en la sintaxis de las queries.

4. Decisión Crítica: Autenticación de HubSpot
Técnica Elegida (PoC): Uso de un Private App Token directo (HUBSPOT_PRIVATE_APP_TOKEN).

Justificación: Esta opción fue elegida por su simplicidad para la Prueba de Concepto (PoC) y su fácil configuración inicial.

Riesgo y Corrección (Producción): Este token de prueba expira en pocas horas. Para un entorno de producción, la decisión técnica obligatoria sería migrar a la autenticación OAuth 2.0 (Refresh Token y Access Token). Esta requiere la gestión de client_id y client_secret para la renovación automática y garantizar la estabilidad del servicio ETL 24/7.

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

El servidor NestJS opera en el puerto 3000 y utiliza el prefijo global /api/v1 para todas las rutas.

## Documentación (Swagger/OpenAPI)

La documentación interactiva de la API (incluyendo esquemas de DTOs y pruebas directas) está disponible en:
Recurso      Path
Swagger UI   http://localhost:3000/api/docs

## Sincronización (ETL Manual)

Método     Path Completo             Descripción
POST       /api/v1/data-sync/run     Inicia el proceso E-T-L de Deals y Leads de HubSpot a PostgreSQL.

## Analítica (Consultas al DW)

Método     Path Completo                         Descripción                                                                 Ejemplo de Respuesta
GET        /api/v1/analytics/revenue-summary     Devuelve el total de ingresos y el conteo de Tratos Ganados (closedwon).    {"total_revenue": 23500.0, "won_deals_count": 2}


GET        /api/v1/analytics/leads-count         Devuelve el número total de Leads (Contactos) almacenados en el DW.         {""total_leads"": 50}
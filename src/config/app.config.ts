

export const configuration = () => ({
  // 1. Configuración de la aplicación
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  
  // 2. Credenciales del Data Warehouse (PostgreSQL)
  database: {
    url: process.env.DATABASE_URL,
    // Puedes descomponer la URL si quieres más control
  },

  // 3. Credenciales de HubSpot (las que estás usando actualmente)
  hubspot: {
    privateAppToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN,
    // Si usaras OAuth, aquí irían client_id, client_secret y refresh_token
  },
});

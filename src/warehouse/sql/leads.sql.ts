
export const BULK_UPSERT_LEADS_QUERY = `
  INSERT INTO leads (
    hubspot_contact_id, email, nombre, apellido, 
    fecha_creacion_hubspot, fecha_etl_actualizado
  )
  SELECT * FROM unnest(
    $1::text[], $2::text[], $3::text[], $4::text[], $5::timestamptz[]
  ) AS t(id, email, nombre, apellido, creacion),
  NOW() 
  
  ON CONFLICT (hubspot_contact_id) DO UPDATE SET
    email = EXCLUDED.email,
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    fecha_creacion_hubspot = EXCLUDED.fecha_creacion_hubspot,
    fecha_etl_actualizado = NOW();
`;
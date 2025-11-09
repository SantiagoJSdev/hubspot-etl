
export const BULK_UPSERT_DEALS_QUERY = `
  INSERT INTO deals (
    hubspot_deal_id, nombre_trato, monto, etapa, 
    fecha_creacion_hubspot, fecha_cierre_hubspot, fecha_etl_actualizado
  )
  -- Usamos unnest para convertir arrays en filas
  SELECT * FROM unnest(
    $1::text[], $2::text[], $3::decimal[], $4::text[], 
    $5::timestamptz[], $6::timestamptz[]
  ) AS t(id, nombre, monto, etapa, creacion, cierre),
  -- Añadimos la fecha de actualización
  NOW() 
  
  -- Esta es la clave de la Idempotencia
  ON CONFLICT (hubspot_deal_id) DO UPDATE SET
    nombre_trato = EXCLUDED.nombre_trato,
    monto = EXCLUDED.monto,
    etapa = EXCLUDED.etapa,
    fecha_creacion_hubspot = EXCLUDED.fecha_creacion_hubspot,
    fecha_cierre_hubspot = EXCLUDED.fecha_cierre_hubspot,
    fecha_etl_actualizado = NOW();
`;

export const GET_REVENUE_SUMMARY_QUERY = `
  SELECT 
    SUM(monto) AS total_revenue,
    COUNT(hubspot_deal_id) AS won_deals_count
  FROM deals
  WHERE etapa = 'closedwon'; 
`;

export const GET_LEADS_COUNT_QUERY = `
  SELECT COUNT(*) AS total FROM leads;
`;
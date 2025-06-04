import axios from 'axios';


const tenantId = process.env.TENANT_ID ?? '';
const clientId =  process.env.CLIENT_ID ?? '';
const clientSecret =  process.env.CLIENT_SECRET ?? '';
const workspaceId =  process.env.WORKSPACE_ID ?? '';
const reportId =  process.env.REPORT_ID ?? '';


const authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const scope = 'https://analysis.windows.net/powerbi/api/.default';

export async function GET() {
  try {
    const tokenResponse = await axios.post(
      authorityUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: scope,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const accessToken = tokenResponse.data.access_token;
    const embedResponse = await axios.post(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      { accessLevel: 'view' },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const embedToken = embedResponse.data.token;
    return new Response(JSON.stringify({ token: embedToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generando el token embed:', error);
    return new Response(JSON.stringify({ error: 'No se pudo obtener el token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

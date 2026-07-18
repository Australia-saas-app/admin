import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const pathString = params.path.join('/');
  const backendUrl = process.env.BACKEND_URL || 'http://saas-backend:3001';
  const targetUrl = `${backendUrl}/sso/${pathString}`;

  try {
    const body = await req.json();
    
    console.log(`[PROXY] Forwarding request to: ${targetUrl}`);
    
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const textData = await res.text();
    
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch {
      // Not JSON, return as text but wrap in JSON so the client doesn't choke
      return NextResponse.json({
        statusCode: res.status,
        message: `Backend returned non-JSON response: ${textData.substring(0, 200)}`
      }, { status: res.status });
    }
    
    return NextResponse.json(jsonData, { status: res.status });
    
  } catch (error: any) {
    console.error('[PROXY ERROR]', error);
    
    // Return EXACTLY what the internal Node.js error was as JSON so the UI displays it!
    return NextResponse.json({
      statusCode: 502,
      message: `[NextJS Proxy Error] Failed to connect to ${targetUrl}. Reason: ${error.message}. Code: ${error.code}`
    }, { status: 502 }); // Use 502 Bad Gateway to differentiate from 500 Internal Server Error
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const pathString = params.path.join('/');
  const backendUrl = process.env.BACKEND_URL || 'http://saas-backend:3001';
  const targetUrl = `${backendUrl}/sso/${pathString}`;

  try {
    console.log(`[PROXY] Forwarding GET request to: ${targetUrl}`);
    
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const textData = await res.text();
    
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch {
      return NextResponse.json({
        statusCode: res.status,
        message: `Backend returned non-JSON response: ${textData.substring(0, 200)}`
      }, { status: res.status });
    }
    
    return NextResponse.json(jsonData, { status: res.status });
    
  } catch (error: any) {
    console.error('[PROXY ERROR]', error);
    
    return NextResponse.json({
      statusCode: 502,
      message: `[NextJS Proxy Error] Failed to connect to ${targetUrl}. Reason: ${error.message}. Code: ${error.code}`
    }, { status: 502 });
  }
}

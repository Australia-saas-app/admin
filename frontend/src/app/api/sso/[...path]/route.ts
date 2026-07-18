import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
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

export async function GET(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
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

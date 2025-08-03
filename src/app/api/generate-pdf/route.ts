
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { htmlContent, fileName } = await request.json();

  if (!htmlContent) {
    return NextResponse.json({ error: 'Missing htmlContent' }, { status: 400 });
  }

  const apiKey = process.env.PDFSHIFT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'PDFShift API key is not configured.' }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(apiKey)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: htmlContent,
        landscape: false,
        use_print: true,
        sandbox: true,
      })
    });
    
    if (!response.ok) {
        const errorBody = await response.json();
        console.error('PDFShift API Error:', errorBody);
        return NextResponse.json({ error: 'Failed to generate PDF', details: errorBody.message || response.statusText }, { status: response.status });
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName || 'cv.pdf'}"`,
      },
    });

  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF', details: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.titre || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Titre et description requis pour le signalement.' },
        { status: 400 }
      );
    }

    const report = await dbService.reportIncident(params.id, body);
    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: any) {
    console.error('Error reporting incident:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

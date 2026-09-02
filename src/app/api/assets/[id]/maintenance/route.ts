import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    if (!body.typeIntervention) {
      return NextResponse.json(
        { success: false, error: 'Type d’intervention requis.' },
        { status: 400 }
      );
    }

    const log = await dbService.addMaintenanceLog(params.id, body);
    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding maintenance log:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

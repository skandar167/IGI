import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await dbService.getAssetById(params.id);
    if (!asset) {
      return NextResponse.json({ success: false, error: 'Bien non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: asset });
  } catch (error: any) {
    console.error('Error fetching asset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await dbService.updateAsset(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Bien non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ok = await dbService.deleteAsset(params.id);
    return NextResponse.json({ success: ok });
  } catch (error: any) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

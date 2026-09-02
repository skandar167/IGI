import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const site = searchParams.get('site') || undefined;
    const statut = searchParams.get('statut') || undefined;
    const search = searchParams.get('search') || undefined;

    const assets = await dbService.getAssets({ categoryId, site, statut, search });
    return NextResponse.json({ success: true, data: assets });
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.nom || !body.numeroInventaire || !body.categoryId) {
      return NextResponse.json(
        { success: false, error: 'Nom, numéro d’inventaire et catégorie requis.' },
        { status: 400 }
      );
    }

    const created = await dbService.createAsset(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

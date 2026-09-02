import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { estApprouve } = body;

    if (typeof estApprouve !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Paramètre estApprouve invalide.' },
        { status: 400 }
      );
    }

    const updated = await dbService.updateUserApproval(params.id, estApprouve);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur introuvable.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: estApprouve
        ? 'Compte utilisateur approuvé avec succès.'
        : 'Accès utilisateur suspendu.',
    });
  } catch (error: any) {
    console.error('Error approving user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la mise à jour.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ok = await dbService.deleteUser(params.id);
    return NextResponse.json({
      success: ok,
      message: 'Utilisateur supprimé.',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de la suppression.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbService } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, email, password, departement } = body;

    if (!nom || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Veuillez remplir tous les champs obligatoires (nom, email, mot de passe).' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Format d’adresse email invalide.' },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit comporter au moins 6 caractères.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await dbService.getUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Un compte avec cette adresse e-mail existe déjà.' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(String(password), 12);

    // Create user with pending approval
    const newUser = await dbService.createUser({
      nom: String(nom).trim(),
      email: cleanEmail,
      passwordHash,
      departement: departement ? String(departement).trim() : 'Opérations',
      role: 'EMPLOYE',
      estApprouve: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Demande d’accès enregistrée avec succès. Votre compte doit être approuvé par un administrateur.',
      user: {
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
        estApprouve: newUser.estApprouve,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/auth/register:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors de l’inscription.' },
      { status: 500 }
    );
  }
}

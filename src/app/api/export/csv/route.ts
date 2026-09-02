import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET() {
  try {
    const assets = await dbService.getAssets();

    const headers = [
      'Numéro Inventaire',
      'Nom du Bien',
      'Catégorie',
      'Statut',
      'Site',
      'Bâtiment',
      'Service',
      'Date Acquisition',
      'Valeur Acquisition (DA TTC)',
      'Valeur Amortie (DA TTC)',
      'Fournisseur',
      'N° Facture',
      'Immatriculation',
      'Kilométrage',
      'Prochain Contrôle Technique',
      'Échéance Assurance',
    ];

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = assets.map((a) => [
      escapeCsv(a.numeroInventaire),
      escapeCsv(a.nom),
      escapeCsv(a.category?.nom || 'Autre'),
      escapeCsv(a.statut),
      escapeCsv(a.site),
      escapeCsv(a.batiment || ''),
      escapeCsv(a.service || ''),
      escapeCsv(new Date(a.dateAcquisition).toLocaleDateString('fr-FR')),
      escapeCsv(a.valeurAcquisition.toString()),
      escapeCsv(a.valeurActuelle.toString()),
      escapeCsv(a.fournisseur || ''),
      escapeCsv(a.numeroFacture || ''),
      escapeCsv(a.vehicle?.immatriculation || ''),
      escapeCsv(a.vehicle?.kilometrage?.toString() || ''),
      escapeCsv(a.vehicle?.dateProchainControle ? new Date(a.vehicle.dateProchainControle).toLocaleDateString('fr-FR') : ''),
      escapeCsv(a.vehicle?.dateEcheanceAssurance ? new Date(a.vehicle.dateEcheanceAssurance).toLocaleDateString('fr-FR') : ''),
    ]);

    // Add UTF-8 BOM for Excel compatibility
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="inventaire_immobilisations_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json({
    equipment: db.equipment || [],
    alerts: db.alerts || [],
    equipmentStats: db.equipmentStats || []
  });
}

import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const { blocks } = getDB();
    return NextResponse.json(blocks || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getActuals, setActuals } from '@/lib/db';
import { t } from '@/lib/i18n';

export async function GET() {
  try {
    const actuals = await getActuals();
    return NextResponse.json({ success: true, data: actuals });
  } catch (error) {
    console.error('Error fetching actuals:', error);
    return NextResponse.json(
      { success: false, error: t('api.error.fetch') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, weight, length, unibrow } = body ?? {};

    if (
      !date ||
      typeof date !== 'string' ||
      typeof weight !== 'number' ||
      Number.isNaN(weight) ||
      typeof length !== 'number' ||
      Number.isNaN(length) ||
      typeof unibrow !== 'boolean'
    ) {
      return NextResponse.json(
        { success: false, error: t('api.validation.actuals') || 'Invalid payload' },
        { status: 400 }
      );
    }

    const saved = await setActuals({
      date,
      weight,
      length,
      unibrow
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving actuals:', error);
    return NextResponse.json(
      { success: false, error: t('api.error.create') },
      { status: 500 }
    );
  }
}

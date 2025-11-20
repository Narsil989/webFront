import { NextRequest, NextResponse } from 'next/server';
import { getItems, addItem } from '@/lib/db';
import { t } from '@/lib/i18n';

// GET /api/items - List all items
export async function GET(request: NextRequest) {
  try {
    const items = await getItems();

    return NextResponse.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, error: t('api.error.fetch') },
      { status: 500 }
    );
  }
}

// POST /api/items - Create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.yourName || typeof body.yourName !== 'string') {
      return NextResponse.json(
        { success: false, error: t('api.validation.name') },
        { status: 400 }
      );
    }

    if (!body.davidDateOfBirth || !body.davidWeight || !body.davidLength) {
      return NextResponse.json(
        { success: false, error: t('api.validation.david') },
        { status: 400 }
      );
    }

    const newItem = await addItem({
      yourName: body.yourName,
      davidDateOfBirth: body.davidDateOfBirth,
      davidWeight: body.davidWeight,
      davidLength: body.davidLength,
      hasUnibrow: body.hasUnibrow || false
    });

    return NextResponse.json(
      { success: true, data: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, error: t('api.error.create') },
      { status: 500 }
    );
  }
}

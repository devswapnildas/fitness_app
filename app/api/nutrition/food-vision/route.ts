import { NextRequest, NextResponse } from 'next/server';
import { MLClient } from '@/lib/ml-client';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const hint = (formData.get('hint') as string) || '';

    const filename = file ? file.name : 'food_plate.jpg';

    const result = await MLClient.classifyFood(filename, hint);

    return NextResponse.json({
      status: 'success',
      ...result,
    });
  } catch (error: any) {
    console.error('Food vision error:', error);
    return NextResponse.json({ error: 'Failed to process food image' }, { status: 500 });
  }
}

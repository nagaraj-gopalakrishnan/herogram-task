import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, instructions, referenceImage } = await request.json();

    if (!title) {
      return NextResponse.json({ success: false, error: 'Missing title' }, { status: 400 });
    }

    const newEntry = await prisma.generatedImage.create({
      data: {
        title,
        instructions,
        referenceImage: referenceImage || null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      id: newEntry.id,
      message: 'Prompt saved. Generation will begin shortly.',
    });
  } catch (error: any) {
    console.error('Error saving request:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
// This route handles saving the prompt and reference image to the database
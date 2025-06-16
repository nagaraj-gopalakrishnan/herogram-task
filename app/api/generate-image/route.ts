import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // use the provided key
});

export async function POST(request: NextRequest) {
  const { title, instructions, referenceImage } = await request.json();

  if (!title) {
    return NextResponse.json({ success: false, error: 'Missing title' }, { status: 400 });
  }

  // 1. Insert placeholder row into DB
  const newEntry = await prisma.generatedImage.create({
    data: {
      title,
      instructions,
      referenceImage: referenceImage || null,
      status: 'creating prompt',
    },
  });

  // 2. Trigger background processing
  triggerImagePipeline(newEntry.id, title, instructions, referenceImage || null);

  // 3. Return early to frontend
  return NextResponse.json({ success: true, id: newEntry.id });
}

// 4. Background image processing
async function triggerImagePipeline(id: number, title: string, instructions: string, referenceImage: string | null) {
  try {
    // ✅ Replace this with actual OpenRouter Gemini 2.5 Pro prompt generation
    const prompt = `${title}: ${instructions}`;

    // Update prompt + set status to "creating image"
    await prisma.generatedImage.update({
      where: { id },
      data: {
        promptIdea: prompt,
        status: 'creating image',
      },
    });

    // Generate image using OpenAI
    const result = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      n: 1,
    });

    const imageUrl = result.data?.[0]?.url;

    if (!imageUrl) throw new Error('Image generation failed');

    // Update DB with result
    await prisma.generatedImage.update({
      where: { id },
      data: {
        imageUrl,
        status: 'done',
      },
    });
  } catch (error) {
    console.error('Image generation failed:', error);
    await prisma.generatedImage.update({
      where: { id },
      data: {
        status: 'failed',
      },
    });
  }
}

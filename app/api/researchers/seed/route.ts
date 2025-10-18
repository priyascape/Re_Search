import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/**
 * POST /api/researchers/seed
 * Seed the database with sample researchers for testing
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDB();

    // Add some sample researchers
    const sampleResearchers = [
      {
        name: 'Yann LeCun',
        affiliation: 'New York University',
        summary: 'Yann LeCun is a French computer scientist working primarily in the fields of machine learning, computer vision, mobile robotics and computational neuroscience. He is the Silver Professor of the Courant Institute of Mathematical Sciences at New York University and Vice President, Chief AI Scientist at Meta.',
        topPapers: [
          {
            title: 'Deep Learning',
            authors: 'Yann LeCun, Yoshua Bengio, Geoffrey Hinton',
            abstract: 'Deep learning allows computational models that are composed of multiple processing layers to learn representations of data with multiple levels of abstraction. These methods have dramatically improved the state-of-the-art in speech recognition, visual object recognition, object detection and many other domains.',
            url: 'https://www.nature.com/articles/nature14539',
            year: '2015',
          },
          {
            title: 'Gradient-Based Learning Applied to Document Recognition',
            authors: 'Yann LeCun, Leon Bottou, Yoshua Bengio, Patrick Haffner',
            abstract: 'Multilayer neural networks trained with the back-propagation algorithm constitute the best example of a successful gradient based learning technique. This paper reviews various methods applied to handwritten character recognition.',
            url: 'https://ieeexplore.ieee.org/document/726791',
            year: '1998',
          },
        ],
      },
      {
        name: 'Geoffrey Hinton',
        affiliation: 'University of Toronto',
        summary: 'Geoffrey Hinton is a British-Canadian cognitive psychologist and computer scientist, most noted for his work on artificial neural networks. He is referred to as the "Godfather of AI" and has received numerous awards including the Turing Award.',
        topPapers: [
          {
            title: 'Deep Neural Networks for Acoustic Modeling in Speech Recognition',
            authors: 'Geoffrey Hinton, Li Deng, Dong Yu, et al.',
            abstract: 'Most current speech recognition systems use hidden Markov models (HMMs) to deal with the temporal variability of speech. We show that deep neural networks can significantly improve acoustic modeling.',
            url: 'https://ieeexplore.ieee.org/document/6296526',
            year: '2012',
          },
          {
            title: 'Reducing the Dimensionality of Data with Neural Networks',
            authors: 'Geoffrey Hinton, R. Salakhutdinov',
            abstract: 'We describe an effective way of initializing the weights that allows deep autoencoder networks to learn low-dimensional codes that work much better than principal components analysis.',
            url: 'https://www.science.org/doi/10.1126/science.1127647',
            year: '2006',
          },
        ],
      },
      {
        name: 'Fei-Fei Li',
        affiliation: 'Stanford University',
        summary: 'Fei-Fei Li is a Chinese-American computer scientist, known for her work on computer vision and artificial intelligence. She is the Sequoia Professor of Computer Science at Stanford University.',
        topPapers: [
          {
            title: 'ImageNet: A Large-Scale Hierarchical Image Database',
            authors: 'Jia Deng, Wei Dong, Richard Socher, Li-Jia Li, Kai Li, Fei-Fei Li',
            abstract: 'The ImageNet project is a large-scale ontology of images built upon the backbone of the WordNet structure. We present an overview of the ImageNet database and discuss its applications.',
            url: 'https://ieeexplore.ieee.org/document/5206848',
            year: '2009',
          },
        ],
      },
    ];

    const stored = [];
    for (const researcher of sampleResearchers) {
      const result = db.upsert(researcher);
      stored.push(result);
      console.log(`✅ Seeded researcher: ${result.name}`);
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${stored.length} researchers`,
      data: stored,
    });
  } catch (error) {
    console.error('❌ Error seeding researchers:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

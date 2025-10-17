/**
 * Demo data for the neurips-talent-bridge app
 */

export interface Researcher {
  id: string;
  name: string;
  institution: string;
  papers: string[];
  interests: string[];
  profileUrl?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
}

export const demoResearchers: Researcher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    institution: 'MIT',
    papers: [
      'Attention Is All You Need: A Comprehensive Survey',
      'Scaling Laws for Neural Language Models',
      'Self-Supervised Learning in Computer Vision',
    ],
    interests: ['Deep Learning', 'NLP', 'Transformer Architectures'],
    profileUrl: 'https://example.com/sarah-chen',
  },
  {
    id: '2',
    name: 'Prof. James Kumar',
    institution: 'Stanford University',
    papers: [
      'Graph Neural Networks for Molecular Property Prediction',
      'Few-Shot Learning with Meta-Learning',
      'Reinforcement Learning in Robotics',
    ],
    interests: ['Graph Neural Networks', 'Meta-Learning', 'Reinforcement Learning'],
  },
  {
    id: '3',
    name: 'Dr. Maria Rodriguez',
    institution: 'UC Berkeley',
    papers: [
      'Diffusion Models for Image Generation',
      'Adversarial Robustness in Deep Learning',
      'Neural Architecture Search: A Survey',
    ],
    interests: ['Generative Models', 'Computer Vision', 'Neural Architecture Search'],
  },
  {
    id: '4',
    name: 'Dr. Alex Thompson',
    institution: 'Carnegie Mellon',
    papers: [
      'Efficient Training of Large Language Models',
      'Federated Learning in Healthcare Applications',
      'Privacy-Preserving Machine Learning',
    ],
    interests: ['Distributed Learning', 'Privacy', 'Healthcare AI'],
  },
];

export const demoJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior ML Research Scientist',
    company: 'OpenAI',
    description: 'Looking for a researcher to work on large language models and transformer architectures.',
    requirements: [
      'PhD in Computer Science or related field',
      'Experience with transformers and NLP',
      'Publications at top-tier conferences',
    ],
  },
  {
    id: '2',
    title: 'Computer Vision Engineer',
    company: 'Tesla',
    description: 'Develop state-of-the-art computer vision models for autonomous driving.',
    requirements: [
      'Strong background in computer vision',
      'Experience with deep learning frameworks',
      'Real-time systems experience',
    ],
  },
];

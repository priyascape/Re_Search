/**
 * Demo data for the NeurIPS Talent Bridge app
 * This allows the app to work without constantly hitting the Perplexity API
 */

// ============================================================================
// Types
// ============================================================================

export interface Researcher {
  id: string;
  name: string;
  institution: string;
  location: string;
  bio: string;
  profileImage?: string;
  stats: {
    publications: number;
    citations: number;
    hIndex: number;
  };
  featuredPaper: {
    title: string;
    authors: string;
    conference: string;
    abstract: string;
    topics: string[];
    citations: number;
    githubUrl?: string;
  };
  recentPapers: Array<{
    title: string;
    authors: string;
    conference: string;
    citations: number;
  }>;
  papers: string[]; // Legacy format for compatibility
  interests: string[];
  experience: string[];
  funding: {
    needed: number;
    breakdown: Array<{ item: string; amount: number }>;
  };
  profileUrl?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string;
  conference: string;
  year: number;
  abstract: string;
  topics: string[];
  citations: number;
  url?: string;
  githubUrl?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  match: number;
  funding: number;
  reasons: string[];
  interests: string[];
  description: string;
  website?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  fullDescription?: string;
}

// ============================================================================
// Researchers
// ============================================================================

export const DEMO_RESEARCHERS: Researcher[] = [
  {
    id: 'sarah-chen',
    name: 'Dr. Sarah Chen',
    institution: 'University of São Paulo',
    location: 'São Paulo, Brazil',
    bio: 'Assistant Professor of Computer Science specializing in AI Safety and Alignment. My research focuses on developing scalable oversight mechanisms for advanced AI systems, with particular emphasis on debate-based approaches and interpretability. Previously at OpenAI and DeepMind Research. PhD from Stanford University (2019).',
    stats: {
      publications: 23,
      citations: 1847,
      hIndex: 31,
    },
    featuredPaper: {
      title: 'Scalable Oversight of AI Systems via Debate',
      authors: 'S Chen, M Rodriguez, A Kumar, J Thompson',
      conference: 'NeurIPS 2024 (Oral Presentation)',
      abstract: 'We present a novel framework for scalable oversight of advanced AI systems using structured debate protocols. Our approach enables human evaluators to judge the safety and alignment of AI systems performing tasks beyond human expertise by observing debates between AI agents. We demonstrate that debate-based oversight scales to complex domains including mathematical reasoning, code generation, and strategic planning, achieving 89% accuracy in detecting misaligned behavior. Our method significantly outperforms traditional oversight mechanisms while requiring 10x less human evaluation time.',
      topics: ['AI Safety', 'Alignment', 'Scalable Oversight', 'Debate', 'Interpretability'],
      citations: 247,
      githubUrl: 'https://github.com/sarahchen/debate-oversight',
    },
    recentPapers: [
      {
        title: 'Constitutional AI: Training Language Models to be Helpful, Harmless, and Honest',
        authors: 'S Chen, R Patel, L Williams',
        conference: 'ICML 2024',
        citations: 189,
      },
      {
        title: 'Recursive Reward Modeling for Training Aligned AI Systems',
        authors: 'M Rodriguez, S Chen, A Kumar',
        conference: 'NeurIPS 2023',
        citations: 312,
      },
      {
        title: 'Mechanistic Interpretability in Large Language Models',
        authors: 'S Chen, J Thompson, K Lee',
        conference: 'ICLR 2023',
        citations: 421,
      },
    ],
    papers: [
      'Scalable Oversight of AI Systems via Debate',
      'Constitutional AI: Training Language Models to be Helpful, Harmless, and Honest',
      'Recursive Reward Modeling for Training Aligned AI Systems',
    ],
    interests: ['AI Safety', 'Alignment', 'Scalable Oversight', 'Machine Learning', 'Interpretability'],
    experience: [
      'Research Scientist at OpenAI (2020-2022): Led safety research initiatives',
      'Research Intern at DeepMind (2018-2019): Worked on interpretability projects',
      'PhD from Stanford University (2015-2019): Advised by Prof. Andrew Ng',
    ],
    funding: {
      needed: 4500,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (São Paulo → Vancouver)', amount: 1800 },
        { item: 'Accommodation (5 nights)', amount: 1500 },
      ],
    },
  },
  {
    id: 'michael-zhang',
    name: 'Dr. Michael Zhang',
    institution: 'Tsinghua University',
    location: 'Beijing, China',
    bio: 'Assistant Professor specializing in reinforcement learning and AI alignment through hierarchical approaches.',
    stats: {
      publications: 18,
      citations: 1342,
      hIndex: 27,
    },
    featuredPaper: {
      title: 'Hierarchical Reinforcement Learning for Aligned AI Agents',
      authors: 'M Zhang, L Wang, K Chen',
      conference: 'NeurIPS 2024',
      abstract: 'We propose a hierarchical reinforcement learning framework that incorporates human preferences at multiple levels of abstraction, enabling more nuanced alignment of AI agents with complex human values.',
      topics: ['RLHF', 'Alignment', 'Hierarchical RL', 'Multi-Agent Systems'],
      citations: 189,
      githubUrl: 'https://github.com/mzhang/hierarchical-rlhf',
    },
    recentPapers: [
      {
        title: 'Value Alignment in Multi-Agent Systems',
        authors: 'M Zhang, S Liu',
        conference: 'ICML 2024',
        citations: 156,
      },
    ],
    papers: [
      'Hierarchical Reinforcement Learning for Aligned AI Agents',
      'Value Alignment in Multi-Agent Systems',
    ],
    interests: ['RLHF', 'Alignment', 'Hierarchical RL', 'Multi-Agent Systems'],
    experience: [
      'Assistant Professor at Tsinghua University (2021-present)',
      'Visiting Scholar at UC Berkeley (2020-2021)',
    ],
    funding: {
      needed: 4500,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (Beijing → Vancouver)', amount: 2000 },
        { item: 'Accommodation (5 nights)', amount: 1300 },
      ],
    },
  },
  {
    id: 'emma-williams',
    name: 'Prof. Emma Williams',
    institution: 'MIT',
    location: 'Cambridge, MA, USA',
    bio: 'Associate Professor focusing on interpretability and causal reasoning in AI systems.',
    stats: {
      publications: 31,
      citations: 2456,
      hIndex: 34,
    },
    featuredPaper: {
      title: 'Interpretability Through Causal Mechanisms in Neural Networks',
      authors: 'E Williams, R Patel, S Johnson',
      conference: 'NeurIPS 2024',
      abstract: 'We introduce a causal framework for understanding neural network decision-making, enabling more reliable interpretability of complex AI systems through identification of causal mechanisms.',
      topics: ['Interpretability', 'Causality', 'Neural Networks', 'Explainability'],
      citations: 312,
    },
    recentPapers: [
      {
        title: 'Causal Abstraction in Deep Learning',
        authors: 'E Williams, K Brown',
        conference: 'ICML 2024',
        citations: 278,
      },
    ],
    papers: [
      'Interpretability Through Causal Mechanisms in Neural Networks',
      'Causal Abstraction in Deep Learning',
    ],
    interests: ['Interpretability', 'Causality', 'Neural Networks', 'Explainability'],
    experience: [
      'Associate Professor at MIT (2019-present)',
      'Research Scientist at Google Brain (2016-2019)',
    ],
    funding: {
      needed: 3800,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (Boston → Vancouver)', amount: 800 },
        { item: 'Accommodation (5 nights)', amount: 1800 },
      ],
    },
  },
  {
    id: 'raj-patel',
    name: 'Dr. Raj Patel',
    institution: 'Stanford University',
    location: 'Stanford, CA, USA',
    bio: 'Postdoctoral researcher focusing on adversarial robustness and LLM security.',
    stats: {
      publications: 19,
      citations: 1123,
      hIndex: 25,
    },
    featuredPaper: {
      title: 'Adversarial Robustness in Large Language Models',
      authors: 'R Patel, K Lee, A Thompson',
      conference: 'NeurIPS 2024',
      abstract: 'We analyze adversarial vulnerabilities in large language models and propose defense mechanisms that maintain model capabilities while improving robustness to adversarial inputs.',
      topics: ['Adversarial ML', 'LLM Safety', 'Robustness', 'Security'],
      citations: 167,
    },
    recentPapers: [
      {
        title: 'Defense Mechanisms for Neural Networks',
        authors: 'R Patel, M Johnson',
        conference: 'ICLR 2024',
        citations: 134,
      },
    ],
    papers: [
      'Adversarial Robustness in Large Language Models',
      'Defense Mechanisms for Neural Networks',
    ],
    interests: ['Adversarial ML', 'LLM Safety', 'Robustness', 'Security'],
    experience: [
      'Postdoctoral Researcher at Stanford (2022-present)',
      'PhD from Carnegie Mellon University (2022)',
    ],
    funding: {
      needed: 4000,
      breakdown: [
        { item: 'Conference Registration', amount: 1200 },
        { item: 'Travel (San Francisco → Vancouver)', amount: 600 },
        { item: 'Accommodation (5 nights)', amount: 2200 },
      ],
    },
  },
];

// ============================================================================
// Similar Papers (Related Research)
// ============================================================================

export const SIMILAR_PAPERS: Paper[] = [
  {
    id: 'similar-1',
    title: 'Language Models as Agent Models',
    authors: 'J. Andreas et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'We investigate the use of language models as models of rational agents, exploring how they can be used for decision-making tasks beyond simple text generation.',
    topics: ['LLMs', 'Agent Systems', 'Decision Making'],
    citations: 156,
    url: 'https://arxiv.org/abs/2024.agent.models',
  },
  {
    id: 'similar-2',
    title: 'Mechanistic Interpretability via Sparse Autoencoders',
    authors: 'T. Henighan, N. Elhage et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'We introduce sparse autoencoders as a tool for mechanistic interpretability, enabling better understanding of neural network internals through feature extraction.',
    topics: ['Interpretability', 'Neural Networks', 'Analysis'],
    citations: 203,
    url: 'https://arxiv.org/abs/2024.sparse.ae',
  },
  {
    id: 'similar-3',
    title: 'Constitutional AI: Learning from Human Feedback',
    authors: 'Y. Bai, A. Jones et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'We present constitutional AI, a method for training AI systems to be helpful, harmless, and honest through AI-generated feedback based on constitutional principles.',
    topics: ['Alignment', 'RLHF', 'Safety'],
    citations: 341,
    url: 'https://arxiv.org/abs/2212.08073',
  },
  {
    id: 'similar-4',
    title: 'Debate-Based Oversight of Frontier AI Systems',
    authors: 'M. Khan, S. Brown et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'We explore debate as a scalable oversight mechanism for frontier AI systems, demonstrating its effectiveness in complex domains.',
    topics: ['Oversight', 'Debate', 'AI Safety'],
    citations: 198,
    url: 'https://arxiv.org/abs/2024.debate.frontier',
  },
];

// ============================================================================
// Trending Papers (Hot Research)
// ============================================================================

export const TRENDING_PAPERS: Paper[] = [
  {
    id: 'trending-1',
    title: 'Language Models as Agent Models',
    authors: 'J. Andreas et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'We investigate the use of language models as models of rational agents.',
    topics: ['LLMs', 'Agent Systems', 'Decision Making'],
    citations: 156,
    url: 'https://arxiv.org/abs/2024.agent.models',
  },
  {
    id: 'trending-2',
    title: 'Mechanistic Interpretability via Sparse Autoencoders',
    authors: 'T. Henighan, N. Elhage et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'Sparse autoencoders as a tool for mechanistic interpretability.',
    topics: ['Interpretability', 'Neural Networks', 'Analysis'],
    citations: 203,
    url: 'https://arxiv.org/abs/2024.sparse.ae',
  },
  {
    id: 'trending-3',
    title: 'Scaling Monosemanticity: Extracting Interpretable Features',
    authors: 'Anthropic Research',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'Extracting interpretable features from neural networks at scale.',
    topics: ['Interpretability', 'Feature Extraction', 'Scaling'],
    citations: 287,
    url: 'https://arxiv.org/abs/2024.monosemantic',
  },
  {
    id: 'trending-4',
    title: 'Constitutional AI: Learning from Human Feedback',
    authors: 'Y. Bai, A. Jones et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'Constitutional approach to AI alignment through feedback.',
    topics: ['Alignment', 'RLHF', 'Safety'],
    citations: 341,
    url: 'https://arxiv.org/abs/2212.08073',
  },
  {
    id: 'trending-5',
    title: 'Debate-Based Oversight of Frontier AI Systems',
    authors: 'M. Khan, S. Brown et al.',
    conference: 'NeurIPS 2024',
    year: 2024,
    abstract: 'Debate as a scalable oversight mechanism for frontier AI.',
    topics: ['Oversight', 'Debate', 'AI Safety'],
    citations: 198,
    url: 'https://arxiv.org/abs/2024.debate.frontier',
  },
];

// ============================================================================
// Potential Sponsors
// ============================================================================

export const POTENTIAL_SPONSORS: Sponsor[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '🔮',
    match: 96,
    funding: 4500,
    reasons: [
      'Your debate-based oversight research directly aligns with their Constitutional AI approach',
      'Strong track record in scalable oversight mechanisms',
      'Previous collaboration experience with OpenAI and DeepMind',
      'Focus on AI safety and alignment matches their core mission',
    ],
    interests: ['AI Safety', 'Alignment', 'Scalable Oversight', 'Interpretability'],
    description: 'AI safety and research company working to build reliable, interpretable, and steerable AI systems.',
    website: 'https://www.anthropic.com',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '⚡',
    match: 89,
    funding: 4500,
    reasons: [
      'Expertise in debate protocols complements their safety research initiatives',
      'Published work on recursive reward modeling aligns with RLHF research',
      'Strong publication record in top-tier ML conferences',
      'Interest in mechanistic interpretability research',
    ],
    interests: ['Alignment', 'RLHF', 'Debate', 'Safety Research'],
    description: 'AI research and deployment company focused on ensuring AGI benefits all of humanity.',
    website: 'https://openai.com',
  },
  {
    id: 'deepmind',
    name: 'DeepMind',
    logo: '🧠',
    match: 87,
    funding: 3800,
    reasons: [
      'Research on scalable oversight fits with their AI safety agenda',
      'Constitutional AI work relevant to their ethics initiatives',
      'Strong academic background with Stanford PhD',
      'Track record of high-impact publications',
    ],
    interests: ['AI Safety', 'Ethics', 'Reinforcement Learning'],
    description: 'AI research lab aiming to solve intelligence and advance scientific discovery.',
    website: 'https://deepmind.com',
  },
  {
    id: 'redwood',
    name: 'Redwood Research',
    logo: '🌲',
    match: 85,
    funding: 4000,
    reasons: [
      'Specialized focus on AI safety and alignment research',
      'Debate-based oversight directly applicable to their work',
      'Strong emphasis on interpretability and mechanistic understanding',
      'Collaborative research culture matches your background',
    ],
    interests: ['AI Safety', 'Alignment', 'Interpretability'],
    description: 'Research organization focused on AI alignment and safety.',
    website: 'https://redwoodresearch.org',
  },
];

// ============================================================================
// Demo Job Postings
// ============================================================================

export const DEMO_JOBS: JobPosting[] = [
  {
    id: 'anthropic-safety',
    title: 'AI Safety Research Scientist',
    company: 'Anthropic',
    description: 'Seeking exceptional research scientists to join our AI Safety team working on alignment, scalable oversight, and interpretability research.',
    requirements: [
      'PhD in Computer Science, Machine Learning, or related field',
      'Strong publication record in AI safety, alignment, or interpretability',
      'Experience with debate-based oversight or constitutional AI',
      'Deep understanding of large language models',
    ],
    fullDescription: `AI Safety Research Scientist - Anthropic

About Anthropic:
Anthropic is an AI safety and research company working to build reliable, interpretable, and steerable AI systems. We're committed to ensuring that artificial intelligence has a positive impact on the world.

Role Overview:
We're seeking exceptional research scientists to join our AI Safety team. You'll work on cutting-edge problems in AI alignment, scalable oversight, and interpretability research.

Key Responsibilities:
• Conduct novel research on AI safety, alignment, and oversight mechanisms
• Develop and implement scalable methods for evaluating AI system behavior
• Collaborate with cross-functional teams to integrate safety techniques
• Publish research findings in top-tier venues (NeurIPS, ICML, ICLR, etc.)

Required Qualifications:
• PhD in Computer Science, Machine Learning, or related field
• Strong publication record in AI safety, alignment, interpretability
• Deep understanding of machine learning, particularly large language models
• Experience with debate-based oversight, constitutional AI, or scalable supervision
• Excellent communication skills

What We Offer:
• Competitive compensation and equity packages
• Opportunity to work on some of the most important problems in AI
• Collaborative research environment
• Conference travel and professional development budget`,
  },
  {
    id: 'openai-alignment',
    title: 'Alignment Research Scientist',
    company: 'OpenAI',
    description: 'Join our alignment team to develop techniques for ensuring AI systems are helpful, harmless, and aligned with human values.',
    requirements: [
      'PhD with focus on ML, AI safety, or related areas',
      'Experience with RLHF or reward modeling',
      'Strong publication record at top ML conferences',
      'Programming expertise in Python, PyTorch/TensorFlow',
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

export function getResearcherById(id: string): Researcher | undefined {
  return DEMO_RESEARCHERS.find(r => r.id === id);
}

export function getSponsorById(id: string): Sponsor | undefined {
  return POTENTIAL_SPONSORS.find(s => s.id === id);
}

export function getPaperById(id: string): Paper | undefined {
  return [...SIMILAR_PAPERS, ...TRENDING_PAPERS].find(p => p.id === id);
}

export function getJobById(id: string): JobPosting | undefined {
  return DEMO_JOBS.find(j => j.id === id);
}

// Legacy exports for backward compatibility
export const demoResearchers = DEMO_RESEARCHERS;
export const demoJobs = DEMO_JOBS;

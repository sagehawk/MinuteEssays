import { SectionConfig } from './types';

export const TOTAL_TIME_LIMIT_SECONDS = 300; // 5 minutes

export const SECTIONS: SectionConfig[] = [
  {
    id: 'intro',
    title: 'Introduction',
    description: 'Hook the reader and state your thesis clearly.',
    suggestedWordCount: 50,
  },
  {
    id: 'point1',
    title: 'Key Point 1',
    description: 'First supporting argument with evidence.',
    suggestedWordCount: 60,
  },
  {
    id: 'point2',
    title: 'Key Point 2',
    description: 'Second supporting argument or counter-point.',
    suggestedWordCount: 60,
  },
  {
    id: 'point3',
    title: 'Key Point 3',
    description: 'Third supporting argument or practical application.',
    suggestedWordCount: 60,
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    description: 'Summarize main points and provide a final thought.',
    suggestedWordCount: 50,
  },
];

export const TOPICS = [
  "Does social media do more harm than good?",
  "Should remote work be the standard for all office jobs?",
  "Is artificial intelligence a threat to human creativity?",
  "Should higher education be free for everyone?",
  "The importance of failure in personal growth.",
  "Should space exploration be privatized?",
  "Is a universal basic income feasible?",
  "The impact of fast fashion on the environment.",
  "Should voting be mandatory?",
  "The future of public transportation in mega-cities."
];
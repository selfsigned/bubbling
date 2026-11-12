import type { ChatTurn } from './components/ui/ai-chat/ai-chat-thread.svelte';
import racerAvatar from '../../assets/persona-racer-avatar.webp?url&no-inline';
import mechanicAvatar from '../../assets/persona-mechanic-avatar.webp?url&no-inline';

export const oilPrompt = 'What do 30yo enthusiasts think of REDLINE RS 5W-40?';

// Scripted concept dialogue: REDLINE RS is fictional, not a tested recommendation.
export const heroConversations = [
  {
    assistant: 'chatgpt' as const,
    avatar: racerAvatar,
    turns: [
      {
        question: 'My GTI does road miles and the odd track day. Is REDLINE RS 5W-40 worth a look?',
        response: [
          { text: 'Potentially, if it carries your engine’s required approval. ' },
          { text: 'Heat protection', highlight: 'positive' },
          { text: ' matters on track, but ' },
          { text: 'I’d want the data sheet', highlight: 'concern' },
          { text: ', not just “RS” on the bottle.' },
        ],
      },
      {
        question: 'Oil hits 125°C on track. Would you switch from my usual 5W-40?',
        response: [
          { text: 'I’d compare ' },
          { text: 'REDLINE RS', highlight: 'brand' },
          { text: ' with your current oil’s approvals and high-temperature viscosity first. ' },
          { text: 'Worth considering', highlight: 'positive' },
          { text: ' if the specs stack up; ' },
          { text: 'the name alone isn’t a reason to switch', highlight: 'concern' },
          { text: '.' },
        ],
      },
    ] satisfies ChatTurn[],
  },
  {
    assistant: 'claude' as const,
    avatar: mechanicAvatar,
    turns: [
      {
        question: 'Owner forum is hyping REDLINE RS 5W-40. €65 for 5L. Worth it for school runs and weekend tinkering?',
        mood: 'grumpy' as const,
        response: [
          { text: 'Your hatchback is doing the school run, not qualifying at Le Mans. If your current oil meets the manual’s spec, ' },
          { text: 'I’d keep the extra cash', highlight: 'concern' },
          { text: '. ' },
          { text: 'Forum enthusiasm isn’t a test result', highlight: 'concern' },
          { text: '.' },
        ],
      },
      {
        question: 'So the fancy bottle doesn’t add horsepower? Devastating.',
        mood: 'skeptical' as const,
        response: [
          { text: 'Tragic, I know. ' },
          { text: 'REDLINE RS', highlight: 'brand' },
          { text: ' might be perfectly good oil, but ' },
          { text: 'I can’t justify the premium', highlight: 'concern' },
          { text: ' without approvals and independent tests. Spend it on the next service, not the label.' },
        ],
      },
    ] satisfies ChatTurn[],
  },
];

import type { PageServerLoad } from './$types';

export interface Question {
  q: string;
  a: string[];
}

export interface Quiz {
  title: string;
  questions: Question[];
}

const quizzes: Quiz[] = [
  {
    title: 'Basics of Economics',
    questions: [
      {
        q: 'What are economic goods?',
        a: [
          'Goods with limited availability and have a cost',
          'Goods with unlimited availability',
          'Goods that are intangible',
          'Goods that are only consumed by businesses',
        ],
      },
      {
        q: 'What is the difference between a need and a demand?',
        a: [
          'A need is a basic requirement, while demand is a need backed by purchasing power',
          'A need is temporary, while demand is constant',
          'A need is a luxury item, while demand is a basic requirement',
          'A need is something produced, while demand is something consumed',
        ],
      },
      {
        q: 'What does the St. Galler Management Model aim to represent?',
        a: [
          'A business embedded in its environment',
          'A business maximizing profits and efficiency',
          'A business effectively competing with others',
          'A business creating a strong corporate culture',
        ],
      },
      {
        q: 'What is the purpose of a SWOT analysis?',
        a: [
          "To analyze a company's internal strengths, weaknesses and external opportunities, threats",
          'To determine the best time to enter a market',
          'To determine future demand for a product',
          "To analyze a company's financial condition",
        ],
      },
      {
        q: 'What is the PESTLE analysis used for?',
        a: [
          'To analyze the influence of six external environmental factors on a company',
          'To analyze the feasibility of a new product',
          "To evaluate employees' performance",
          'To analyze customer satisfaction',
        ],
      },
      {
        q: "What is the main purpose of Porter's Five Forces Model?",
        a: [
          'To determine the attractiveness of a market',
          'To understand the profit potential of a business',
          "To analyze the company's financial stability",
          "To analyze a company's value chain",
        ],
      },
      {
        q: 'What are the four product-market strategies according to Ansoff?',
        a: [
          'Market penetration, market development, product development, diversification',
          'Introduction, growth, maturity, decline',
          'Cost leadership, differentiation, cost focus, differentiation focus',
          'Low cost, high quality, innovation, customer service',
        ],
      },
      {
        q: 'What does a differentiation strategy involve?',
        a: [
          'Offering a unique product or service that stands out in the market',
          'Achieving the lowest costs in the market',
          'Offering a product or service for a specific market segment',
          'Developing a new product for an existing market',
        ],
      },
      {
        q: 'What do core competencies provide a company?',
        a: [
          'Sustainable competitive advantage',
          'Constant increase in revenue',
          'A guarantee of success',
          'Exclusive rights to sell a product',
        ],
      },
      {
        q: 'What is the aim of a cost leadership strategy?',
        a: [
          'To achieve the lowest cost of production in a market',
          'To have the highest profit margins',
          'To offer the highest quality products',
          'To offer the most innovative products',
        ],
      },
      {
        q: 'What is the purpose of the business strategy?',
        a: [
          'To set the direction and scope for the company to achieve a competitive advantage',
          'To maximize profits as fast as possible',
          'To engage in market competition for market share',
          'To develop the best product in a market',
        ],
      },
      {
        q: 'What are free goods?',
        a: [
          'Goods with unlimited availability and without a cost',
          'Goods without any demand',
          'Goods that are part of nature',
          'Goods that can be obtained easily through bartering',
        ],
      },
    ],
  },
];

export const load = (async ({ params }) => {
  return {
    quizzes,
  };
}) satisfies PageServerLoad;

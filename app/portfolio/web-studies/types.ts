export type WebsiteStudyRecord = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  oneLiner: string;
  summary: string;
  challenge: string;
  outcome: string;
  decisions: readonly (readonly [title: string, body: string])[];
  flow: readonly string[];
  tags: readonly string[];
  accent: string;
};

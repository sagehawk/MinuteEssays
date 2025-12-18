import { EssayData } from "../types";
import { SECTIONS } from "../constants";

export const generateReviewPrompt = (essay: EssayData): string => {
  // Construct the essay text for the prompt
  let fullEssayText = `Topic: ${essay.topic}\n\n`;
  SECTIONS.forEach(section => {
    fullEssayText += `[${section.title}]\n${essay.sections[section.id] || '(No content)'}\n\n`;
  });

  return `You are an expert writing coach and editor. A student has just written a "Minute Essay" under strict time constraints (5 minutes total).

Here is their essay:
---
${fullEssayText}
---

Please provide a concise but helpful review.
1. Rate the flow and clarity (out of 10).
2. Identify 2 strong points (Pros).
3. Identify 2 areas for improvement (Cons/Constructive Feedback).
4. Give a brief overall comment on how well they defended the topic given the time limit.

Format the output in clear Markdown. Be encouraging but honest.`;
};
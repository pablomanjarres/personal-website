import { getCaseStudy, studyText } from "./case-study";
import type { ProjectStudy } from "./data";

const comparable = (text: string) => studyText(text).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

export function getTechnicalNotes(study: ProjectStudy) {
  const project = study.project;
  const story = getCaseStudy(study);
  const visibleProse = [story.introduction, story.challenge, story.responsibility, story.outcome].map(comparable);
  const visibleChoices = story.decisions.map(choice => comparable(`${choice.title}. ${choice.body}`));
  const visibleMeasures = story.measures.map(measure => comparable(`${measure.value} ${measure.label}`));
  return {
    problem: visibleProse.includes(comparable(project.problem)) ? "" : studyText(project.problem),
    overview: project.summary.split(/\n{2,}/).map(studyText).filter(paragraph => paragraph && !visibleProse.includes(comparable(paragraph))),
    highlights: project.highlights.filter(highlight => !visibleChoices.some(choice => choice.includes(comparable(highlight)))).map(studyText),
    metrics: (project.metrics ?? []).filter(metric => !visibleMeasures.includes(comparable(metric))).map(studyText),
    parts: (project.subProjects ?? []).filter(part => !story.components.some(component =>
      comparable(component.name) === comparable(part.name) && comparable(component.body) === comparable(part.oneLiner) && component.kind === part.kind)),
    stack: project.stack,
    tags: project.tags,
  };
}

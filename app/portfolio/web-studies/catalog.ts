import { operations } from "./operations";
import { commerce } from "./commerce";
import { places } from "./places";
import { culture } from "./culture";
import { everyday } from "./everyday";
import { originals } from "./originals";
import {
  buildCaseStudy,
  buildInterfaceViews,
  buildMedia,
  buildProject,
} from "./build-study";
import type { WebsiteStudyRecord } from "./types";

export const websiteRecords: readonly WebsiteStudyRecord[] = [
  ...operations,
  ...commerce,
  ...places,
  ...culture,
  ...everyday,
  ...originals,
];
const records = new Map(websiteRecords.map((record) => [record.slug, record]));

export function isWebsiteStudy(slug: string) {
  return records.has(slug);
}

export function createWebsiteProjects(offset: number) {
  return websiteRecords.map((record, index) =>
    buildProject(record, offset + index + 1),
  );
}

export function getWebsiteCaseStudy(slug: string) {
  const record = records.get(slug);
  return record ? buildCaseStudy(record) : undefined;
}

export function getWebsiteMedia(slug: string) {
  const record = records.get(slug);
  return record ? buildMedia(record) : undefined;
}

export function getWebsiteInterfaceViews(slug: string) {
  const record = records.get(slug);
  return record ? buildInterfaceViews(record) : undefined;
}

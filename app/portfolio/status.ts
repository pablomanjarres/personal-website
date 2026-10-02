import type { ProjectStatus } from "../projects";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "live", shipped: "shipped", wip: "in progress", prototype: "prototype", archived: "archived",
};

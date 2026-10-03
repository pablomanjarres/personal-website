export const openStudioTheme = {
  id: "open-studio", paper: "#f5f7f3", ink: "#183d39", accent: "#146e65", panel: "#dceae5",
} as const;

export const workbenchTheme = {
  ...openStudioTheme, paper: "#fafaf7", ink: "#292b2d", accent: "#e85819",
} as const;

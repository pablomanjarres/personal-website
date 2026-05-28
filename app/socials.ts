export type Social = {
  id: string;
  label: string;
  handle: string;
  url: string;
  num: string;
  icon: string; // path under /public
};

export const profile = {
  name: "Pablo Manjarres",
  age: 17,
  tagline: "Solo founder & content creator",
  building: "Noelle",
  location: "Earth",
  email: "pablo@pablomanjarres.com",
  socials: [
    { id: "ig", label: "Instagram", handle: "@pablomanjarress", url: "https://instagram.com/pablomanjarress", num: "01", icon: "/icons/instagram.svg" },
    { id: "tt", label: "TikTok", handle: "@pablomanjarres.dev", url: "https://tiktok.com/@pablomanjarres.dev", num: "02", icon: "/icons/tiktok.svg" },
    { id: "x", label: "X", handle: "@pablomanjarress", url: "https://x.com/pablomanjarress", num: "03", icon: "/icons/x.png" },
    { id: "in", label: "LinkedIn", handle: "in/pablomanjarres", url: "https://linkedin.com/in/pablomanjarres", num: "04", icon: "/icons/linkedin.png" },
    { id: "rd", label: "Reddit", handle: "u/pablomanjarres", url: "https://reddit.com/user/pablomanjarres", num: "05", icon: "/icons/reddit.svg" },
    { id: "gh", label: "GitHub", handle: "pablomanjarres", url: "https://github.com/pablomanjarres", num: "06", icon: "/icons/github.svg" },
  ] satisfies Social[],
};

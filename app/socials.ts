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
  booking: "https://calendly.com/pablo-pablomanjarres/meet-with-me",
  socials: [
    { id: "x", label: "X", handle: "@pablomanjarress", url: "https://x.com/pablomanjarress", num: "01", icon: "/icons/x.png" },
    { id: "in", label: "LinkedIn", handle: "in/pablomanjarres", url: "https://linkedin.com/in/pablomanjarres", num: "02", icon: "/icons/linkedin.png" },
    { id: "rd", label: "Reddit", handle: "u/pablomanjarres", url: "https://reddit.com/user/pablomanjarres", num: "03", icon: "/icons/reddit.svg" },
    { id: "gh", label: "GitHub", handle: "pablomanjarres", url: "https://github.com/pablomanjarres", num: "04", icon: "/icons/github.svg" },
  ] satisfies Social[],
};

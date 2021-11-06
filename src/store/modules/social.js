export default {
  state: {
    socialItems: [
      {
        icon: require("@/assets/images/social/discord.svg"),
        link: "http://discord.gg/popsicle",
        title: "Discord",
      },
      {
        icon: require("@/assets/images/social/Reddit.svg"),
        link: "https://www.reddit.com/r/Popsicle_Finance/",
        title: "Reddit",
      },
      {
        icon: require("@/assets/images/social/Medium.svg"),
        link: "https://popsiclefinance.medium.com/",
        title: "Medium",
      },
      {
        icon: require("@/assets/images/social/Email.svg"),
        link: "mailto:hello@popsicle.finance",
        title: "Email",
      },
      {
        icon: require("@/assets/images/social/Twitter.svg"),
        link: "https://twitter.com/popsiclefinance",
        title: "Twitter",
      },
    ],
  },

  getters: {
    getSocialItems: (state) => state.socialItems,
  },
};

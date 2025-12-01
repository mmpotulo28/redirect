export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Redirect",
	description: "Simple URL shortener and tracker.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
	],
	navMenuItems: [
		{
			label: "Dashboard",
			href: "/dashboard",
		},
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
		twitter: "https://twitter.com/getnextui",
		docs: "https://nextui.org",
		discord: "https://discord.gg/9b6yyZKmH4",
		sponsor: "https://patreon.com/jrgarciadev",
	},
};

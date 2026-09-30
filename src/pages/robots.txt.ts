import type { APIRoute } from "astro";

import { siteConfig } from "@/config";

// 已通过 featurePages 关闭的页面：构建产物是一个 2 秒后跳转的占位页，
// 不应该被抓取，也不应该出现在 sitemap 里（见 astro.config.mjs 的 sitemap filter）。
const disabledFeaturePaths = [
	"/anime/",
	"/projects/",
	"/skills/",
].filter((_, index) => {
	const flags = [
		siteConfig.featurePages.anime,
		siteConfig.featurePages.projects,
		siteConfig.featurePages.skills,
	];
	return !flags[index];
});

// 只禁抓取接口与已关闭的占位页；其余页面正常放开。
// 注意：不要再加全站 `Disallow: /`，否则 Allow: /posts/ 之类的细则会把整站挡在索引之外。
const disallowLines = ["/api/", ...disabledFeaturePaths]
	.map((path) => `Disallow: ${path}`)
	.join("\n");

const robotsTxt = `
User-agent: *
${disallowLines}

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};

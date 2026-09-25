import { getSortedPostsExcludingNotes } from "@/utils/content-utils";

export async function GET() {
	// 排除笔记：笔记不参与站内搜索与首页数据源
	const posts = await getSortedPostsExcludingNotes();

	const allPostsData = posts
		.map((post) => ({
			id: post.id,
			title: post.data.title,
			description: post.data.description,
			published: post.data.published.getTime(),
			category: post.data.category || "",
			password: !!post.data.password,
		}))
		// 按发布日期降序排列
		.sort((a, b) => b.published - a.published);

	return new Response(JSON.stringify(allPostsData), {
		headers: { "Content-Type": "application/json" },
	});
}

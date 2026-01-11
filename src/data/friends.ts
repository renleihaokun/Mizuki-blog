// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "acofork",
		imgurl: "https://avatars.githubusercontent.com/u/180811437?v=4",
		desc: "二叉树树的博客",
		siteurl: "https://blog.acofork.com/",
		tags: ["blog"],
	},
	{
		id: 2,
		title: "摇月的魔法工坊",
		imgurl: "https://YuzukiAtelier.com/head.webp",
		desc: "记录了一些现代魔法的咏唱技法",
		siteurl: "https://YuzukiAtelier.com",
		tags: ["blog"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
// 使用 import.meta.glob 读取所有 .json 文件
const allFriendJsonFiles = import.meta.glob<{ default: FriendItem }>(
	"./friends/*.json",
	{ eager: true },
);

// 将导入的 JSON 数据转换为 FriendItem 数组
const friendsData: FriendItem[] = Object.values(allFriendJsonFiles).map(
	(module) => module.default,
);

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

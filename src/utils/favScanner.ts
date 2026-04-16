import * as fs from "node:fs";
import * as path from "node:path";

export interface FavoriteItem {
	id: string;
	src: string;
	alt: string;
	title: string;
	date: string;
	mtime: number;
	birthtime: number;
	sequence: number;
	meta?: {
		type: string; // 'TRAIN' | 'FLIGHT' | 'MOVIE' | 'COLL'
		code?: string; // 车次号或航班号
	};
}

/**
 * 智能提取文件名中的信息
 * 支持格式：G1724_2025-10-06.png, MU5678_旅行_20251006_1.jpg
 */
function parseFileInfo(fileName: string, fileMtime: Date) {
	const parts = fileName.split("_");
	let type = "COLL";
	let code = "MEMO";
	let extractedDate = "";
	let description = "";
	let sequence = 0;

	// 1. 尝试从各分段中提取信息
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		// 匹配日期 (YYYY-MM-DD 或 YYYYMMDD)
		const dateMatch = part.match(/(\d{4}-\d{2}-\d{2})|(\d{8})/);
		if (dateMatch && !extractedDate) {
			extractedDate = dateMatch[0].includes("-")
				? dateMatch[0]
				: `${dateMatch[0].substring(0, 4)}-${dateMatch[0].substring(4, 6)}-${dateMatch[0].substring(6, 8)}`;
			continue;
		}

		// 匹配上海磁悬浮
		if (
			part.toUpperCase() === "SMT" ||
			part.toLowerCase() === "shanghaimaglevtrain"
		) {
			type = "TRAIN";
			code = "SMT";
			description = "上海磁悬浮";
			continue;
		}

		// 匹配车次 (G/D/K/T/Z/S/C + 数字 或 纯四位数字)
		const trainMatch = part.match(/^([GDKTZSC]\d{1,4}|\d{4})$/i);
		if (trainMatch) {
			type = "TRAIN";
			code = trainMatch[0].toUpperCase();
			continue;
		}

		// 匹配航班 (两个大写字母 + 3到4位数字)
		const flightMatch = part.match(/^[A-Z]{2}\d{3,4}$/i);
		if (flightMatch) {
			type = "FLIGHT";
			code = flightMatch[0].toUpperCase();
			continue;
		}

		// 如果是最后一部分且是纯数字，视为序号
		if (i === parts.length - 1 && /^\d+$/.test(part) && part.length < 4) {
			sequence = Number.parseInt(part, 10);
			continue;
		}

		// 如果不是日期也不是代号，则视为描述
		if (part && !description) {
			description = part;
		}
	}

	// 2. 匹配电影关键字
	if (fileName.includes("电影") || fileName.toUpperCase().includes("MOVIE")) {
		type = "MOVIE";
		code = "FILM";
	}

	// 3. 确定最终标题 (如果描述为空，则用代号)
	const title = description || code;

	// 4. 确定最终日期 (文件名日期优先级高于文件修改日期)
	const finalDate = extractedDate || fileMtime.toISOString().split("T")[0];

	return {
		title,
		date: finalDate,
		sequence,
		meta: { type, code },
	};
}

export async function scanFavorites(): Promise<FavoriteItem[]> {
	const favoritesDir = path.join(process.cwd(), "public/images/favorites");
	const items: FavoriteItem[] = [];

	if (!fs.existsSync(favoritesDir)) {
		try {
			fs.mkdirSync(favoritesDir, { recursive: true });
		} catch {}
		return [];
	}

	function walkDir(currentPath: string) {
		const files = fs.readdirSync(currentPath, { withFileTypes: true });

		for (const file of files) {
			const filePath = path.join(currentPath, file.name);
			if (file.isDirectory()) {
				walkDir(filePath);
			} else {
				const ext = path.extname(file.name).toLowerCase();
				if (
					[
						".jpg",
						".jpeg",
						".png",
						".gif",
						".webp",
						".svg",
						".avif",
						".bmp",
					].includes(ext)
				) {
					const stats = fs.statSync(filePath);
					const relativePath = path.relative(
						path.join(process.cwd(), "public"),
						filePath,
					);

					const baseName = path.basename(file.name, ext);
					const info = parseFileInfo(baseName, stats.mtime);

					items.push({
						id: baseName + stats.mtimeMs,
						src: `/${relativePath.replace(/\\/g, "/")}`,
						alt: info.title,
						title: info.title,
						date: info.date,
						mtime: new Date(info.date).getTime(),
						birthtime: stats.birthtimeMs || stats.ctimeMs,
						sequence: info.sequence,
						meta: info.meta,
					});
				}
			}
		}
	}

	walkDir(favoritesDir);

	// 综合排序逻辑
	return items.sort((a, b) => {
		// 1. 首先按记录日期 (date) 降序排列
		if (b.mtime !== a.mtime) {
			return b.mtime - a.mtime;
		}
		// 2. 如果日期相同，按文件名序号 (sequence) 降序排列
		// 这样序号大的在上面，序号小的在下面
		return b.sequence - a.sequence;
	});
}

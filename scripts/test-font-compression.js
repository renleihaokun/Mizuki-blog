import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Fontmin from "fontmin";

/**
 * 字体压缩配置自检（不写任何文件，只读 + 报告）。
 *
 * 用途：`pnpm build` 里的字体子集化依赖 src/config.ts 的 font 配置与
 * public/assets/font/ 下的实际文件，二者一旦对不上，构建只会打印一行提示，
 * 很容易被忽略。这个脚本把问题提前暴露出来：
 *
 * 1. 解析 font.asciiFont / font.cjkFont 的 enableCompress 与 localFonts
 * 2. 逐项校验文件是否真的存在于 public/assets/font/
 * 3. 报告每个字体的原始体积、以及实际能压到多少（真实跑一次 fontmin）
 * 4. 交叉检查 main.css 的 @font-face 与配置里的 fontFamily 是否对应
 *    （本次清理掉 loli.ttf 就是因为它的 @font-face 声明了却从未被使用）
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const configPath = path.join(repoRoot, "src/config.ts");
const mainCssPath = path.join(repoRoot, "src/styles/main.css");
const fontDir = path.join(repoRoot, "public/assets/font");

const problems = [];
const warnings = [];
const rows = [];

function readConfig() {
	if (!fs.existsSync(configPath)) {
		problems.push(`找不到配置文件：${configPath}`);
		return { fonts: [] };
	}

	const content = fs.readFileSync(configPath, "utf-8");
	const langMatch = content.match(/const SITE_LANG = ["'](.+?)["']/);
	const fontConfigMatch = content.match(/font:\s*\{([\s\S]*?)\n\t\},/);

	if (!fontConfigMatch) {
		problems.push("在 src/config.ts 中找不到 font: {...} 配置块");
		return { fonts: [], lang: langMatch?.[1] ?? "zh_CN" };
	}

	const fonts = [];
	for (const type of ["asciiFont", "cjkFont"]) {
		const block = fontConfigMatch[1].match(
			new RegExp(`${type}:\\s*\\{([\\s\\S]*?)\\}`, "m"),
		)?.[1];
		if (!block) {
			warnings.push(`配置里没有 ${type}（可接受，但确认是否符合预期）`);
			continue;
		}

		const enableCompress = /enableCompress:\s*true/.test(block);
		const family = block.match(/fontFamily:\s*["']([^"']+)["']/)?.[1];
		const files =
			block
				.match(/localFonts:\s*\[(.*?)\]/s)?.[1]
				?.match(/["']([^"']+)["']/g)
				?.map((s) => s.replace(/["']/g, "")) ?? [];

		fonts.push({ type, family, enableCompress, files });
	}

	return { fonts, lang: langMatch?.[1] ?? "zh_CN" };
}

/** 复刻 compress-fonts.js 的子集化参数，给出真实可压缩到的体积 */
async function measureSubset(srcPath, isAscii) {
	const text = isAscii
		? Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join(
				"",
			)
		: "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严首底液官德随病苏失尔死讲配女黄推显谈罪神艺呢席含企望密批营项防举球英氧势告李台落木帮轮破亚师围注远字材排供河态封另施减树溶怎止案言士均武固叶鱼波视仅费紧爱左章早朝害续轻服试食充兵源判护司足某练差致板田降黑犯负击范继兴似余坚曲输修故城夫够送笔船占右财吃富春职觉汉画功巴跟虽杂飞检吸助升阳互初创抗考投坏策古径换未跑留钢曾端责站简述钱副尽帝射草冲承独令限阿宣环双请超微让控州良轴找否纪益依优顶础载倒房突坐粉敌略客袁冷胜绝析块剂测丝协重诉念陈仍罗盐友洋错苦夜刑移频逐靠混母短皮终聚汽村云哪既距卫停烈央察烧行迅境若印洲刻括激孔搞甚室待核校散侵吧甲游久菜味旧模湖货损预阻毫普稳乙妈植息扩银语挥酒守拿序纸医缺雨吗针刘啊急唱误训愿审附获茶鲜粮斤孩脱硫肥善龙演父渐血欢械掌歌沙著刚攻谓盾讨晚粒乱燃矛乎杀药宁鲁贵钟煤届验" +
			"示例歌曲艺术家";

	// fontmin 必须写到磁盘才能拿到产物，所以用一个临时目录，测完即删
	const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "fontsubset-"));

	try {
		const fontmin = new Fontmin()
			.src(srcPath)
			.use(Fontmin.glyph({ text, hinting: false }))
			.use(Fontmin.ttf2woff2({ deflate: true }))
			.dest(outDir);

		await new Promise((resolve, reject) => {
			fontmin.run((err) => (err ? reject(err) : resolve()));
		});

		const produced = fs
			.readdirSync(outDir)
			.filter((f) => f.endsWith(".woff2"));
		if (produced.length === 0) {
			return null;
		}
		return fs.statSync(path.join(outDir, produced[0])).size;
	} catch {
		return null;
	} finally {
		try {
			fs.rmSync(outDir, { recursive: true, force: true });
		} catch {
			// 临时目录清理失败无关紧要
		}
	}
}

async function main() {
	console.log("字体压缩配置自检\n" + "=".repeat(60));

	const { fonts, lang } = readConfig();
	console.log(`站点语言 SITE_LANG = ${lang}`);
	console.log(`字体根目录：public/assets/font\n`);

	if (!fs.existsSync(fontDir)) {
		problems.push(`字体目录不存在：${fontDir}`);
	}

	// 1. 配置项与文件校验
	for (const font of fonts) {
		console.log(
			`[${font.type}] family=${font.family ?? "(未设置)"} enableCompress=${font.enableCompress}`,
		);

		if (!font.enableCompress) {
			console.log("  · 未启用压缩，构建时不会生成 woff2");
		}

		if (font.files.length === 0) {
			problems.push(`${font.type}.localFonts 为空，但配置了压缩`);
			continue;
		}

		for (const file of font.files) {
			const src = path.join(fontDir, file);
			const exists = fs.existsSync(src);
			if (!exists) {
				problems.push(
					`${font.type}.localFonts 里的 "${file}" 不存在（期望路径 public/assets/font/${file}）`,
				);
				rows.push({
					type: font.type,
					file,
					status: "缺失",
					before: "-",
					after: "-",
					ratio: "-",
				});
				continue;
			}

			const before = fs.statSync(src).size;
			const after = font.enableCompress
				? await measureSubset(src, font.type === "asciiFont")
				: null;

			rows.push({
				type: font.type,
				file,
				status: "OK",
				before: `${(before / 1024).toFixed(0)} KB`,
				after: after ? `${(after / 1024).toFixed(0)} KB` : "（未压缩）",
				ratio: after
					? `${(100 - (after / before) * 100).toFixed(1)}%`
					: "-",
			});
		}
		console.log("");
	}

	// 2. 反向检查：public/assets/font 下有没有配置里完全不提的文件
	if (fs.existsSync(fontDir)) {
		const configured = new Set(fonts.flatMap((f) => f.files));
		const onDisk = fs
			.readdirSync(fontDir)
			.filter((f) => fs.statSync(path.join(fontDir, f)).isFile());
		const orphans = onDisk.filter((f) => !configured.has(f));

		if (orphans.length > 0) {
			console.log("以下文件在 public/assets/font/ 中，但配置里没有引用：");
			for (const orphan of orphans) {
				const looksReferencedByCss =
					fs.existsSync(mainCssPath) &&
					fs.readFileSync(mainCssPath, "utf-8").includes(orphan);
				warnings.push(
					`未被配置引用：${orphan}` +
						(looksReferencedByCss
							? "（但 main.css 的 @font-face 引用了它）"
							: "（既没被配置引用、也没被 CSS 引用，可考虑移出 public/）"),
				);
				console.log(
					`  · ${orphan}（${(
						fs.statSync(path.join(fontDir, orphan)).size / 1024
					).toFixed(0)} KB）` +
						(looksReferencedByCss ? " ← CSS 引用了" : " ← 无任何引用"),
				);
			}
			console.log("");
		}
	}

	// 3. CSS @font-face 与配置 fontFamily 的交叉检查
	if (fs.existsSync(mainCssPath)) {
		const css = fs.readFileSync(mainCssPath, "utf-8");
		for (const font of fonts) {
			if (
				font.family &&
				font.enableCompress &&
				!css.includes(`"${font.family}"`)
			) {
				problems.push(
					`main.css 里没有 font-family: "${font.family}" 的 @font-face，` +
						`构建出的 woff2 将不会被应用到页面`,
				);
			}
		}
	}

	// 汇总表
	console.log("=".repeat(60));
	console.log('字体体积对照（"子集化" 为真实跑一次 fontmin 的结果）\n');
	const pad = (s, n) => String(s).padEnd(n, " ");
	console.log(
		pad("类型", 12) + pad("文件", 34) + pad("原始", 10) + pad("子集化", 12) + "压缩率",
	);
	console.log("-".repeat(60));
	for (const r of rows) {
		console.log(
			pad(r.type, 12) +
				pad(r.file, 34) +
				pad(r.before, 10) +
				pad(r.after, 12) +
				r.ratio,
		);
	}

	console.log("\n" + "=".repeat(60));
	if (warnings.length > 0) {
		console.log(`\n⚠ 提示 ${warnings.length} 条：`);
		for (const w of warnings) {
			console.log(`  · ${w}`);
		}
	}
	if (problems.length > 0) {
		console.log(`\n✘ 问题 ${problems.length} 条：`);
		for (const p of problems) {
			console.log(`  · ${p}`);
		}
		process.exitCode = 1;
		return;
	}

	console.log("\n✓ 字体配置自检通过");
}

main().catch((err) => {
	console.error("✘ 自检脚本异常：", err);
	process.exit(1);
});

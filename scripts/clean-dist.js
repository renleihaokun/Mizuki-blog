import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 清空构建输出目录。
 *
 * 为什么需要它：Astro 构建**不会**清空 dist，被删除的页面/资源会一直留在
 * dist 里继续被部署。实测 dist 里堆着数月前的字体与横幅（产物从 238MB 涨到
 * 300MB+），而 sitemap 只列当前页面，两者不一致。
 *
 * 为什么先改名再删：在 Windows 上，如果某个进程（编辑器、文件索引、上一个
 * dev/preview 进程）还持有 dist 内部的句柄，`fs.rmSync(dist)` 会**静默失败**
 * ——不抛异常、也不删除，看上去像「清空成功」，实际上什么都没发生。
 * 而重命名目录几乎总能成功。所以策略是：
 *   1. 先把 dist 改名为 dist.__cleaning__<时间戳>（立刻为构建腾出干净的 dist）
 *   2. 再尽力删除这个已改名的目录
 *   3. 删不掉就把名字记下来，并在**以后每次运行时顺手重试**
 *
 * 安全约束：只操作仓库根目录下名为 dist 或 dist.__cleaning__* 的目录，
 * 且必须是真实目录、不能是符号链接。
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const target = path.resolve(repoRoot, "dist");
const CLEANING_PREFIX = "dist.__cleaning__";

if (path.dirname(target) !== repoRoot) {
	console.error(`✘ 拒绝执行：目标不在仓库根目录下 -> ${target}`);
	process.exit(1);
}

function directorySize(dir) {
	let total = 0;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			total += directorySize(full);
		} else if (entry.isFile()) {
			total += fs.statSync(full).size;
		}
	}
	return total;
}

/** 删除目录并回查真实结果（rmSync 的 force 会吞掉失败，必须回查） */
function tryRemove(dir) {
	try {
		fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
	} catch {
		// 忽略：下面统一回查真实状态
	}
	return !fs.existsSync(dir);
}

/**
 * 给 Windows 一点时间释放目录句柄再重试。
 * 实测：刚被某个进程（编辑器/索引/上一个 dev 进程）读过的目录，
 * 立刻 rmSync 会静默失败，但改名后隔一小会儿往往就能删掉。
 */
async function tryRemoveWithDelay(dir, attempts = 3, delayMs = 400) {
	for (let i = 0; i < attempts; i++) {
		if (tryRemove(dir)) {
			return true;
		}
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}
	return !fs.existsSync(dir);
}

/** 上一轮没删干净的残留，这次顺手重试 */
async function retryLeftovers() {
	let cleaned = 0;
	let stillStuck = 0;
	for (const entry of fs.readdirSync(repoRoot, { withFileTypes: true })) {
		if (
			!entry.isDirectory() ||
			!entry.name.startsWith(CLEANING_PREFIX) ||
			entry.isSymbolicLink()
		) {
			continue;
		}
		const dir = path.join(repoRoot, entry.name);
		if (await tryRemoveWithDelay(dir)) {
			cleaned += 1;
			console.log(`  · 顺带清掉上一轮残留：${entry.name}`);
		} else {
			stillStuck += 1;
		}
	}
	return { cleaned, stillStuck };
}

function guardIsRealDirectory(dir) {
	const stat = fs.lstatSync(dir);
	if (stat.isSymbolicLink()) {
		console.error(`✘ 拒绝执行：${path.basename(dir)} 是符号链接 -> ${dir}`);
		process.exit(1);
	}
	if (!stat.isDirectory()) {
		console.error(`✘ 拒绝执行：${path.basename(dir)} 不是目录 -> ${dir}`);
		process.exit(1);
	}
}

console.log("清理构建输出目录 dist …");
const { cleaned, stillStuck } = await retryLeftovers();
if (cleaned > 0) {
	console.log(`（顺带清理了 ${cleaned} 个残留目录）`);
}
if (stillStuck > 0) {
	console.log(
		`（还有 ${stillStuck} 个残留目录被占用，本次跳过；不影响构建）`,
	);
}

if (!fs.existsSync(target)) {
	console.log(`✓ dist 不存在，无需清理`);
	process.exit(0);
}

guardIsRealDirectory(target);

const before = directorySize(target);
const staging = path.join(repoRoot, `${CLEANING_PREFIX}${Date.now()}`);

// 第一步：改名。这一步在 Windows 上几乎总能成功，且立刻让 dist 变为不存在。
try {
	fs.renameSync(target, staging);
} catch (error) {
	console.error(`✘ 无法移动 dist（可能被其它进程占用）：${error.message}`);
	console.error("  请关闭正在写入 dist 的进程（dev/preview/编辑器）后重试。");
	process.exit(1);
}

console.log(
	`✓ 已清空 dist（释放 ${(before / 1024 / 1024).toFixed(1)} MB）：${target}`,
);

// 第二步：尽力删除改名后的目录；删不掉也不算失败，下次运行会重试。
if (await tryRemoveWithDelay(staging)) {
	console.log("✓ 旧产物已删除");
} else {
	console.log(
		`⚠ 旧产物暂时被占用，已改名为 ${path.basename(staging)}，下次运行 pnpm clean 会自动清掉`,
	);
}

import path from "node:path";

import type { ImageMetadata } from "astro";

/**
 * 分享海报用的图片解析工具。
 *
 * 注意：`import.meta.glob` 只接受**字面量**，不能用变量传参
 * （否则报 `Invalid glob import syntax: Could only use literals`），
 * 所以下面两个函数里各自写了一遍同一条 glob。
 *
 * glob 的 base 由 Vite 解析为 `src/utils/` 的上一级为止，`"../../"` 实际指向 `src/`，
 * 键名形如 `/src/assets/images/avatar.webp`——与 `url-utils` 的既有约定保持一致。
 *
 * 这里刻意**不**使用 `"../../**"`：那种写法会把同级产物也纳入匹配
 * （扫到 `/dist/pagefind/**.pf_fragment` 这类二进制文件后，构建直接报
 * `stream did not contain valid UTF-8`）。所以只覆盖真正放图片的两处目录。
 */

/**
 * 把文章封面解析成可用于分享海报的 URL。
 *
 * - 站点内相对路径：通过 glob 取构建后的资源地址
 * - 远程地址 / 站点绝对路径 / data URI：原样返回
 *   （原来的实现会把远程图下载成 base64 内联，构建期会为此发几十次网络请求；
 *   海报渲染端 `loadImage()` 本身支持远程图并带 weserv 代理兜底，不需要内联。）
 */
export async function resolvePosterCoverUrl(
	image: string | undefined,
	filePath: string | undefined,
): Promise<string | undefined> {
	if (!image) {
		return image;
	}

	const isLocal = !(
		image.startsWith("/") ||
		image.startsWith("http") ||
		image.startsWith("https") ||
		image.startsWith("data:")
	);

	if (!isLocal) {
		return image;
	}

	const files = import.meta.glob<ImageMetadata>(
		[
			"../../assets/**/*.{png,jpg,jpeg,webp,avif,gif}",
			"../../content/**/*.{png,jpg,jpeg,webp,avif,gif}",
		],
		{ import: "default" },
	);
	const basePath = filePath ? path.dirname(filePath) : "";
	const normalizedPath = path
		.normalize(path.join("../../", basePath, image))
		.replace(/\\/g, "/");
	const file = files[normalizedPath];

	if (!file) {
		return image;
	}

	const imageMetadata = await file();
	return imageMetadata.src;
}

/**
 * 解析分享海报用的头像地址（配置里通常是 `assets/images/avatar.webp` 这类相对路径）。
 */
export async function resolvePosterAvatarUrl(
	avatar: string | undefined,
): Promise<string | undefined> {
	if (!avatar) {
		return avatar;
	}

	const isLocal = !(
		avatar.startsWith("/") ||
		avatar.startsWith("http") ||
		avatar.startsWith("https") ||
		avatar.startsWith("data:")
	);

	if (!isLocal) {
		return avatar;
	}

	const files = import.meta.glob<ImageMetadata>(
		[
			"../../assets/**/*.{png,jpg,jpeg,webp,avif,gif}",
			"../../content/**/*.{png,jpg,jpeg,webp,avif,gif}",
		],
		{ import: "default" },
	);
	const normalizedPath = path
		.normalize(path.join("../../", avatar))
		.replace(/\\/g, "/");
	const file = files[normalizedPath];

	if (!file) {
		return avatar;
	}

	const imageMetadata = await file();
	return imageMetadata.src;
}

/**
 * 笔记学科样式配置
 *
 * 笔记的 frontmatter 用 tags 标记学科（例如 tags: [生物]）。
 * 这里统一维护学科的展示顺序、图标与配色，供 /notes/ 页的筛选条、卡片与索引块复用。
 */
export interface NoteSubjectStyle {
	/** 与笔记 frontmatter 的 tags 完全一致的学科名 */
	label: string;
	/** material-symbols 图标 */
	icon: string;
	/** 学科文字/图标配色（明暗自适应） */
	accentClass: string;
	/** 无封面紧凑卡的底色渐变 */
	tintClass: string;
	/** 无封面紧凑卡的水印图标颜色 */
	watermarkClass: string;
	/** 索引进度条/强调色 */
	barClass: string;
}

export const NOTE_SUBJECTS: NoteSubjectStyle[] = [
	{
		label: "数学",
		icon: "material-symbols:calculate",
		accentClass: "text-blue-600 dark:text-blue-300",
		tintClass:
			"bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/5 dark:from-blue-300/15 dark:via-transparent dark:to-blue-400/5",
		watermarkClass: "text-blue-500/15 dark:text-blue-300/20",
		barClass: "bg-blue-500 dark:bg-blue-400",
	},
	{
		label: "化学",
		icon: "material-symbols:science",
		accentClass: "text-violet-600 dark:text-violet-300",
		tintClass:
			"bg-gradient-to-br from-violet-500/10 via-transparent to-violet-500/5 dark:from-violet-300/15 dark:via-transparent dark:to-violet-400/5",
		watermarkClass: "text-violet-500/15 dark:text-violet-300/20",
		barClass: "bg-violet-500 dark:bg-violet-400",
	},
	{
		label: "生物",
		icon: "material-symbols:genetics",
		accentClass: "text-emerald-600 dark:text-emerald-300",
		tintClass:
			"bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5 dark:from-emerald-300/15 dark:via-transparent dark:to-emerald-400/5",
		watermarkClass: "text-emerald-500/15 dark:text-emerald-300/20",
		barClass: "bg-emerald-500 dark:bg-emerald-400",
	},
	{
		label: "思政",
		icon: "material-symbols:balance",
		accentClass: "text-rose-600 dark:text-rose-300",
		tintClass:
			"bg-gradient-to-br from-rose-500/10 via-transparent to-rose-500/5 dark:from-rose-300/15 dark:via-transparent dark:to-rose-400/5",
		watermarkClass: "text-rose-500/15 dark:text-rose-300/20",
		barClass: "bg-rose-500 dark:bg-rose-400",
	},
	{
		label: "英语",
		icon: "material-symbols:translate",
		accentClass: "text-amber-700 dark:text-amber-300",
		tintClass:
			"bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5 dark:from-amber-300/15 dark:via-transparent dark:to-amber-400/5",
		watermarkClass: "text-amber-500/15 dark:text-amber-300/20",
		barClass: "bg-amber-500 dark:bg-amber-400",
	},
];

/** 没有命中学科配置时的兜底样式 */
export const NOTE_SUBJECT_FALLBACK: NoteSubjectStyle = {
	label: "",
	icon: "material-symbols:sticky-note-2",
	accentClass: "text-[var(--primary)]",
	tintClass:
		"bg-gradient-to-br from-black/5 via-transparent to-[var(--primary)]/10 dark:from-white/5 dark:via-transparent dark:to-[var(--primary)]/15",
	watermarkClass: "text-[var(--primary)]/15 dark:text-[var(--primary)]/20",
	barClass: "bg-[var(--primary)]",
};

/** 从笔记标签里解析学科样式 */
export function resolveNoteSubject(
	tags?: string[],
): NoteSubjectStyle | undefined {
	if (!tags || tags.length === 0) {
		return undefined;
	}
	return NOTE_SUBJECTS.find((subject) => tags.includes(subject.label));
}

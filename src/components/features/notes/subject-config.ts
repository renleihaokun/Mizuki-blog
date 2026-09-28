/**
 * 笔记学科样式配置
 *
 * 笔记的 frontmatter 用 tags 标记学科（例如 tags: [生物]）。
 * 这里统一维护学科的展示顺序、图标与配色，供 /notes/ 页的筛选条和卡片复用。
 */
export interface NoteSubjectStyle {
	/** 与笔记 frontmatter 的 tags 完全一致的学科名 */
	label: string;
	/** material-symbols 图标 */
	icon: string;
	/** 学科文字/图标配色（明暗自适应） */
	accentClass: string;
	/** 无封面时的占位底色 */
	tintClass: string;
	/** 无封面时的占位图标颜色 */
	placeholderIconClass: string;
}

export const NOTE_SUBJECTS: NoteSubjectStyle[] = [
	{
		label: "数学",
		icon: "material-symbols:calculate",
		accentClass: "text-blue-600 dark:text-blue-300",
		tintClass: "bg-gradient-to-br from-blue-500/15 to-blue-500/5",
		placeholderIconClass: "text-blue-500/40",
	},
	{
		label: "化学",
		icon: "material-symbols:science",
		accentClass: "text-violet-600 dark:text-violet-300",
		tintClass: "bg-gradient-to-br from-violet-500/15 to-violet-500/5",
		placeholderIconClass: "text-violet-500/40",
	},
	{
		label: "生物",
		icon: "material-symbols:genetics",
		accentClass: "text-emerald-600 dark:text-emerald-300",
		tintClass: "bg-gradient-to-br from-emerald-500/15 to-emerald-500/5",
		placeholderIconClass: "text-emerald-500/40",
	},
	{
		label: "思政",
		icon: "material-symbols:balance",
		accentClass: "text-rose-600 dark:text-rose-300",
		tintClass: "bg-gradient-to-br from-rose-500/15 to-rose-500/5",
		placeholderIconClass: "text-rose-500/40",
	},
	{
		label: "英语",
		icon: "material-symbols:translate",
		accentClass: "text-amber-700 dark:text-amber-300",
		tintClass: "bg-gradient-to-br from-amber-500/15 to-amber-500/5",
		placeholderIconClass: "text-amber-500/40",
	},
];

/** 没有命中学科配置时的兜底样式 */
export const NOTE_SUBJECT_FALLBACK: NoteSubjectStyle = {
	label: "",
	icon: "material-symbols:sticky-note-2",
	accentClass: "text-[var(--primary)]",
	tintClass:
		"bg-gradient-to-br from-black/5 to-transparent dark:from-white/5",
	placeholderIconClass: "text-[var(--primary)]/40",
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

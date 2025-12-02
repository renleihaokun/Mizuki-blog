// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	OPPO: [
		{
			name: "OPPO Find X8 Pro",
			image: "/images/device/x8p.png",
			specs: "Blue / 16G + 512GB",
			description: "Flagship performance, Hasselblad imaging, 80W SuperVOOC.",
			link: "https://www.oppo.com/cn/smartphones/series-find-x/find-x8-pro/",
		},
	],
	Router: [
		{
			name: "ZXHN E2631",
			image: "/images/device/router_logo_ZXHNE2631.png",
			specs: "1000Mbps / 2.5G",
			description:
				"Portable WiFi 6 router suitable for business trips and home use.",
			link: "https://www.ztedevices.com/cn/product/ax3000/%e4%b8%ad%e5%85%b4ax3000%e5%b7%a1%e5%a4%a9%e7%89%88wi-fi-6%e8%b7%af%e7%94%b1/",
		},
	],
};

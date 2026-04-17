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
			description:
				"抬手就出片，抓拍氛围感。",
			link: "https://www.oppo.com/cn/smartphones/series-find-x/find-x8-pro/",
		},
		{
			name: "OPPO Pad",
			image: "/images/device/opad.webp",
			specs: "Black / 8G + 256GB",
			description:
				"畅快创造，一Pad即合。",
			link: "https://www.oppo.com/cn/accessories/oppo-pad/",
		},
		{
			name: "OPPO Watch X2 Mini",
			image: "/images/device/LS20260417214049.png",
			specs: "Black / eSIM",
			description:
				"18K金精钢表壳。",
			link: "https://www.opposhop.cn/cn/web/products/33987.html?utm_source=guanwang&utm_medium=oppo-watch-x2-mini&utm_page=productlist&utm_site=top&download_app=0",
		},
	],
	Apple:[
		{
			name:"iPhone 12 mini",
			image:"/images/device/iphone12_mini_blue.png",
			specs:"Blue / 4G + 128 GB",
			description:
				"小巧，也强大。",
			link:"https://support.apple.com/zh-cn/111877",
		},
	],
	Honor:[
		{
			name:"MagicBook Pro 14",
			image:"/images/device/honor-magicbook-pro-14-white.png",
			specs:"White / 32G + 3TB",
			description:
				"性能风暴，续航狂飙。",
			link:"https://www.honor.com/cn/laptops/honor-magicbook-pro-14"
		},
	],
	Redmi:[
		{
			name:"Redmi 5 Plus",
			image:"/images/device/specs_redmi5p-t-black-removebg-preview.png",
			specs:"Black / 4G + 64GB",
			description:
				"千元全面屏。",
			link:"https://www.mi.com/redmi5"
		},
		{
			name:"Redmi 8A",
			image:"/images/device/toggle-slide-3.png",
			specs:"Black / 3G + 32GB",
			description:
				"31天待机，5000mAh 大电量。",
			link:"https://www.mi.com/de/redmi-8a"
		},
	],
	Router: [
		{
			name: "中兴AX3000",
			image: "/images/device/router_logo_ZXHNE2631.png",
			specs: "1000Mbps / 2.5G",
			description:
				"性能再升级，Wi-Fi 6路由器",
			link: "https://www.ztedevices.com/cn/product/ax3000/%e4%b8%ad%e5%85%b4ax3000%e5%b7%a1%e5%a4%a9%e7%89%88wi-fi-6%e8%b7%af%e7%94%b1/",
		},
		{
			name: "小米路由器4A",
			image: "/images/device/specs01-removebg-preview.png",
			specs: "100Mbps / 1000Mbps",
			description:
				"光纤级全千兆，网速就是快",
			link: "https://www.mi.com/miwifi4ac?spm=a2ty_o01.29997173.0.0.651255fbBOKZID",
		},		
	],
};

---
title: 看看你的
published: 2026-01-22
pinned: false
description: 网啊，那不然还能是什么
tags: [Network]
category: Network
licenseName: "CC BY 4.0"
author: renleihaokun
draft: false
date: 2026-01-22
pubDate: 2026-01-22
permalink: "cancanneed"
image: "https://imgbed.haokun.me/file/1769079105119_image.png"
---
 
# 为什么要做这个东西  
~~因为我要看看你的~~  
因为与其找一个别人的类似的有我的所有功能的工具，不如自己写一个，~~毕竟AI这么强大了~~  
最初只是想做一个看运营商来源的小页面罢了，然后东西越塞越多，最近迁移到GitHub开源了  
~~所以我为什么明天要考军理了现在还不在复习在搞这玩意啊~~


网页端背景是另一个伊雷娜随机图项目，那玩意更简单  
网页端底部的卡片是tool.lu的，那个工具用来查高精度ip归属很好用，毕竟我穷的一杯

# 在本站使用  
主页右上角那个就是，也是用api实现的
![image.png](https://imgbed.haokun.me/file/1769080669625_image.png)

# 直接访问网页版  

[直接点击这里][1]可以直接访问，或者你想访问[未经过优选的版本][2]  
未优选过看连接来源ip还能看出是否ipv6优先  
~主打一个好看~，伊雷娜嘿嘿😋  
还有个人机输出废话

[1]: <https://ip.haokun.me>
[2]: https://ip.4848488.xyz

# 作为API使用

直接`get` `https://ip.haokun.me/?act=get_ip_info` 就行，会返回`json`  
**所有节点信息和数据中心信息都是指的cf的**  
 
**示例请求**:

```bash
curl "https://ip.haokun.me/?act=get_ip_info"
```

**响应示例**:

```json
{
  "ip": "0.0.0.0",
  "location": {
    "country": "JP",
    "region": "Tokyo",
    "city": "Tokyo"
  },
  "node": {
    "code": "NRT",
    "name": "东京",
    "iso": "jp"
  },
  "asn": 45102,
  "isp": {
    "name": "Shiodome Sumitomo Blog 1-9-2 TOKYO",
    "raw": "Shiodome Sumitomo Blog 1-9-2 TOKYO"
  },
  "rtt": 50
}
```

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `ip` | String | 客户端连接到 Cloudflare 的 IP 地址 |
| `location.country` | String | 客户端所属国家/地区代码 |
| `location.region` | String | 客户端所属区域/州/省 |
| `location.city` | String | 客户端所属城市 |
| `node.code` | String | Cloudflare 数据中心三字码 (如 LAX, NRT, HKG) |
| `node.name` | String | 数据中心所在城市中文名 |
| `node.iso` | String | 所在国家/地区 ISO 代码 (用于显示国旗) |
| `asn` | Number | 自治系统号 (ASN) |
| `isp.name` | String | 识别后的 ISP 中文名称 |
| `isp.raw` | String | 原始 ISP 组织名称 |
| `rtt` | Number | 客户端到 Cloudflare 边缘节点的连接往返延迟 (ms) |

# 数据来源  
主要是cloudflare workers的~施舍~
呜呜呜😭😭😭  

# 开源  
::github{repo="renleihaokun/cancanneed-network"}
其实就是传到GitHub方便直接部署，省得来回复制粘贴  
欢迎提交PR
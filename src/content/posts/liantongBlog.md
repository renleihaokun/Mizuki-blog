---
title: CF静态博客联通网络访问太慢的一种曲线救国的方案
published: 2026-1-2
pinned: false
description: 介绍一种能使联通访问Pages快些的方法
tags: [cloudflare, Network，EdgeOne]
category: Network
licenseName: "CC BY 4.0"
author: renleihaokun
draft: false
date: 2026-1-2
pubDate: 2026-1-2
permalink: "liantongBlog"
image: "https://imgbed.haokun.me/file/1767337314334_image.png"
---


# CF静态博客联通网络访问太慢的一种曲线救国的方案  
### **此方法仅适用于使用Pages功能的不想备案的静态博客类项目**，其他项目请自行搜索解决办法  
先看看前后网站测速（联通）对比  
前：  
![image.png](https://imgbed.haokun.me/file/1767337475757_image.png)  
后：  
![image.png](https://imgbed.haokun.me/file/1767337314334_image.png)  

### 那么就要引出今天的主角了：**EdgeOne Pages！**  
注意到，联通连EO比CF优选快
简而言之言而总之，就是把联通的流量分流到EO的Pages，这样对联通能比CF快不少（~至少都能解析成功~），电信移动倒是没啥区别。  

### 那为什么不用他的CDN功能呢？  
因为那b玩意限速，像我这种主页面放一堆高清大图的站得加载~一百万年~  
*tx为什么总能做出一些让人想夸又想骂的功能*  

## 下面实战开始  
首先按照图片找到Pages功能  
![image.png](https://imgbed.haokun.me/file/1767341584540_image.png)  
然后就按照指引一步步连接到git仓库部署你的项目...~(既然你都开始琢磨网站加速了这应该不用我教)~  
记得选不包含中国大陆区否则你有备案的域名（如果都有备案域名了那还不如直接全扔EO上

接下来添加你的自定义域名（也就是你添加在CF的域名），先别管`请添加cname`和`配置SSL`
![image.png](https://imgbed.haokun.me/file/1767341760189_image.png)  

之后会出现这样的提示让你添加cname记录：  
![image.png](https://imgbed.haokun.me/file/1767343039553_image.png)  
## 接下来我们搞一个DNS分流解析，找一个支持DNS分流解析的云服务商  
这里使用阿里云进行演示，~才不是因为懒得注册别家账号~  
**首先确保你网站的域名托管到了你选择的平台（一般是一个子域）**  
然后，先给设置一个默认解析，记录值就是EO给你的那个
等待一会，回到EO的域名管理，就可以发现cname验证通过了，然后你就可以申请免费SSL证书了  
证书下来以后，你就可以把那个记录改成来自联通的了

#### 如果你的域名是cname到一个优选域名  
你需要对联通添加EO的cname记录  
**移动和电信也得分别添加原来的cf加速域名**，不能只设个中国大陆的地域解析，否则这俩有概率被解析扔到EO导致变慢  
像这样：
![image.png](https://imgbed.haokun.me/file/1767344294619_image.png)  

#### 如果你在你网站的域名下直接做的分流解析
把联通cname到EO即可，移动电信保持原样就行  

## 等待DNS同步完成后，再测试你的网站的443端口就能看到青青草原了  
![image.png](https://imgbed.haokun.me/file/1767341097868_image.png)  
*虽然网络出口只有北上广三个，延迟还是一百左右吧，但可以接受了*  

### 为什么不用CF优选？  
因为优选只能喝418茶壶😅😅😅，默认也就俩ip（比之前快一点就行  
### 证书过期怎么办？  
~抛弃联通用户~或者改默认解析到EO续签  
### 为什么不给域名备案？  
因为穷逼
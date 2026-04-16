---
title: 干掉IPv4，红红火火过大年！
published: 2026-02-06
pinned: false
description: 千万不要在你的主站干掉IPv4除非你疯了
tags: [cloudflare, Network]
category: Network
licenseName: "CC BY 4.0"
author: renleihaokun
draft: false
date: 2026-02-06
pubDate: 2026-02-06
permalink: "onlyCfIPv6"
image: "https://imgbed.haokun.me/file/1770375498635_1767786298505.png"
---
想必各位都见过这个梗图  

### 省流：cloudflare只检测DNS默认解析，即使同时设置了境内和境外解析

# 但你何曾想过，如果有个网站不使用几乎每个人都有的`IPv4`，而是使用~~无人在意~~的`IPv6`呢？  
**那那个站长肯定大抵是疯了**  
那你看看本站`线路切换`那里呢  
~~没错我大抵是疯了~~  

# 那不就添加个AAAA记录删了A记录的事吗  
那是对于传统有源站的项目来说，对于本站这种**静态博客**，云服务商会让你添加**cname记录**，指向他们给的域名  
这就带来**问题**：
* 没有哪个傻缺服务商提供用于`cname`的域名只有IPv6没有IPv4  
* `cname`记录必须存在才能颁发SSL证书    

# 那按照之前优选分流的思路，设置`cname`为境外解析骗过云服务商不就好了  
那确实可以  
国内来源手动设置AAAA记录为cloudflare IPv6的ip  
但是国外来源依旧可以查询到`cname`记录走`IPv4`  
**不够极致，我们的目的是`IPv4 Only`全部拒之门外桀桀桀~**  

# 那放弃不就好了（？  
[注意到](#那放弃不就好了 "？注意力惊人")，权威DNS解析添加`境外`和`中国大陆`来源的解析记录后仍会提示让我添加默认线路  
![image.png](https://imgbed.haokun.me/file/1770377587585_image.png)  
**正常**情况下，会有一些请求**无法判断**地域，就会被丢进**默认线路**里  
但在这个问题下，这反而**是个好事**啊，因为**Cf就是那个未知来源**  
只需要添加`中国大陆`和`境外`线路解析到cloudflare的IPv6地址就行了  
Cf就会检测夹缝里的那个`默认`，只要你正确添加了`cname`记录就会给你颁发SSL证书  

# 那不还是残留了一点ipv4的地址在DNS里吗  
**关你，关我**  
从一般理性来说，**正常用户**都不会获取到ipv4地址  
那目的就达成了  
![image.png](https://imgbed.haokun.me/file/1770375421647_image.png)  

# Cf的IPv6地址从哪来  
自己找或者用我随便选的几个优选ip的优选域名`cf6.4848488.xyz`

# 为什么用cloudflare  
你看`EdgeOne`和`ESA`支持优选吗  

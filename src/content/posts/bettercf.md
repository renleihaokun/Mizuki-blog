---
title: 让CF代理的网站吃上优选节点
published: 2025-12-22
pinned: false
description: 介绍A，cnam接入的CF流量进行cdn节点的优选
tags: [cloudflare, Network]
category: Network
licenseName: "CC BY 4.0"
author: renleihaokun
draft: false
date: 2025-12-22
pubDate: 2025-12-22
permalink: "bettercf"
image: "https://imgbed.haokun.me/file/1766409101262_image.png"
---

# 如何让你CF代理流量更快些  
*答：进行节点优选*  

### 优选前：  
![image.png](https://imgbed.haokun.me/file/1766408958514_image.png)  
### 优选后：  
![image.png](https://imgbed.haokun.me/file/1766409075347_image.png)  
甚至如果去掉~路边一条的~联通还能更绿:  
![image.png](https://imgbed.haokun.me/file/1766409101262_image.png) 

--- 
# 如何使用CF优选节点呢？  
### 首先要明确一点：  
你的域名解析到任意一个CF节点，CF想代理你的流量到背后的源站，**他得知道你请求的域名和你源站的关联性**  

### 什么是优选域名？  
**就是有一堆A记录到中国大陆访问比较快的CF节点IP的域名**，可以看作是优选IP的集合

### 如何让CF知道这个关联性呢？  
对于A、AAA、cname记录接入的：可以使用CF的SaaS功能（中文名自定义主机名，其实就是个代理），这样CF就能知道你请求域名和源站的关系。  
对于Cloud flare Pages项目：你在添加自定义域的时候CF就知道这个域名改指向谁了（如果自定义域和pages在同一个账户下，cf会自动添加cname记录，但这不代表你不能更改这个cname记录，他的验证方法和非同一账户下是一样的   

### 如何配置SaaS（Pages跳过  
**首先你需要有两个域名：** ~其实一个域名的两个子域也可以啦，小心把自己绕晕~  
一个辅助域名：使他代理CF流量，不对外，记为B域名  
一个对外域名：这个域名就是你想让用户访问的域名，也就是未优选时源站配置的域名，记为A域名（或者你想换一个  

把B域名随便写一条解析（A、AAA、cname都行）到你的源站，记为`origin.B`，**不要修改你的源站配置，因为最终的响应头不是B**（此时你应该在CF的DNS记录界面，也就是B域名页面下的一个子页面  
**在CF的B域名界面下点击左侧的SSL/TLS下的自定义主机名**（第一次打开要绑卡验证，不搞超过100个自定义主机名不会扣你钱的  
![image.png](https://imgbed.haokun.me/file/1766410659686_image.png)  
然后设置回退源，可以随便设置一个，也可以设置为刚才的`origin.B`  
![image.png](https://imgbed.haokun.me/file/1766412110709_image.png)  
然后添加自定义主机名  
自定义主机名填你想对外让用户访问的域名，记为`blog.A`
自定义源服务器就是辅助域名（他指向你的源站），这里就是`origin.B`（如果前面回退源是`origin.B`这里可以选默认源服务器
![image.png](https://imgbed.haokun.me/file/1766412226293_image.png)  
点击添加后，就会出现让你验证的内容，按要求添加子域的TXT记录即可（图示域名是我一个已经过期的域名
![image.png](https://imgbed.haokun.me/file/1766412598105_image.png)  

**因为SaaS(自定义主机名)是添加在我们的辅助域名下的，所以想用上这个SaaS，我们需要将对外域名指向到辅助域名下**，正是因为CF对启用SaaS的要求只要求是同一个域名下的子域就行，所以我们不一定要把`blog.A`cname到`origin.B`,我们可以新建一条`cdn.B`并将其cname到优选节点，这时因为设置了回退源并且它符合激活条件，流量就会被代理到源站（但header没变，还是`blog.A`）  

**至此，SaaS配置完成**

### Pages如何添加优选域名呢（SaaS跳过

直接修改cname记录会导致自定义域停用，~CF发现你偷偷改了~，**这时候我们可以修改自定义域的NS记录到阿里云等支持线路分流解析的服务商**，然后添加一条默认记录，就写自定义域那里让你填的cname记录（这时候那个自定义域应该显示停用）  

**这时候我们添加一条中国大陆的分流解析到优选域名**，就能实现CF这个“海外服务商”从海外“查DNS”发现配置是正确的，给我们的自定义域发证书了，而大陆用户“查DNS”到了优选域名，在CF眼中到优选节点和默认节点的请求看起来是一模一样的，也就导到我们的pages项目了  

**至此，Pages使用优选域名配置完成**

**至此，CF就知道了我们的域名和源站的关联性**

# 那么上哪找优选域名呢？

本人优选域名：`cf.4848488.xyz`  
也可以去`cf.090227.xyz`查找更适合自己的  
也可以自己搞一个

直接把域名绑定到阿里云等，然后写一堆A记录添加分流解析到不同的ip（对应运营商比较快的）即可  

~或者像我一样发现有的优选域名电信快，有的移动快，直接cname抄作业~    ~别问为什么没有联通~

# 至此，你的网站就会很绿了（联通还是算了吧，没法优选）  
![image.png](https://imgbed.haokun.me/file/1766409075347_image.png)



###### 其实连接海外VPS丢包太严重也可以用这种方法哦（比如魔法上网
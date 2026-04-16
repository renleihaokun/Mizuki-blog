---
title:  让大模型回归一个工具
published: 2026-01-11
pinned: false
description: 介绍大模型以及提示词的写法
tags: [LLM, AI]
category: AI
licenseName: "CC BY 4.0"
author: renleihaokun
draft: true
date: 2026-01-11
pubDate: 2026-01-11
permalink: "prompt"
image: "https://imgbed.haokun.me/file/1768147362571_a6ab8eb0b4876e4fe0c81ebcb99246d8.png"
---

# 先问一个问题
  
<details>
<summary>和你聊天的AI有感情吗？</summary>

其实并没有，他们只是一个工具。  
就算有，也和咱人类完全不一样，最好不能当成人来看待。

</details>

## 先简单了解一下大模型（LLM）是如何生成“人话”的  
我们高中数学就学过，一对或一组数据可以拟合成数学函数，这个拟合出的函数还能用于预测新数据  
函数不够用时，就需要用上神经网络，总之就是各种数学运算  
对于非数字的东西，可以通过各种方式把他们**映射**成数字，然后进行数学运算等等的，训练出一个模型来预测新数据  

**那么自然语言呢？**
直接把每个字符当作最小单位来分词（转换成数字）显然不太合适，不然AI给你生成一堆自造的词。
所以这里就引入了**token**的概念，token就是对AI来说的最小单元，既是训练数据的最小单元也是输出的最小单元  
~当初第一次看到这词我还在想这跟密钥令牌之类的有啥关系😅~  

所以AI其实就是在分析你输入的token后面**大概率**要接什么token，然后把那token甩给你  
输出的token多了，就连成了”人话“  

## 那大模型为什么会让我们感觉他聪明  
早期的模型只是注重学习”人话“，并不在意逻辑推理  
所以他们会一本正经地瞎说，我愿类比为人类喝醉后的**没脑子一本正经吹牛状态**  

~骗你的，新模型也这样~
![41b1aabf6a6cacd3edecafdcfe6c901d.png](https://imgbed.haokun.me/file/1768147218447_41b1aabf6a6cacd3edecafdcfe6c901d.png)  

---
title: 随机座位表的故事
published: 2025-12-03
pinned: false
description: 💩山往事
tags: [story, 石山代码]
category: Story
licenseName: "Unlicensed"
author: renleihaokun
draft: true
date: 2025-12-03
image: "./cover.png"
pubDate: 2025-01-20
permalink: "randomseat"
---

事件起因：高一时的班主任让我做一个随机座位表  
然后当时水平并不高的我在GPT4的帮助下完成了一个曲线救国的思路（GPT仅协助Py语法部分，就是相信自己能想出来解法

（开头就能看出问题了吧，引这么多库何意味呢）

```python
import pandas as pd
import random as rn
import pyautogui
from PIL import ImageGrab
import time


df = pd.read_excel(".\高三1班学生名单.xlsx",skiprows=1)
data_list = df.values.tolist()
print("已经读取了数据")
rn.shuffle(data_list)
cout = 1
for i in data_list:
    if cout%2 == 0 and cout%8 !=0:
        print(i,"  ",end="")
        cout = cout + 1
    elif cout%8 == 0:
        print(i)
        cout = cout + 1
    else:
        print(i,end="")
        cout = cout + 1
print()
print("尝试截图")
# 暂停3秒，确保窗口在最前
time.sleep(3)
try:
    # 获取当前活动窗口的坐标和尺寸
    current_window = pyautogui.getActiveWindow()
    x, y, width, height = current_window.left, current_window.top, current_window.width, current_window.height

    time.sleep(10)

    # 截取当前窗口的截图
    screenshot = ImageGrab.grab(bbox=(x, y, x + width, y + height))

    # 获取当前系统时间
    current_time = time.localtime()

    # 格式化为可读的时间
    formatted_time = time.strftime("%Y-%m-%d %H-%M-%S", current_time)

    # 保存截图
    screenshot.save(f"{formatted_time}_window_screenshot.png")

    # 或者显示截图
    screenshot.show()
except:
    input("截图失败,请自行截图,按任意键（别按关机键）退出")
finally:
    input("截图成功,按任意键（别按关机键）退出")
```

然而这个程序我还需要发给老师，用pyinstaller编译完后程序体积就来到了————4个G

问题显而易见，Pandas库本身就像一只Panda一样“胖”，而编译还要把它塞进去，自然体积爆炸

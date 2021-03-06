# Color Bayan

>大家都有一颗音乐的心，但有时却受制于环境而不能表现出来。针对这个情况我们做了一个音乐界面，无论你有没有乐器、或是处身于安静的图书馆、又或是在舍友都睡着的凌晨三四点的夜晚，你都可以随性进行弹奏，希望你会喜欢上这个程序。

这是一个音乐页面,可以通过键盘或鼠标点击来模拟巴扬，钢琴等乐器的发声；操作难度较大，仅供学习和参考。

##主要功能特点：
1. 支持切换显示巴扬键盘和钢琴界面
1. 自带音色库，音色逼真。
1. 鼠标点击或键盘按下对应的巴扬琴键可以模拟巴扬弹奏
1. 在巴扬键盘界面，按下巴扬琴键时，会显示音名，同时会改变颜色，同一音名的键显示颜色相同
1. 在钢琴界面，按下键时，会在钢琴键盘上显示绝对音高，并以卷帘动画的形式，显示每个音符的时值。
1. 支持切换键盘布局，以便在音域宽广和指法便利中进行权衡
1. 支持转调功能。按回车或Shift音调升高或降低八度，按方向键左右音调升高或降低一个半音。
1. 本地MIDI文件可以拖放进浏览器，按空格键自动播放/暂停。可用于伴奏或者观看自动演奏学习指法。

## 运行方法：

1. 本网页使用了nodejs部署客户端。请先安装[nodejs](https://nodejs.org/en/)以及npm包管理工具

2. 本网页使用了gulp进行热编译。需要先安装gulp。安装命令如下：

```
npm install --global gulp
```

3. 如果gulp安装完成，输入`gulp -v`可查看gulp的版本。

4. 切换到Color-Bayan目录，执行：`npm install`安装相应的依赖包。

5. 在命令行输入`gulp`进行热编译，等待服务器启动

6. 服务器启动后在8081端口启动

7. 如果有兴趣，可以访问网站http://bayan.ferrets.me


## lib.slider

轮播组件

### 组件描述:

    横向滑动组件。
    手机端很常见的一种交互方式。
    结构如下:
    <div class="slider"><!--容器层,container-->
        <div class="slider-outer"><!--滑动显示区域,wrap-->
            <ul class="slider-wrap"><!--面板元素,也就是做动画的元素,panel-->
                <li></li>   //一系列子元素,就是数据内容
                <li></li>
                ...
            </ul>
        </div>
    </div>

### 特殊处理

    对于不支持3d的设备以left的方式平移，支持3d的都以translate3d平移。设备是否支持3d参考[modernizr](http://modernizr.com/)

### 使用说明：

`var slide = new lib.slider(el,option);`

**重要提醒，若要使用懒加载，img的真实图片必须放在dataimg这个自定义属性中。**

- el - 大容器，包含面板元素、触发元素、上下页等
- options - 选项
    - container [String || Object]  大容器，默认为'.slider'。（包含面板元素、触发元素、上下页等）若设置了el，则会覆盖此属性
    - wrap [String]  滑动显示区域，默认为container的第一个子元素。（该元素固定宽高overflow为hidden，否则无法滑动）
    - panel [String]  面板元素，默认为wrap的第一个子元素
    - trigger [String]  触发元素，也可理解为状态元素
    - activeTriggerCls [String]  触发元素内子元素的激活样式，默认'sel'
    - hasTrigger [Boolean]  是否需要触发事件，例tab页签就需要click触发，默认false
    - steps [Number]  每次滑动的距离，默认0
    - left [Number]  panel初始的x坐标，默认0
    - visible [Number]  每次滑动几个panels，默认1
    - margin [Number]  面板元素内子元素间的间距，默认0
    - curIndex [Number]  初始化在哪个panels上，默认0为第一个
    - duration [Number]  动画持续时间，默认300ms
    - loop [Boolean]  动画循环，默认false
    - play [Boolean]  动画自动播放，默认false
    - interval [Number]  播放间隔时间，默认5000ms，play为true时才有效
    - useTransform [Boolean]  以translate方式动画，支持3d默认true，不支持默认false

    - lazy [String]  图片延时加载属性，默认'.lazyimg'
    - lazyIndex [Number]  默认加载到第几屏，默认1
    - callback [Function]  动画结束后触发

    - prev [String]  上一个元素
    - next [String]  下一个元素
    - activePnCls [String]  prev和next在头尾时的样式，默认'none'

### 实例API说明：

#### instance.reset(option)

重置slide实例的一些属性（不可重置元素属性container,wrap等），在全屏切换时需要使用

- option - 同实例中的option

#### instance.slideTo(cur,duration)
滑动至第cur个panels。

- cur - 同实例中的curIndex
- duration - 同实例中的duration

#### instance.begin()
自动播放

#### instance.stop()
停止播放

#### instance.destroy()
销毁slide事件

#### instance.attachTo()
有问题，别使用，之后会放在构造函数下
若要批量实例，请自行循环


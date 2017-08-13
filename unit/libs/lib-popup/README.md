
## lib.popup

* lib.popup(config) - 初始化一个弹出层
	* config.content - 弹出层主体区域html内容
	* config.size - 弹出层的尺寸，设定一个数值对象或设为'auto'
	* config.background - 弹出层的背景颜色
	* config.opacity - 弹出层背景透明度
	* config.mask - 是否启用遮罩，默认false
	* config.maskOpacity - 遮罩透明度
	* config.position - 弹出层定位，'top/center/bottom'，或者是具体的百分比，如'10% 20%'
	* config.offset.left - 弹出层偏移，单位为px
	* config.offset.top - 弹出层偏移，单位为px
	* config.closeTime - 定时关闭弹出层，默认为0，不关闭，单位ms
	* config.action - 是否开启行动栏，默认flase
	* config.actionConfig - 行动栏目配置
* lib.popup.loading(config) - 初始化一个正在载入的弹出层
* lib.popup.note(text,closeTime|config) - 初始化一个信息提示弹出层
* lib.popup.confirm(text,confirmCallback,cancelCallback,config) － 初始化一个确认的弹出层
* lib.popup.alert(text,config) － 初始化一个提醒的弹出层

## popup实力方法
* remove() - 移除弹出层
* hide() - 隐藏弹出层
* fadeOut(callback) - 渐隐弹出层
* show() - 显示弹出层


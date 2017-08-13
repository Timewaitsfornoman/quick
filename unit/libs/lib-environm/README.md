
## lib.env

环境检测插件

* lib.version(strVersion) - 返回一个版本号的对象
	* instance.gt(strVersion) - 大于指定版本号
	* instance.gte(strVersion) - 大于等于指定版本号
	* instance.lt(strVersion) - 小于指定版本号
	* instance.lte(strVersion) - 小于等于指定版本号
	* instance.eq(strVersion) - 等于指定版本号
	* instance.compare(strVersion) - 比较指定版本号，返回-1表示小于，返回0表示等于，返回1表示大于
* lib.env.os - 操作系统的对象
	* os.name - Android/iOS/unknown
	* os.version - 相应的版本号
	* os.isIPhone - 是否是iPhone/iPod Touch
	* os.isIPad - 是否是iPad
	* os.isIOS - 是否是iOS
	* os.isAndroid - 是否是Android
* lib.env.browser - 浏览器的对象
	* browser.name - UC/QQ/Xiaomi/Chrome/Android/Safari/iOS Webview/unknown
	* browser.version - 相应的版本号
	* browser.isUC - 是否是UC浏览器
	* browser.isQQ - 是否是QQ浏览器
	* browser.isXiaomi - 是否是小米浏览器
	* browser.isChrome - 是否是Chrome浏览器
	* browser.isAndroid - 是否是Android的原生浏览器
	* browser.isSafari - 是否是Safari浏览器
	* browser.isWebview - 是否是iOS下的Webview
* lib.env.app - 检测客户端的对象
    * app.name - 客户端名称 如Weixin/Weibo/Mizhe/MizheHD/Beibei/BeibeiHD/unknown
    * app.isWeixin - 是否在微信中
    * app.isWeibo - 是否在微博中
    * app.isMizhe - 是否是米折
    * app.isMizheHD - 是否是米折HD版本
    * app.isBeibei - 是否是贝贝
    * app.isBeibeiHD - 是否是贝贝HD版本
* lib.env.husorApp - 互秀客户端的对象，如果没有，表示不在客户端里
	* husorApp.appname - 互秀客户端名称 Mizhe/MizheHD/Beibei/BeibeiHD
	* husorApp.version - 互秀客户端的版本
	* husorApp.platform - iPhone/iPad/Android


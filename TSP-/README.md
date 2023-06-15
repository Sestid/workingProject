# TSP-
利用Antd Desgin Pro 搭建的系统并开发
	<strong>负责部分：</strong></br>
		1、系统搭建</br>
		2、OBU和MEC所有前端部分</br>
		3、车辆管理、OBU、MEC三个页面的删除和注册弹框</br>
		4、（接口对接我不负责-----hahaha----）</br>
		<strong>项目介绍：</strong></br></br>
		TSP车辆监控平台：</br></br>![image](https://github.com/xiaola66/TSP-/blob/master/img/total.png)</br></br>		
		前端展示界面通过mqtt的协议方式与后端来进行数据交换</br>
		前端给回相关的控制信息， 我们TSP平台能够反馈给MEC，然MEC来实施控制</br>
		利用Antd Desgin Pro 技术栈完成的所有页面</br>
		经过好几次迭代完成</br>
<strong>下面是详细的页面展示（每个页面还有各个功能）</strong></br></br>
		<strong>一、车辆管理：</strong>(包括登入，注册，删除)</br></br>
		<strong>1、车辆登入:</strong></br>
		服务协议为HTTP REST或MQTT之间按MEC实施需求选一种。服务支持参数包括：</br>
vin： 车vin号（必须提供）</br>
validState: 车辆状态（必须提供）</br>
expireTimestamp：失效时间（必须提供）</br>
如果vin未注册或已登入，则报错。如果expireTimestamp已过期，则报错。</br></br>
<strong>2、车辆注册:</strong></br>
		服务协议为HTTP REST。服务支持参数包括：</br>
vin： 车vin号（必须提供）</br>
carType：车型（必须提供）</br>
carType：车型（必须提供）</br>
carPriority：车辆优先级(必须提供，用于后续发生轨迹冲突时进行优化条件)</br>
车型的3D建模、宽度、长度等信息通过手工完成。如果vin已注册、或carType不存在，则报错。</br></br>
<strong>3、车辆删除:</strong></br>
		服务协议为HTTP REST。服务支持参数包括：</br>
vin： 车vin号（必须提供）</br>
如果vin未注册，则报错。</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/vehicle.png)</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/vlogin.png)</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/vdelenter.png)</br></br></br>
		
		<strong>二、OBU管理：</strong>(包括登入，注册，删除)</br></br>
		<strong>1、OBU登入:</strong></br>
		服务协议为HTTP REST或MQTT之间按MEC实施需求选一种。服务支持参数包括：</br>
obu_id： OBU ID（必须提供）</br>
validState: OBU状态（必须提供）</br>
expireTimestamp：失效时间（必须提供）</br>
如果obu_id未注册或已登入，则报错。如果expireTimestamp已过期，则报错。</br></br>
<strong>2、OBU注册服务:</strong></br>
		服务协议为HTTP REST。服务支持参数包括：</br>
vin： 车vin号（必须提供）</br>
obu_id：OBU ID（必须提供）</br>
如果obu_id已注册、或vin已和OBU绑定，则报错。</br></br>
<strong>3、OBU删除服务:</strong></br>
		服务协议为HTTP REST。服务支持参数包括</br>
obu_id：OBU ID（必须提供）</br>
如果obu_id未注册，则报错。</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/obu.png)</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/ologin.png)</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/odelenter.png)</br></br></br>
			
			<strong>三、MEC服务管理：</strong>(包括登入，注册，删除)</br></br>
		<strong>1、MEC登入:</strong></br>
		服务协议为HTTP REST或MQTT之间按MEC实施需求选一种。服务支持参数包括：</br>
mec_id： MEC ID（必须提供）</br>
validState: OBU状态（必须提供）</br>
expireTimestamp：失效时间（必须提供）</br>
如果mecId未注册或已登入，则报错。如果expireTimestamp已过期，则报错。</br></br>
<strong>2、MEC及其连接设备注册服务:</strong></br>
		服务协议为HTTP REST。服务支持参数包括：</br>
mec_id： MEC ID（必须提供）</br>
locationId：位置的 ID（必须提供）</br>
可以装MEC的位置坐标与高度通过手工后台输入。MEC及其所连接的设备通过后台手工输入。如果mec_id已注册、或location已和MEC绑定，则报错。</br></br>
<strong>3、MEC删除服务:</strong></br>
		服务协议为HTTP REST。服务支持参数包括：</br>
mec_id：MEC ID（必须提供）</br>
如果mec_id未注册，则报错。</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/mec.png)</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/mlogin.png)</br></br>
			![image](https://github.com/xiaola66/TSP-/blob/master/img/mdelenter.png)</br></br></br>

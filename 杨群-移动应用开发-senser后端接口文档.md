## 移动应用开发-传感器端涉及的后端接口
<p align="left">Design by 杨群</p>
<font color='red'> 请勿将ip地址或此文档外传，服务器计算资源有限！(以防DOS攻击) </font>

**请求数据格式为: application/x-www-form-urlencoded 格式的表单数据**

1. 将传感器感知数据发送至服务器

推荐：每 60s 发送1次

```javascript
// 发送的数据
// method: POST
// url: http://101.132.44.168:4001/api/postCurrentData
{
    "username": "test"
    "tempture": 23
    "humidity": 40
    "illumination": 100
    "co2": 46
    "time": "21:53:30"
}
// 响应的数据
{
    "status": 0,
    "message": "插入感知数据成功！"
}
```
2. 获取历史感知数据记录 

推荐：每 1s 获取1次

```javascript
// 发送的数据
// method: GET
// url: http://101.132.44.168:4001/api/historyData
{
    "username": "test"
}
// 响应的数据
{
    "status": 0,
    "data": [
        {
            "id": 2,
            "tempture": "23",
            "humidity": "40",
            "illumination": "100",
            "co2": "46",
            "time": "21:53:30",
            "username": "test"
        }
    ],
    "message": "获取感知数据成功！"
}
// 注:data为数据，每一元素为一条感知数据
```
3. 获取当前设备状态

推荐：每 1s 获取1次

```javascript
// 发送的数据
// method: GET
// url: http://101.132.44.168:4001/api/currentEquiment
{
    "username": "test"
}
// 响应的数据
{
    "status": 0,
    "data": {
        "username": "test",
        "thermomechanical": null,
        "cold_machine": 1,
        "Roller_blinds": null,
        "lamp": 1,
        "Fan0": null,
        "Fan1": null,
        "Fan2": null,
        "Fan3": null,
        "Fan4": 0,
        "Fan5": null,
        "Fan6": 1,
        "Fan7": null,
        "Fan8": null
    },
    "message": "获取设备信息成功！"
}
// 注: 值为 null或 0 即该设备未开启      值为 1 设备才是开启状态 
```
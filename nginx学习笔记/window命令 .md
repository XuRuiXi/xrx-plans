### window常用命令 

pwd：显示当前目录

### 关于端口 | PID | 端口占用情况

netstat -ano会打印所有端口占用情况，搭配findstr可以查看某个端口的占用情况
```
netstat -ano | findstr "445"
```
![netstat -ano | findstr "445"](./assets/window端口.png)


### 杀进程
强制杀死pid为16036的进程
```
taskkill /f /pid 16036
```
![taskkill](./assets/window杀进程.png)

根据名称杀进程
```
taskkill /f /im nginx.exe
```
![Alt text](./assets/window根据名称杀进程.png)

### 查看进程
查找通过nginx.exe启动的进程
``` 
tasklist | findstr "nginx.exe"
```
查找21212端口的进程
```
tasklist | findstr "21212"
```
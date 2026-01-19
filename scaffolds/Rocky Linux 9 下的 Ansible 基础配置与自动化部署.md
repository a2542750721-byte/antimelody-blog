**项目目标**：在 Minimal 环境下，实现 **Servera (主控)** 对 **Serverb (被控)** 的免密管理，并通过 Playbook 完成用户创建与文件分发。
**环境**：Rocky Linux 9 Minimal (双节点虚拟机)

---

## 第一章：环境准备 (The Foundation)

地基不牢，地动山摇。Minimal 系统缺少很多基础包，且默认源在国内网络下极慢，必须先打好地基。

### 1. 网络与解析

- **设置主机名**：
    
    Bash
    
    ```
    hostnamectl set-hostname servera  # 在主控机执行
    hostnamectl set-hostname serverb  # 在被控机执行
    ```
    
- **Hosts 解析 (关键)**：
    
    - 编辑 `/etc/hosts`，确保两台机器都能通过名字 ping 通对方。
        
    - _格式_：`192.168.x.x servera`
        

### 2. 软件源替换 (解决下载慢/报错)

默认的 Rocky 源和 EPEL 源可能导致 `dnf install` 失败或卡死。

- **替换 Rocky 基础源 (阿里云)**：
    
    Bash
    
    ```
    sed -e 's|^mirrorlist=|#mirrorlist=|g' \
        -e 's|^#baseurl=http://dl.rockylinux.org/$contentdir|baseurl=https://mirrors.aliyun.com/rockylinux|g' \
        -i.bak /etc/yum.repos.d/rocky-*.repo
    ```
    
- **安装 EPEL 源 (Ansible 所在仓库)**：
    
    Bash
    
    ```
    dnf install epel-release -y
    ```
    
- **修复 EPEL 源 (避坑指南 💣)**：
    
    - _问题_：直接安装的 epel 配置可能无法加载，导致报错。
        
    - _解决_：直接覆盖配置。
        
    
    Bash
    
    ```
    cat <<EOF > /etc/yum.repos.d/epel.repo
    [epel]
    name=Extra Packages for Enterprise Linux 9 - \$basearch
    baseurl=https://mirrors.aliyun.com/epel/9/Everything/\$basearch
    enabled=1
    gpgcheck=0
    EOF
    ```
    

### 3. 安装工具

在 **Servera** 上执行：`dnf install ansible -y`

---

## 第二章：SSH 免密与基础配置 (Topic 12)

### 1. SSH 免密通道搭建

- **生成密钥**：`ssh-keygen -t rsa` (一路回车)
    
- **分发公钥**：
    
    Bash
    
    ```
    ssh-copy-id root@serverb  # 给被控节点
    ssh-copy-id root@servera  # 给自己 (题目要求主控也是受控组员)
    ```
    
- **防火墙坑点**：
    
    - 如果报错 `No route to host`，是因为 Rocky 9 默认防火墙拦截了 SSH。
        
    - _解决_：`systemctl stop firewalld` (两台机器都做)。
        

### 2. Ansible 核心配置

题目要求工作目录在 `/root/ansible`。

- **主机清单 (hosts)**：
    
    - 文件内容：
        
        Ini, TOML
        
        ```
        [dev]
        servera
        [ops]
        serverb
        ```
        
- **配置文件 (ansible.cfg)**：
    
    - 关键配置项：
        
        Ini, TOML
        
        ```
        [defaults]
        inventory = /root/ansible/hosts
        remote_user = root
        host_key_checking = False  # 跳过指纹验证，提高效率
        ```
        
- **验证**：运行 `ansible all -m ping`，看到绿色的 `SUCCESS` 才算过关。
    

---

## 第三章：编写剧本 (Topic 13)

### 任务：Ad-hoc.yaml 编写

_虽然文件名叫 ad-hoc，但实质是 Playbook。需满足：在 ops 组执行、创建用户、分发配置。_

**YAML 源码 (注意缩进)**：

YAML

```
---
- name: Simple Ansible usage
  hosts: ops                  # 1. 指定主机组
  tasks:
    - name: Create user
      user:
        name: ansibleuser12
        comment: ansibleuser12
        state: present

    - name: Copy config file
      copy:
        src: /root/ansible/ansible.cfg
        dest: /root/ansible.cfg  # 2. 必须写完整路径，防止只复制到目录下改名
        owner: ansibleuser12     # 3. 题目要求的特殊权限
        group: ansibleuser12
```

**执行命令**：

Bash

```
ansible-playbook ad-hoc.yaml
```

---

## 第五章：技术总结与踩坑记录

1. **路径陷阱 (Path Pitfall)**：
    
    - 在 `copy` 模块中，`dest: /root` 和 `dest: /root/ansible.cfg` 效果不同。如果目标路径下没有同名目录，写 `/root` 可能会把文件重命名为 `root`。
        
    - _经验_：**写死完整目标路径**永远是最稳妥的。
        
2. **源的可用性**：
    
    - Rocky Linux 9 Minimal 极其精简，通过 `sed` 修改源比下载 `repo` 文件更稳，因为可能连 `wget` 都没有。
        
3. **自我测试技巧**：
    
    - 不需要登录到 Serverb 去检查结果，学会使用 Ad-hoc 命令远程验证：
        
        Bash
        
        ```
        # 查文件权限
        ansible ops -a "ls -l /root/ansible.cfg"
        # 查用户信息
        ansible ops -a "id ansibleuser12"
        ```
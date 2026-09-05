# lux_gkd_rules

为我的小米 17 (HyperOS) 定制的 [GKD](https://gkd.li) 订阅规则仓库。规则精选自上游聚合订阅, 并按自己手机实际情况持续调整。

## 订阅地址

GKD App → 订阅 → 添加, 任选其一:

```txt
https://raw.githubusercontent.com/Androidluxi/lux_gkd_rules/main/dist/gkd.json5
```

大陆镜像:

```txt
https://fastly.jsdelivr.net/gh/Androidluxi/lux_gkd_rules@main/dist/gkd.json5
```

## 目录结构

- 订阅详情 [./src/subscription.ts](./src/subscription.ts)
- 全局规则 (开屏广告/更新提示/青少年模式) [./src/globalGroups.ts](./src/globalGroups.ts)
- 全局规则黑名单 (这些应用内禁用全局规则) [./src/globalDefaultApps.ts](./src/globalDefaultApps.ts)
- 规则分类 [./src/categories.ts](./src/categories.ts)
- 应用规则 [./src/apps](./src/apps/) — 每个应用一个文件, 文件名为包名
- 构建产物 [./dist](./dist/)

收录范围: 小米系统应用 (手机管家、系统广告、应用商店、安装器、相册、云服务等) + 常用应用 (微信、QQ、抖音、快手、B站、小红书、淘宝、京东、拼多多、网易云、酷安、知乎)。

## 按自己手机的实际情况更新规则

### 方式一: 从上游同步最新规则

规则源文件来自 [Lin-arm/GKD_subscription](https://github.com/Lin-arm/GKD_subscription), 需要更新时运行:

```shell
pnpm sync                    # 同步全部跟踪列表中的应用
pnpm sync com.xxx.yyy        # 临时同步列表外的应用
```

同步后用 `git diff` 检查变化, 在 GKD 里实测, 误触或不生效的规则直接改 `src/apps/` 下对应文件 (小米 17 的 HyperOS 与上游适配的 MIUI/HyperOS 版本可能有差异)。

### 方式二: 自己抓快照写规则

上游没有覆盖、或在你手机上失效的界面:

1. GKD App 内对目标界面**保存快照**
2. 打开 [GKD 快照审查工具](https://gkd.li/inspector/) 导入快照, 生成选择器
3. 写入 `src/apps/<包名>.ts` 对应应用的 `groups` 中 (没有该文件就新建一个, 参考 [apps/com.tencent.mm.ts](./src/apps/com.tencent.mm.ts) 的结构)
4. 分组命名以 `开屏广告` 开头会自动排到全局开屏规则之前

### 提交与发布

直接 push 到 `main` 即可, GitHub Actions 会自动格式化并构建发布 (需在仓库 Settings → Actions → Workflow permissions 开启 Read and write permissions)。也可以本地运行:

```shell
pnpm check   # 类型检查 + 规则校验
pnpm build   # 构建到 dist/
```

## 环境

- nodejs>=**22** (选择器中的 Java/Kotlin 正则需要 node 22 的 WasmGc 校验)
- pnpm>=9

```shell
pnpm install   # 网络问题可加 --registry=https://registry.npmmirror.com
```

/**
 * 从上游订阅(Lin-arm/GKD_subscription)同步指定应用的规则文件到 src/apps
 *
 * 用法:
 *   pnpm sync                 # 同步 scripts 内 SYNC_APPS 列出的全部应用
 *   pnpm sync com.tencent.mm  # 只同步指定的应用(可传多个), 也会加入长期跟踪列表
 *
 * 上游不可达时自动切换 jsdelivr 镜像。
 * 同步后请检查 git diff, 按小米17 (HyperOS) 实际情况手动调整规则再提交。
 */
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const UPSTREAM = 'Lin-arm/GKD_subscription';
const MIRRORS = [
  (id: string) =>
    `https://raw.githubusercontent.com/${UPSTREAM}/main/src/apps/${id}.ts`,
  (id: string) =>
    `https://fastly.jsdelivr.net/gh/${UPSTREAM}@main/src/apps/${id}.ts`,
];

const APPS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../src/apps');

const SYNC_APPS = [
  // 小米系统应用
  'com.miui.securitycenter',
  'com.miui.securityadd',
  'com.miui.systemAdSolution',
  'com.xiaomi.market',
  'com.miui.packageinstaller',
  'com.miui.gallery',
  'com.miui.cleanmaster',
  'com.miui.cloudservice',
  'com.xiaomi.shop',
  'com.miui.player',
  'com.xiaomi.smarthome',
  'com.xiaomi.mimobile',
  'com.lbe.security.miui',
  'com.xiaomi.scanner',
  'com.miui.video',
  'com.xiaomi.bluetooth',
  // 社交通讯
  'com.tencent.mm',
  'com.tencent.mobileqq',
  // 短视频/社区
  'com.ss.android.ugc.aweme',
  'com.smile.gifmaker',
  'tv.danmaku.bili',
  'com.xingin.xhs',
  // 电商
  'com.taobao.taobao',
  'com.jingdong.app.mall',
  'com.xunmeng.pinduoduo',
  // 工具/音乐/其他
  'com.netease.cloudmusic',
  'com.tencent.qqmusic',
  'com.coolapk.market',
  'com.zhihu.android',
];

async function fetchApp(id: string): Promise<string> {
  let lastErr: unknown;
  for (const mirror of MIRRORS) {
    try {
      const res = await fetch(mirror(id));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text.includes('defineGkdApp'))
        throw new Error('返回内容不是 GKD 应用规则');
      return text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

const cliApps = process.argv.slice(2);
if (cliApps.length > 0) {
  for (const id of cliApps) {
    if (!SYNC_APPS.includes(id)) SYNC_APPS.push(id);
  }
}

let ok = 0;
for (const id of SYNC_APPS) {
  try {
    const text = await fetchApp(id);
    await writeFile(join(APPS_DIR, `${id}.ts`), text, 'utf8');
    console.log(`✔ ${id}`);
    ok++;
  } catch (e) {
    console.error(`✘ ${id}: ${e instanceof Error ? e.message : e}`);
  }
}

console.log(`\n完成: ${ok}/${SYNC_APPS.length}`);
if (cliApps.length > 0) {
  console.log(
    `提示: 新增的应用 ${cliApps.join(', ')} 若需长期跟踪, 请手动加入本文件顶部的 SYNC_APPS`,
  );
}

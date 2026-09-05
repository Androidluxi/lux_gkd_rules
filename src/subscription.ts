import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import type { RawApp, RawAppGroup } from '@gkd-kit/api';
import categories from './categories';
import globalGroups, { OPEN_AD_ORDER } from './globalGroups';

const apps = await batchImportApps(`${import.meta.dirname}/apps`);

const rawApps: RawApp[] = [];

apps.forEach((appConfig) => {
  appConfig.groups?.forEach((g: RawAppGroup) => {
    // 让应用内"开屏广告"分组排在全局开屏规则之前, 命中后不再触发全局规则
    if (g.name.startsWith('开屏广告')) {
      g.order = OPEN_AD_ORDER;
    }
  });
  rawApps.push(appConfig);
});

export default defineGkdSubscription({
  id: 273170906,
  name: 'Lux 的小米订阅',
  version: 1,
  author: 'Androidluxi',
  checkUpdateUrl: './gkd.version.json5',
  supportUri: 'https://github.com/Androidluxi/lux_gkd_rules/issues',
  categories,
  globalGroups,
  apps: rawApps,
});

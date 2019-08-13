// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';

// 以下为本地化的内容。
const locales: Locales = {
    "zh-cn": {
        'name': '中文简体',
        'statistic': '项目统计',
        'none-project': '未选择任何项目',
        'path': '路径',
        'sum': '总计',
        'type': '类型',
        'files': '文件',
        'lines': '行数',
        'avg': '平均行数',
        'max': '最大行数',
        'min': '最小行数',
        'vcs': 'VCS',
    },

    "en": {
        'name': 'English',
        'statistic': 'statistic',
        'none-project': 'no project selected',
        'path': 'path',
        'sum': 'sum',
        'type': 'type',
        'files': 'files',
        'lines': 'lines',
        'avg': 'avg',
        'max': 'max',
        'min': 'min',
        'vcs': 'VCS',
    }
};

let localeID = 'en';

/**
 * 显示指定标记的语言
 *
 * @param key 该条语言的标记，如果不存在，则原样返回
 */
export function l(key: string): string {
    return locales[localeID][key];
}

/**
 * 返回当前语言的 ID，比如 zh-cn 等
 */
export function id(): string {
    return localeID;
}

/**
 * 初始化，仅需要在入口入调用。
 */
export function init() {
    localeID = 'en'; // 默认值

    const cfg = process.env.VSCODE_NLS_CONFIG;
    if (cfg === undefined) {
        const msg = '无法获取 process.env.VSCODE_NLS_CONFIG，将区域信息设置为默认值！';
        vscode.window.showErrorMessage(msg);
        return;
    }

    const config = JSON.parse(cfg);
    const locale = (<string>config.locale).toLowerCase();
    if (locales[locale] === undefined) {
        const msg = '无法获取 ' + config.locale + ' 的本地化内容，采用默认值！';
        vscode.window.showErrorMessage(msg);
        return;
    }

    localeID = config.locale;
}

interface Locale {
    [index: string]: string;
    name: string;
}

interface Locales {
    [index: string]: Locale;
}

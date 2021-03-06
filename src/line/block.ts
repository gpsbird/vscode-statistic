// SPDX-License-Identifier: MIT

export enum BlockType {
    string, // 字符串
    signalComment, // 单行注释
    multipleComment, // 多行注释
}

/**
 * Block 定义了在文件中查找指定功能代码块的功能
 *
 * 我们只需要统计注释行，所以 Block 一般用于定义特定语言的注释块查找功能。
 */
export interface Block {
    readonly type: BlockType;

    /**
     * 检测当前行中是否包含当前代码块的起始内容
     *
     * @param line 用于查找的行
     * @returns 返回起始内容的下一字符位置，可以有以下值：
     * -1 表示正好在结尾处；
     * 0 表示未找到；
     * >0 表示真正的位置；
     */
    begin(line: string): number;

    /**
     * 检测当前行中是否包含当前代码块的结束内容
     *
     * @param line 用于查找的行
     * @returns 返回起始内容的下一字符位置，可以有以下值：
     * -1 表示正好在结尾处；
     * 0 表示未找到；
     * >0 表示真正的位置；
     */
    end(line: string): number;
}

/**
 * 定义了查找字符串的 Block 接口实现
 *
 * 因为字符串中可能包含注释代码的起止符，需要过滤这些内容。
 */
export class String implements Block {
    readonly type = BlockType.string;
    private readonly escape?: string;
    private readonly beginString: string;
    private readonly endString: string;

    constructor(begin: string, end: string, escape?: string) {
        if (escape !== undefined && escape.length > 1) {
            throw new Error('escape 长度只能为 1');
        }

        this.beginString = begin;
        this.endString = end;
        this.escape = escape;
    }

    public begin(line: string): number {
        let pos = line.indexOf(this.beginString);
        if (pos === -1) { return 0; }

        pos += this.beginString.length;
        return (pos >= line.length) ? -1 : pos;
    }

    public end(line: string): number {
        let pos = line.indexOf(this.endString);
        const next = pos + this.endString.length;

        switch (pos) {
            case -1:
                return 0;
            case 0: // 在起始位置找到
                return this.endString.length;
            default:
                if ((this.escape === undefined) || line[pos - 1] !== this.escape) {
                    pos = next;
                } else { // 转义字符
                    const pp = this.end(line.slice(pos + 1)); // 1 表示从转义字符之后的位置开始
                    if (pp <= 0) { return pp; }
                    pos = pos + 1 + pp;
                }

                return (pos >= line.length) ? -1 : pos;
        }
    }
}

/**
 * 定义了查找单行注释的 Block 接口实现
 */
export class SignalComment implements Block {
    readonly type = BlockType.signalComment;
    private readonly beginString: string;

    constructor(begin: string) {
        this.beginString = begin;
    }

    public begin(line: string): number {
        let pos = line.indexOf(this.beginString);
        if (pos === -1) { return 0; }

        pos += this.beginString.length;
        return (pos >= line.length) ? -1 : pos;
    }

    public end(line: string): number {
        return -1;
    }
}

/**
 * 定义了查找多行注释的 Block 接口实现
 * 
 * 适用大部分语言，但是不支持像 swift 等支持嵌套注释。
 */
export class MultipleComment implements Block {
    readonly type = BlockType.multipleComment;
    private readonly beginString: string;
    private readonly endString: string;

    constructor(begin: string, end: string) {
        this.beginString = begin;
        this.endString = end;
    }

    public begin(line: string): number {
        let pos = line.indexOf(this.beginString);
        if (pos === -1) { return 0; }

        pos += this.beginString.length;
        return (pos >= line.length) ? -1 : pos;
    }

    public end(line: string): number {
        let pos = line.indexOf(this.endString);
        if (pos === -1) { return 0; }

        pos += this.endString.length;
        return (pos === line.length) ? -1 : pos;
    }
}

/**
 * @file 基于 vscode 标准 TreeDataProvider 接口实现的扩展，除了 get，提供了 set 方法。
 * @author weijiaxun <weijiaxun@baidu.com>
 */

import * as vscode from 'vscode';
import ExtendedTreeItem from './ExtendedTreeItem';

export default class ExtendedTreeDataProvider implements vscode.TreeDataProvider<ExtendedTreeItem> {

    private _data: {children: ExtendedTreeItem[]} = {children: []};

    private _onDidChangeTreeData = new vscode.EventEmitter<ExtendedTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    getChildren(element?: ExtendedTreeItem) {
        const children = element ? element.children : this._data.children;
        return children;
    }

    getParent(element: ExtendedTreeItem) {
        return element.parent;
    }

    getTreeItem(element: ExtendedTreeItem) {
        return element.value;
    }

    createTreeItem(value: vscode.TreeItem): ExtendedTreeItem {
        const item = new ExtendedTreeItem(value);
        item.onDidChange(() => {
            this._onDidChangeTreeData.fire(item);
        });
        return item;
    }

    appendChildToRoot(element: ExtendedTreeItem) {
        element.parent = null;
        this._data.children.push(element);
        this._onDidChangeTreeData.fire();
    }

    removeChildFromRoot(element: ExtendedTreeItem) {
        this._data.children = this._data.children.filter(item => item !== element);
        this._onDidChangeTreeData.fire();
    }

    insertInRootBefore(element: ExtendedTreeItem, beforeElement: ExtendedTreeItem) {
        const existingIndex = this._data.children.findIndex(item => item === element);
        const index = this._data.children.findIndex(item => item === beforeElement);

        if (existingIndex > -1) {
            // reorder the element instead of inserting a new one
            this._data.children.splice(existingIndex, 1);
        }
        
        this._data.children.splice(index + 1, 0, element);
        this._onDidChangeTreeData.fire();
    }
}

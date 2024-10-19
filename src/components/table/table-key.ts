import { ReactNode } from 'react';

export interface TableKey<K> {
    type: 'actions' | 'text',
    sortValue?: string,
    title?: string,
    renderValue?: (item: K) => string | number,
    actions?: ITableAction[],
    renderMobileLabel?: (item: K) => ReactNode,
    mobileStyleClasses?: any,
    onValueClick?: () => void
}

export interface ITableAction {
    label?: string,
    type: TableActionEnum,
    onClick: Function
}

export enum TableActionEnum {
    delete,
    copy,
    add
}

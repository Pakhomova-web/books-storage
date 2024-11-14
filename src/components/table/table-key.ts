import { ReactNode } from 'react';

export interface TableKey<K> {
    type: 'actions' | 'text' | 'image',
    sortValue?: string,
    title?: string,
    renderValue?: (item: K) => string | number,
    actions?: ITableAction[],
    renderMobileLabel?: (item: K) => ReactNode,
    mobileStyleClasses?: any,
    onValueClick?: () => void
}

export interface ITableAction {
    label?: (item?) => string,
    type: TableActionEnum,
    onClick: Function,
    disable?: (item?) => boolean
}

export enum TableActionEnum {
    delete,
    copy,
    add
}

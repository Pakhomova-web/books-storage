import { ReactNode } from 'react';

export interface TableKey<K> {
    type: 'icons' | 'text',
    sortValue?: string,
    title?: string,
    renderValue?: (item: K) => string | number,
    icons?: IIcon[]
}

export interface IIcon {
    label?: string,
    element: ReactNode,
    onIconClick: Function
}

import { ReactNode } from 'react';

export interface TableKey<K> {
    type: 'icons' | 'text',
    sortValue?: string,
    title?: string,
    renderValue?: (item: K) => string | number,
    icons?: { element: ReactNode, onIconClick: (item: K) => void }[]
}

export type Order = 'asc' | 'desc';

export interface TableSort {
    orderBy: string,
    order: Order | null
}

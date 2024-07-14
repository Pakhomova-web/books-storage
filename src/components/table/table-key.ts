export interface TableKey<K> {
    type: 'actions' | 'text',
    sortValue?: string,
    title?: string,
    renderValue?: (item: K) => string | number,
    actions?: ITableAction[]
}

export interface ITableAction {
    label?: string,
    type: TableActionEnum,
    onClick: Function
}

export enum TableActionEnum {
    delete,
    copy
}

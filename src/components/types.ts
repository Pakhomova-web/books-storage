import { SortDirection } from '@mui/material';

export interface SettingListItem {
    link: string,
    title: string
}

export interface ISortKey {
    title: string;
    orderBy: string;
    order?: SortDirection
}

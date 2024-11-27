import { SortDirection } from '@mui/material';

export interface ISortKey {
    title: string;
    orderBy: string;
    order?: SortDirection
}

import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel
} from '@mui/material';
import { ReactNode } from 'react';

import { TableKey, TableSort } from '@/components/table/table-key';
import CustomTableRow from '@/components/table/custom-table-row';
import { visuallyHidden } from '@mui/utils';

interface CustomTableProps<K> {
    keys: TableKey<K>[],
    data: K[],
    renderKey: (item: K) => string | number | undefined,
    onRowClick?: (item: K) => void,
    onSort?: (sort: TableSort) => void,
    sort?: TableSort
}

function renderTableCell<T>(key: TableKey<T>, item: T, index: number): ReactNode {
    switch (key.type) {
        case 'icons':
            return <TableCell key={index} align="right">
                {key.icons?.map((icon, index) =>
                    <IconButton key={index}
                                onClick={event => {
                                    event.stopPropagation();
                                    icon.onIconClick(item);
                                }}>
                        {icon.element}
                    </IconButton>
                )}
            </TableCell>;
        default:
            return <TableCell key={index}>{key.renderValue ? key.renderValue(item) : ''}</TableCell>;
    }
}

export default function CustomTable<T>({ data, onRowClick, keys, renderKey, onSort, sort }: CustomTableProps<T>) {
    function handleRequestSort(orderBy?: string) {
        if (sort) {
            const isAsc = sort.orderBy === orderBy && sort.order === 'asc';
            const temp: TableSort = { order: isAsc ? 'desc' : 'asc', orderBy: orderBy || '' };

            if (onSort) {
                onSort(temp);
            }
        }
    }

    return (
        <TableContainer sx={{ maxHeight: 'calc(100vh - 135px)', overflowY: 'auto', overflowX: 'initial' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {keys.map((key, index) => key.sortValue ?
                            <TableCell key={index} onClick={() => handleRequestSort(key.sortValue)}>
                                <TableSortLabel active={sort?.orderBy === key.sortValue}
                                                direction={sort?.orderBy === key.sortValue ? (sort?.order || 'asc') : 'asc'}
                                                onClick={() => handleRequestSort(key.sortValue)}>
                                    {key.title}
                                    {sort?.orderBy === key.sortValue ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {sort?.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                            : <TableCell key={index}>{key.title}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item: T) => (
                        <CustomTableRow key={renderKey(item)} isClickable={!!onRowClick}
                                        onClick={() => onRowClick ? onRowClick(item) : null}>
                            {keys.map((key: TableKey<T>, index) => renderTableCell<T>(key, item, index))}
                        </CustomTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    useTheme
} from '@mui/material';
import React, { ReactNode, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { TableKey } from '@/components/table/table-key';
import CustomTableRow from '@/components/table/custom-table-row';
import { visuallyHidden } from '@mui/utils';
import { IPageable } from '@/lib/data/types';
import { MobileTable } from '@/components/table/mobile-view/mobile-table';
import { styleVariables } from '@/constants/styles-variables';
import { tableContainerStyles } from '@/components/table/table-styles';
import { renderTableCell } from '@/components/table/table-cell-render';

interface CustomTableProps<K> {
    keys: TableKey<K>[],
    data: K[],
    usePagination?: boolean,
    totalCount?: number,
    renderKey: (item: K) => string | number | undefined,
    onRowClick?: (item: K) => void,
    onChange?: (pageSettings: IPageable) => void,
    pageSettings?: IPageable,
    withFilters?: boolean,
    renderMobileView?: (item: K) => ReactNode
}

const stickyFooter = {
    position: 'sticky',
    bottom: 0,
    background: 'white'
};

const paginatorStyles = { borderTop: `1px solid ${styleVariables.gray}` };

export default function CustomTable<T>(props: CustomTableProps<T>) {
    const [page, setPage] = useState<number>(props.pageSettings?.page || 0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(props.pageSettings?.rowsPerPage || 25);
    const [anchorMenuEl, setAnchorMenuEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    function handleRequestSort(orderBy?: string) {
        if (props.pageSettings && props.onChange) {
            setPage(0);
            const isAsc = props.pageSettings.orderBy === orderBy && props.pageSettings.order === 'asc';

            props.onChange({
                ...props.pageSettings,
                page,
                order: isAsc ? 'desc' : 'asc',
                orderBy: orderBy || ''
            });
        }
    }

    function onPageChange(val: number) {
        setPage(val);
        if (props.onChange) {
            props.onChange({
                ...props.pageSettings,
                page: val
            });
        }
    }

    function onRowsPerPageChange(val: number) {
        setPage(0);
        setRowsPerPage(val);
        if (props.onChange) {
            props.onChange({
                ...props.pageSettings,
                page: 0,
                rowsPerPage: val
            });
        }
    }

    return !mobileMatches ?
        <TableContainer sx={tableContainerStyles(props.withFilters)}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {props.keys.map((key, index) => key.sortValue ?
                            <TableCell key={index} onClick={() => handleRequestSort(key.sortValue)}>
                                <TableSortLabel active={props.pageSettings?.orderBy === key.sortValue}
                                                direction={props.pageSettings?.orderBy === key.sortValue ? (props.pageSettings?.order || 'asc') : 'asc'}
                                                onClick={() => handleRequestSort(key.sortValue)}>
                                    {key.title}
                                    {props.pageSettings?.orderBy === key.sortValue ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {props.pageSettings?.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                            : <TableCell key={index}>{key.title}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data.map((item: T) => (
                        <CustomTableRow key={props.renderKey(item)} isClickable={!!props.onRowClick}
                                        onClick={() => props.onRowClick ? props.onRowClick(item) : null}>
                            {props.keys.map((key: TableKey<T>, index) =>
                                renderTableCell<T>(key, item, index, anchorMenuEl, (val: HTMLElement) => setAnchorMenuEl(val)))}
                        </CustomTableRow>
                    ))}
                </TableBody>
                <TableFooter sx={stickyFooter}>
                    {props.usePagination &&
                      <TableRow>
                        <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                         count={props.totalCount}
                                         page={page}
                                         sx={paginatorStyles}
                                         colSpan={props.keys.length}
                                         rowsPerPage={rowsPerPage}
                                         onPageChange={(_e, val: number) => onPageChange(val)}
                                         onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                      </TableRow>}
                </TableFooter>
            </Table>
        </TableContainer> :
        <MobileTable data={props.data}
                     keys={props.keys}
                     withFilters={props.withFilters}
                     onRowClick={props.onRowClick}
                     renderMobileView={props.renderMobileView}>
            {props.usePagination &&
              <Table>
                <TableFooter>
                  <TableRow>
                    <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                     count={props.totalCount}
                                     page={page}
                                     sx={paginatorStyles}
                                     rowsPerPage={rowsPerPage}
                                     onPageChange={(_e, val: number) => onPageChange(val)}
                                     onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                  </TableRow>
                </TableFooter>
              </Table>
            }
        </MobileTable>;
}
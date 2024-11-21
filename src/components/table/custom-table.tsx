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
import React, { ReactNode, useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { TableKey } from '@/components/table/table-key';
import CustomTableRow from '@/components/table/custom-table-row';
import { visuallyHidden } from '@mui/utils';
import { IPageable } from '@/lib/data/types';
import { IMenuAnchorEl, MobileTable } from '@/components/table/mobile-table';
import { styleVariables } from '@/constants/styles-variables';
import { renderTableActions, renderTableCell } from '@/components/table/table-cell-render';

interface CustomTableProps<K> {
    keys: TableKey<K>[],
    mobileKeys?: TableKey<K>[],
    actions?: TableKey<K>,
    data: K[],
    usePagination?: boolean,
    totalCount?: number,
    renderKey: (item: K) => string | number | undefined,
    onRowClick?: (item: K) => void,
    rowStyleClass?: (item: K) => any,
    onChange?: (pageSettings: IPageable) => void,
    pageSettings?: IPageable,
    withFilters?: boolean,
    renderMobileView?: (item: K) => ReactNode,
    children?: ReactNode
}

const stickyFooter = {
    position: 'sticky',
    bottom: 0,
    background: 'white'
};

export default function CustomTable<T>(props: CustomTableProps<T>) {
    const [page, setPage] = useState<number>(props.pageSettings?.page || 0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(props.pageSettings?.rowsPerPage || 25);
    const [anchorMenuEl, setAnchorMenuEl] = useState<IMenuAnchorEl>(null);
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        setPage(props?.pageSettings?.page || 0);
    }, [props.pageSettings]);

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

    function renderPaginator(sticky = false, colSpan = 1) {
        return (
            <TableFooter sx={sticky ? stickyFooter : {}}>
                <TableRow>
                    <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                     count={props.totalCount}
                                     page={page}
                                     colSpan={colSpan}
                                     labelRowsPerPage="Кільк. на сторінці"
                                     sx={styleVariables.paginatorStyles}
                                     rowsPerPage={rowsPerPage}
                                     onPageChange={(_e, val: number) => onPageChange(val)}
                                     onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                </TableRow>
            </TableFooter>
        );
    }

    function onRowClick(item: T) {
        if (!!anchorMenuEl) {
            setAnchorMenuEl(null);
        } else {
            props.onRowClick(item);
        }
    }

    return (<>
        {!mobileMatches ?
            <TableContainer>
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
                                                {`sorted ${props.pageSettings?.order === 'desc' ? 'descending' : 'ascending'}`}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                                : <TableCell key={index}>{key.title}</TableCell>
                            )}
                            {!!props.actions?.actions.length && <TableCell></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((item: T, index) => (
                            <CustomTableRow key={props.renderKey(item)} isClickable={!!props.onRowClick}
                                            onClick={() => props.onRowClick ? onRowClick(item) : null}>
                                {props.keys.map((key: TableKey<T>, index) =>
                                    renderTableCell<T>(key, item, index, props.rowStyleClass))}
                                {!!props.actions?.actions.length &&
                                    renderTableActions(index, props.actions, item, anchorMenuEl, (val: IMenuAnchorEl) => setAnchorMenuEl(val), props.rowStyleClass)}
                            </CustomTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> :
            <MobileTable data={props.data}
                         keys={props.mobileKeys || props.keys}
                         actions={props.actions}
                         withFilters={props.withFilters}
                         onRowClick={props.onRowClick}
                         renderMobileView={props.renderMobileView}>
            </MobileTable>}
            <Box sx={{ position: 'sticky', bottom: 0 }}>
                {props.usePagination && <Table>{renderPaginator()}</Table>}
                {props.children}
            </Box>
    </>);
}
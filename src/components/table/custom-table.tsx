import {
    Box, Button,
    IconButton,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from '@mui/material';
import React, { ReactNode, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';

import { ITableAction, TableActionEnum, TableKey } from '@/components/table/table-key';
import CustomTableRow from '@/components/table/custom-table-row';
import { visuallyHidden } from '@mui/utils';
import { IPageable } from '@/lib/data/types';

interface CustomTableProps<K> {
    keys: TableKey<K>[],
    data: K[],
    usePagination?: boolean,
    totalCount?: number,
    renderKey: (item: K) => string | number | undefined,
    onRowClick?: (item: K) => void,
    onChange?: (pageSettings: IPageable) => void,
    pageSettings?: IPageable
}

function renderTableCell<T>(key: TableKey<T>, item: T, index: number, anchorEl: HTMLElement, onAnchorChange): ReactNode {
    const open = Boolean(anchorEl);
    const onMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onAnchorChange(event.currentTarget);
    }
    const onCloseMenu = () => onAnchorChange(null);

    switch (key.type) {
        case 'icons':
            return <TableCell key={index} align="right" onClick={e => e.stopPropagation()}>
                {key.actions && key.actions?.length === 1 ?
                    key.actions.map((icon, index) => getIconItem<T>(item, icon, index))
                    : <Box>
                        <IconButton aria-haspopup="true" onClick={onMenuClick}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu anchorEl={anchorEl}
                              open={open}
                              onClose={onCloseMenu}
                              MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                            {key.actions.map((icon, index) => (
                                <MenuItem key={index} onClick={onCloseMenu}>
                                    {getIconItem<T>(item, icon, index, onCloseMenu)}
                                </MenuItem>)
                            )}
                        </Menu>
                    </Box>}
            </TableCell>;
        default:
            return <TableCell key={index}>{key.renderValue ? key.renderValue(item) : ''}</TableCell>;
    }
}

function getIconItem<T>(item: T, action: ITableAction, index: number, onClick?: Function) {
    const handleClick = event => {
        event.stopPropagation();
        if (onClick) {
            onClick();
        }
        action.onClick(item);
    };
    let icon = null;
    let color = null;

    switch (action.type) {
        case TableActionEnum.delete:
            icon = <DeleteIcon color="warning"/>;
            color = 'warning';
            break;
        case TableActionEnum.copy:
            icon = <CopyIcon/>;
    }

    return action.label ?
        <Button key={index} onClick={handleClick} color={color || 'primary'}>{icon}{action.label || ''}</Button> :
        <IconButton key={index} onClick={handleClick} color={color || 'primary'}>{icon}</IconButton>;
}

export default function CustomTable<T>(props: CustomTableProps<T>) {
    const [page, setPage] = useState<number>(props.pageSettings?.page || 0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(props.pageSettings?.rowsPerPage || 25);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

    return (
        <TableContainer sx={{ maxHeight: 'calc(100vh - 135px)', overflowY: 'auto', overflowX: 'initial' }}>
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
                                renderTableCell<T>(key, item, index, anchorEl, (val: HTMLElement) => setAnchorEl(val)))}
                        </CustomTableRow>
                    ))}

                    {props.usePagination &&
                      <TableRow>
                        <TablePagination rowsPerPageOptions={[5, 10, 25]}
                                         count={props.totalCount}
                                         page={page}
                                         colSpan={props.keys.length}
                                         rowsPerPage={rowsPerPage}
                                         onPageChange={(_e, val: number) => onPageChange(val)}
                                         onRowsPerPageChange={({ target }) => onRowsPerPageChange(Number(target.value))}/>
                      </TableRow>}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
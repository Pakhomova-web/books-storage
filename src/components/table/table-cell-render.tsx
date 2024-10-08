import { ITableAction, TableActionEnum, TableKey } from '@/components/table/table-key';
import React, { ReactNode } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export function renderTableCell<T>(key: TableKey<T>, item: T, index: number, rowStyleClass?: Function): ReactNode {
    return (
        <TableCell key={index} sx={rowStyleClass ? rowStyleClass(item) : {}}>
            {key.renderValue ? key.renderValue(item) : ''}
        </TableCell>
    );
}

export function renderTableActions<T>(key: TableKey<T>, item: T, anchorMenuEl: HTMLElement, onAnchorMenuElChange, rowStyleClass?: Function) {
    return (
        <TableCell align="right"
                   onClick={e => e.stopPropagation()}
                   sx={rowStyleClass ? rowStyleClass(item) : {}}>
            {renderActions(key.actions, item, anchorMenuEl, onAnchorMenuElChange)}
        </TableCell>
    );
}

export function renderActions<T>(actions: ITableAction[], item: T, anchorMenuEl: HTMLElement, onAnchorMenuElChange) {
    const open = Boolean(anchorMenuEl);
    const onMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onAnchorMenuElChange(event.currentTarget);
    }
    const onCloseMenu = () => onAnchorMenuElChange(null);

    return actions && (!actions.length || actions.length === 1) ?
        actions.map((icon, index) => getActionItem<T>(item, icon, index)) :
        <Box>
            <IconButton aria-haspopup="true" onClick={onMenuClick}>
                <MoreVertIcon/>
            </IconButton>
            <Menu anchorEl={anchorMenuEl}
                  open={open}
                  onClose={onCloseMenu}
                  MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                {actions.map((icon, index) => (
                    <MenuItem key={index} onClick={onCloseMenu}>
                        {getActionItem<T>(item, icon, index, onCloseMenu)}
                    </MenuItem>)
                )}
            </Menu>
        </Box>;
}

export function getActionItem<T>(item: T, action: ITableAction, index: number, onClick?: Function) {
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
            break;
        case TableActionEnum.add:
            icon = <AddIcon/>;
    }

    return action.label ?
        <Button key={index} onClick={handleClick} color={color || 'primary'}>{icon}{action.label || ''}</Button> :
        <IconButton key={index} onClick={handleClick} color={color || 'primary'}>{icon}</IconButton>;
}

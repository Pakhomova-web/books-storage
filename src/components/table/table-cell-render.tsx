import { ITableAction, TableActionEnum, TableKey } from '@/components/table/table-key';
import React, { ReactNode } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, TableCell } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';

export function renderTableCell<T>(key: TableKey<T>, item: T, index: number): ReactNode {
    return <TableCell key={index}>{key.renderValue ? key.renderValue(item) : ''}</TableCell>;
}

export function renderTableActions<T>(key: TableKey<T>, item: T, anchorMenuEl: HTMLElement, onAnchorMenuElChange) {
    return (
        <TableCell align="right" onClick={e => e.stopPropagation()}>
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

    return actions && actions?.length === 1 ?
        actions.map((icon, index) => getActionItem<T>(item, icon, index)) :
        <Box>
            <IconButton aria-haspopup="true" onClick={onMenuClick}>
                <MenuIcon/>
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

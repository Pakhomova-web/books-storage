import { ITableAction, TableActionEnum, TableKey } from '@/components/table/table-key';
import React, { ReactNode } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, TableCell } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';

export function renderTableCell<T>(key: TableKey<T>, item: T, index: number, anchorMenuEl: HTMLElement, onAnchorMenuElChange): ReactNode {
    const open = Boolean(anchorMenuEl);
    const onMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onAnchorMenuElChange(event.currentTarget);
    }
    const onCloseMenu = () => onAnchorMenuElChange(null);

    switch (key.type) {
        case 'actions':
            return <TableCell key={index} align="right" onClick={e => e.stopPropagation()}>
                {key.actions && key.actions?.length === 1 ?
                    key.actions.map((icon, index) => getIconItem<T>(item, icon, index))
                    : <Box>
                        <IconButton aria-haspopup="true" onClick={onMenuClick}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu anchorEl={anchorMenuEl}
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

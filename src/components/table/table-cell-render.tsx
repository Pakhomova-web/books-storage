import { ITableAction, TableActionEnum, TableKey } from '@/components/table/table-key';
import React, { ReactNode } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IMenuAnchorEl } from '@/components/table/mobile-table';
import CustomImage from '@/components/custom-image';

const tableCellActionsStyles = {
    display: 'flex',
    justifyContent: 'end'
};

export function renderTableCell<T>(key: TableKey<T>, item: T, index: number, rowStyleClass?: Function): ReactNode {
    return (
        <TableCell key={index} sx={rowStyleClass ? rowStyleClass(item) : {}}>
            {key.type === 'text' && (key.renderValue ? key.renderValue(item) : '')}
            {key.type === 'image' && <Box sx={{ width: '80px', height: '80px' }}>
              <CustomImage imageId={key.renderValue(item) as string} isBookType={true}></CustomImage>
            </Box>}
        </TableCell>
    );
}

export function renderTableActions<T>(index: number, key: TableKey<T>, item: T, anchorMenuEl: IMenuAnchorEl, onAnchorMenuElChange: (_v: IMenuAnchorEl) => void, rowStyleClass?: Function) {
    return (
        <TableCell align="right"
                   onClick={e => e.stopPropagation()}
                   sx={rowStyleClass ? rowStyleClass(item) : {}}>
            <Box sx={tableCellActionsStyles}>
                {renderActions(index, key.actions, item, anchorMenuEl, onAnchorMenuElChange)}
            </Box>
        </TableCell>
    );
}

export function renderActions<T>(rowIndex: number, actions: ITableAction[], item: T, anchorMenuEl: IMenuAnchorEl, onAnchorMenuElChange: (_v: IMenuAnchorEl) => void) {
    const open = Boolean(anchorMenuEl);
    const onMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        onAnchorMenuElChange({ el: event.currentTarget, rowIndex });
    }

    function handleClick(action: ITableAction) {
        onAnchorMenuElChange(null);
        action.onClick(item);
    }

    return (!actions.length || actions.length === 1) ?
        <Button onClick={() => handleClick(actions[0])}>{getActionItem(actions[0], item)}</Button> :
        <Box>
            <IconButton aria-haspopup="true" onClick={onMenuClick}>
                <MoreVertIcon/>
            </IconButton>

            {anchorMenuEl?.rowIndex === rowIndex &&
              <Menu anchorEl={anchorMenuEl?.el}
                    open={open}
                    onClose={() => onAnchorMenuElChange(null)}
                    MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                  {actions.map((action, index) => (
                      <MenuItem key={index} onClick={() => handleClick(action)}>
                          {getActionItem(action, item)}
                      </MenuItem>)
                  )}
              </Menu>
            }
        </Box>;
}

export function getActionItem(action: ITableAction, item) {
    let icon = null;
    const styles = {
        display: 'flex',
        alignItems: 'center'
    };

    switch (action.type) {
        case TableActionEnum.delete:
            icon = <DeleteIcon color="warning"/>;
            break;
        case TableActionEnum.copy:
            icon = <CopyIcon color="primary"/>;
            break;
        case TableActionEnum.add:
            icon = <AddIcon color="primary"/>;
    }

    return <Box gap={1} sx={styles}>{icon}{action.label ? action.label(item) : ''}</Box>;
}

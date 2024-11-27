import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SortIcon from '@mui/icons-material/Sort';

import { IPageable } from '@/lib/data/types';
import { styleVariables } from '@/constants/styles-variables';
import { ISortKey } from '@/components/types';

interface ISortButtonProps {
    pageSettings: IPageable;
    onSort: (_: IPageable) => void;
    sortKeys: ISortKey[];
}

export default function SortButton(props: ISortButtonProps) {
    const [anchorMenuEl, setAnchorMenuEl] = useState<HTMLElement>();
    const [selectedItem, setSelectedItem] = useState<ISortKey>(props.sortKeys.find(item => isSelectedItem(item)));

    useEffect(() => {
        setSelectedItem(props.sortKeys.find(item => isSelectedItem(item)));
    }, [props.pageSettings]);

    function onSortClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorMenuEl(event.currentTarget);
    }

    function onSortByField(key: ISortKey) {
        setAnchorMenuEl(null);
        props.onSort({
            ...props.pageSettings,
            orderBy: key.orderBy,
            order: key.order,
            page: 0,
        });
    }

    function isSelectedItem(item: ISortKey) {
        return props.pageSettings.order === item.order && props.pageSettings.orderBy === item.orderBy;
    }

    return (
        <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end" gap={1} pr={1}>
            <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                Сортувати:<Box>{selectedItem?.title}</Box>
            </Box>

            <IconButton onClick={onSortClick} aria-haspopup="true" color="primary"><SortIcon/></IconButton>

            <Menu anchorEl={anchorMenuEl}
                  open={!!anchorMenuEl}
                  onClose={() => setAnchorMenuEl(null)}
                  MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                {props.sortKeys.map((item, i) =>
                    <MenuItem key={i} onClick={() => onSortByField(item)}
                              sx={isSelectedItem(item) ? styleVariables.boldFont : {}}>
                        {item.title}
                    </MenuItem>)}
            </Menu>
        </Box>
    );
}

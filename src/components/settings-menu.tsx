import { Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import { SettingListItem } from '@/components/types';
import { drawerWidth } from '@/constants/styles-variables';

const leftNavigationStyles = {
    width: drawerWidth,
    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
};
export const settingsList: SettingListItem[] = [
    { title: 'Замовлення', link: 'orders' },
    { title: 'Книги', link: 'books' },
    { title: 'Видавництва', link: 'publishing-houses' },
    { title: 'Серії', link: 'book-series' },
    { title: 'Види обкладинок', link: 'cover-types' },
    { title: 'Види книг', link: 'book-types' },
    { title: 'Види сторінок', link: 'page-types' },
    { title: 'Мови', link: 'languages' },
    { title: 'Автори', link: 'authors' },
    { title: 'Способи доставки', link: 'deliveries' }
];

export default function SettingsMenu({ onMenuItemClick, activeSettingsTab }) {
    const router = useRouter();

    function settingsTabChange(activeSettingsTab: SettingListItem) {
        onMenuItemClick(activeSettingsTab);
        router.push(`/settings/${activeSettingsTab.link}`);
    }

    return (
        <Drawer variant="permanent" sx={leftNavigationStyles}>
            <Toolbar/>
            <List>
                {settingsList.map(tab => (
                    <ListItem key={tab.link} disablePadding
                              className={activeSettingsTab?.link === tab.link ? 'active-nav-link' : ''}
                              onClick={() => settingsTabChange(tab)}>
                        <ListItemButton>
                            <ListItemText primary={tab.title}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

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
    { title: 'Orders', link: 'orders' },
    { title: 'Books', link: 'books' },
    { title: 'Publishing Houses', link: 'publishing-houses' },
    { title: 'Book Series', link: 'book-series' },
    { title: 'Cover Types', link: 'cover-types' },
    { title: 'Book Types', link: 'book-types' },
    { title: 'Page Types', link: 'page-types' },
    { title: 'Languages', link: 'languages' },
    { title: 'Authors', link: 'authors' }
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

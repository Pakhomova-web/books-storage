import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router'
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useEffect, useState } from 'react';

import { apolloClient } from '@/lib/apollo';
import './global.css';
import Head from 'next/head';

interface SettingListItem {
    link: string,
    title: string
}

const settingsList: SettingListItem[] = [
    { title: 'Books', link: 'books' },
    { title: 'Publishing Houses', link: 'publishing-houses' },
    { title: 'Book Series', link: 'book-series' },
    { title: 'Cover Types', link: 'cover-types' },
    { title: 'Book Types', link: 'book-types' },
    { title: 'Page Types', link: 'page-types' },
    { title: 'Languages', link: 'languages' },
    { title: 'Authors', link: 'authors' }
];
const drawerWidth = 240;

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeSettingsTab, setActiveSettingsTab] = useState<string>();
    const [isSettings, setIsSettings] = useState<boolean>(false);


    useEffect(() => {
        if (pathname.includes('settings')) {
            setIsSettings(true);
            setActiveSettingsTab(pathname.split('/settings/')[1]);
        }
    }, [pathname]);

    function settingsTabChange(link: string) {
        setActiveSettingsTab(link);
        router.push(`/settings/${link}`);
    }

    function goToMainPage() {
        setIsSettings(false);
        setActiveSettingsTab('');
        router.push('/');
    }

    return (
        <ApolloProvider client={apolloClient}>
            <Head>
                <title>Books Storage</title>
            </Head>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar className="toolbar">
                    <Button onClick={() => goToMainPage()} color="inherit" sx={{ width: '190px' }}>Main page</Button>

                    <IconButton size="large"
                                edge="start"
                                color="inherit"
                                aria-label="settings"
                                onClick={() => router.push('/settings/books')}
                                sx={{ mr: 2 }}>
                        <SettingsIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ pl: `${(isSettings ? drawerWidth : 0)}px` }}>
                {isSettings ?
                    <Drawer variant="permanent"
                            sx={{
                                width: drawerWidth,
                                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                            }}>
                        <Toolbar/>
                        <List>
                            {settingsList.map(({ title, link }) => (
                                <ListItem key={link} disablePadding
                                          className={activeSettingsTab === link ? 'active-nav-link' : ''}
                                          onClick={() => settingsTabChange(link)}>
                                    <ListItemButton>
                                        <ListItemText primary={title}/>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Drawer> : null}
                <Toolbar/>
                <Component {...pageProps} />
            </Box>
        </ApolloProvider>
    );
}

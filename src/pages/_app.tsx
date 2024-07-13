import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import {
    AppBar,
    Box,
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
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

import { apolloClient } from '@/lib/apollo';
import './global.css';

interface SettingListItem {
    link: string,
    title: string
}

const settingsList: SettingListItem[] = [
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
const drawerWidth = 240;

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeSettingsTab, setActiveSettingsTab] = useState<string>();
    const [isSettings, setIsSettings] = useState<boolean>(false);
    const [showSettingMenu, setShowSettingMenu] = useState<boolean>(false);


    useEffect(() => {
        if (pathname.includes('settings')) {
            setIsSettings(true);
            setActiveSettingsTab(pathname.split('/settings/')[1]);
        }
    }, [pathname]);

    function settingsTabChange(link: string) {
        setShowSettingMenu(false);
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
                    <Box>
                        {isSettings && <IconButton color="inherit" onClick={() => setShowSettingMenu(!showSettingMenu)}><MenuIcon/></IconButton>}
                    </Box>

                    <Box>
                        <IconButton onClick={() => goToMainPage()} color="inherit"
                                    sx={{ mr: 2 }}><HomeIcon/></IconButton>
                        <IconButton size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="settings"
                                    onClick={() => router.push('/settings/books')}>
                            <SettingsIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {isSettings && showSettingMenu ?
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
        </ApolloProvider>
    );
}

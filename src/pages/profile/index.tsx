import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Profile() {
    const router = useRouter();

    useEffect(() => {
        router.push('/profile/personal-info');
    }, []);
    return (<Box>Profile</Box>);
}

import { Box } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import { useBook } from '@/lib/graphql/queries/book/hook';
import { useRouter } from 'next/router';
import ErrorNotification from '@/components/error-notification';

export default function Book() {
    const router = useRouter();
    const { loading, error, item } = useBook(router.query.id as string);

    return (
        <Box sx={styleVariables.positionRelative}>
            <Loading show={loading}></Loading>

            {error && <ErrorNotification error={error}></ErrorNotification>}
        </Box>
    );
}

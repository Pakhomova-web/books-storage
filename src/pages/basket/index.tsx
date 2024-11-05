import { Box, Grid } from '@mui/material';
import { useBooksByIds } from '@/lib/graphql/queries/book/hook';
import { positionRelative, primaryLightColor, styleVariables } from '@/constants/styles-variables';
import Loading from '@/components/loading';
import ErrorNotification from '@/components/error-notification';
import { useAuth } from '@/components/auth-context';
import { styled } from '@mui/material/styles';
import CustomImage from '@/components/custom-image';

const StyledImageBox = styled(Box)(() => ({
    width: '100px',
    height: '100px'
}));

const TitleBoxStyled = styled(Box)(({ theme }) => ({
    ...styleVariables.bigTitleFontSize(theme),
    borderBottom: `1px solid ${primaryLightColor}`,
    textAlign: 'center'
}));

export default function Basket() {
    const { user } = useAuth();
    const { loading, error, items, refetch } = useBooksByIds(user?.bookIdsInBasket);

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}/>

            <TitleBoxStyled pb={1} m={1}>Кошик</TitleBoxStyled>

            <Grid container display="flex" justifyContent="center">
                <Grid item xs={12} md={9} display="flex" flexDirection="column" gap={1}>
                    {items.map((book, index) => (
                        <Box key={index} p={2} borderBottom={1} borderColor={primaryLightColor}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <StyledImageBox>
                                    <CustomImage imageId={book.imageIds[0]} isBookDetails={true}></CustomImage>
                                </StyledImageBox>
                                <Box display="flex" flexDirection="column" gap={1}>
                                    <Box sx={styleVariables.hintFontSize}>{book.bookSeries.publishingHouse.name}. {book.bookSeries.name}</Box>
                                    <Box sx={styleVariables.titleFontSize}>{book.name}</Box>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Grid>
            </Grid>

            {error && <ErrorNotification error={error}/>}
        </Box>
    );
}

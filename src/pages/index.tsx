import { Box, BoxProps, Grid } from '@mui/material';
import React from 'react';
import Loading from '@/components/loading';
import { pageStyles, positionRelative, styleVariables } from '@/constants/styles-variables';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useBookTypes } from '@/lib/graphql/queries/book-type/hook';
import CustomImage from '@/components/custom-image';

const StyledBookTypeBox = styled(Box)<BoxProps>(({ theme }) => ({
    borderRadius: styleVariables.borderRadius,
    backgroundColor: theme.palette.action.hover,
    padding: styleVariables.doublePadding,
    display: 'flex',
    alignItems: 'center'
}));

const imageBoxStyles = {
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
};

export default function Home() {
    const { loading, items } = useBookTypes();
    const router = useRouter();

    return (
        <Box sx={positionRelative}>
            <Loading show={loading}></Loading>

            <Box sx={pageStyles} p={1}>
                {items?.length &&
                  <Grid container>
                      {items?.map((type, index) => (
                          <Grid xs={12} sm={6} md={3} key={index} item p={1}>
                              <StyledBookTypeBox gap={2}>
                                  <Box sx={imageBoxStyles}>
                                      <CustomImage isBookType={true}></CustomImage>
                                  </Box>
                                  {type.name}
                              </StyledBookTypeBox>
                          </Grid>
                      ))}
                  </Grid>
                }
            </Box>
        </Box>
    );
}
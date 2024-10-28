import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { styleVariables } from '@/constants/styles-variables';
import InstagramIcon from '@mui/icons-material/Instagram';
import React from 'react';

const StyledSocialsBox = styled(Box)(() => ({
    position: 'sticky',
    backgroundColor: 'white',
    bottom: 0,
    borderTop: `1px solid ${styleVariables.gray}`
}));

export default function SocialMediaBox() {

    function onInstagramClick() {
        window.open('https://instagram.com/ph_smart_kids', "_blank")
    }

    return (
        <StyledSocialsBox display="flex" alignItems="center" gap={2} width="100%" p={1} mt={1}
                          justifyContent="end">
            <Box>Соц. мережі:</Box>
            <IconButton onClick={onInstagramClick}><InstagramIcon color="primary"
                                                                  fontSize="medium"/></IconButton>
        </StyledSocialsBox>
    );
}
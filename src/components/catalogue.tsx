import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, useTheme } from "@mui/material";
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import { CATALOGUE, ICatalogueItem } from '@/constants/options';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomLink from '@/components/custom-link';
import CustomModal from '@/components/modals/custom-modal';
import CustomImage from '@/components/custom-image';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledChildrenContainer = styled(Box)(() => ({
    background: 'white',
    display: 'flex',
    border: `1px solid ${primaryLightColor}`,
    borderBottomRightRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    flexDirection: 'column',
    width: '100%',
    position: 'absolute',
    top: '100%',
    zIndex: 5
}));

const StyledContainer = styled(Grid)(() => ({
    borderBottom: `1px solid ${primaryLightColor}`,
    borderTop: `1px solid ${primaryLightColor}`,
    position: 'relative'
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottom: `2px solid transparent`,
    textAlign: 'center',
    ':hover': {
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        background: primaryLightColor,
        ':before, :after': {
            display: 'none'
        }
    },
    ':before': {
        background: primaryLightColor,
        content: '""',
        height: '25px',
        left: 0,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px'
    }
}));

const rightDivider = {
    ':after': {
        background: primaryLightColor,
        content: '""',
        height: '25px',
        right: 0,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '1px'
    }
};

export default function Catalogue({ opened = false }) {
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
    const [items] = useState<ICatalogueItem[]>(CATALOGUE);
    const [parentIndex, setParentIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const router = useRouter();
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    function onSectionClick(items: ICatalogueItem[], event?) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        closePanel();

        router.push(items[items.length - 1].url || `/books/catalogue/${items.map(i => i.id).join('-')}`);
    }

    function getCategoriesView() {
        return items.map((item, index) => (
            <Accordion key={index} expanded={expanded === `panel-${index}`}
                       onChange={handleChange(`panel-${index}`)}>
                <AccordionSummary expandIcon={<KeyboardArrowDownIcon color="primary"/>}>
                    {item.title}
                </AccordionSummary>
                <AccordionDetails>
                    {item.children.map((child, index) => (
                        <Box key={index} py={2} pl={2}>
                            <CustomLink onClick={() => onSectionClick([item, child])}>
                                {child.title}
                            </CustomLink>
                        </Box>
                    ))}
                    <Box key={index} py={2} mt={1}>
                        <CustomLink onClick={() => onSectionClick([item])}>
                            <Box display="flex" alignItems="center" gap={1}>Дивитися усі
                                <ArrowForwardIcon color="primary"/>
                            </Box>
                        </CustomLink>
                    </Box>
                </AccordionDetails>
            </Accordion>
        ));
    }

    function closePanel() {
        setParentIndex(null);
        setOpenModal(false);
    }

    return (
        mobileMatches ?
            (opened ?
                <Box width="100%">{getCategoriesView()}</Box> :
                <StyledContainer container mb={1}>
                    <StyledGrid item xs={12} px={2} py={1} sx={rightDivider} onClick={() => setOpenModal(true)}>
                        <Box width="30px" mr={1} display="flex" alignItems="center">
                            <CustomImage imageLink="/catalogue.png"/>
                        </Box>Усі категорії
                    </StyledGrid>

                    <CustomModal open={openModal} onClose={() => setOpenModal(false)} title="Усі категорії">
                        {getCategoriesView()}
                        <Box m={2} textAlign="center">
                            <CustomLink href="/publishing-houses" onClick={() => setOpenModal(false)}>
                                Подивитись усі видавництва
                            </CustomLink>
                        </Box>
                    </CustomModal>
                </StyledContainer>) :
            <StyledContainer container mb={1}>
                {items.map((item, index) => (
                    <StyledGrid item xs={3} key={index} px={2} py={{ md: 1, lg: 2 }}
                                sx={index === items.length - 1 ? rightDivider : {}}
                                onMouseEnter={() => setParentIndex(index)}
                                onMouseLeave={() => setParentIndex(null)}
                                onClick={() => onSectionClick([item])}>
                        {item.title}

                        {!!item.children?.length &&
                          <StyledChildrenContainer px={2} py={3} gap={2}
                                                   sx={{ visibility: parentIndex === index ? 'visible' : 'hidden' }}>
                              {item.children.map((child, index) => (
                                  <CustomLink key={index}
                                              onClick={event => onSectionClick([item, child], event)}>
                                      <Box pl={2}>
                                          {child.title}
                                      </Box>
                                  </CustomLink>)
                              )}

                            <Box mb={1}></Box>
                            <CustomLink href="/publishing-houses" onClick={() => closePanel()}
                                        key={index}>Подивитись усі видавництва</CustomLink>
                          </StyledChildrenContainer>}
                    </StyledGrid>
                ))}
            </StyledContainer>
    );
}

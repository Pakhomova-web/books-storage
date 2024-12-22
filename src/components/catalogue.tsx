import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, useTheme } from "@mui/material";
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import { getParamsQueryString } from '@/utils/utils';
import { BOOK_TYPES, LANGUAGES } from '@/constants/options';
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

interface ICatalogueItem {
    title: string,
    params: { [key: string]: (string | number)[] },
    children?: ICatalogueItem[],
    url?: string
}

export default function Catalogue() {
    const theme = useTheme();
    const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
    const [items] = useState<ICatalogueItem[]>([
        {
            title: 'Ранній розвиток, підготовка до школи',
            params: {
                ages: [1, 2, 3, 4, 5, 6],
                bookTypes: [
                    BOOK_TYPES.ALPHABET,
                    BOOK_TYPES.ABC_BOOK,
                    BOOK_TYPES.VIMMELBUH,
                    BOOK_TYPES.POEMS,
                    BOOK_TYPES.TASKS,
                    BOOK_TYPES.FAIRYTAILS,
                    BOOK_TYPES.CARDS,
                    BOOK_TYPES.STICKERS,
                    BOOK_TYPES.RECIPES,
                    BOOK_TYPES.COLORING_BOOK,
                    BOOK_TYPES.PUZZLES,
                    BOOK_TYPES.DESK_GAMES
                ]
            },
            children: [
                {
                    title: 'Англійська дітям',
                    params: {
                        languages: [
                            LANGUAGES.ENGLISH
                        ]
                    }
                },
                {
                    title: 'Ранній розвиток 0-4',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.ALPHABET,
                            BOOK_TYPES.ABC_BOOK,
                            BOOK_TYPES.STICKERS,
                            BOOK_TYPES.TASKS,
                            BOOK_TYPES.COLORING_BOOK,
                            BOOK_TYPES.BOOK_IMAGE,
                            BOOK_TYPES.ENCYCLOPEDIA,
                            BOOK_TYPES.FOLD_OUT_BOOK,
                            BOOK_TYPES.RECIPES,
                            BOOK_TYPES.PUZZLES,
                            BOOK_TYPES.DESK_GAMES
                        ],
                        ages: [1, 2, 3, 4]
                    }
                },
                {
                    title: 'Ранній розвиток 4-6',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.ALPHABET,
                            BOOK_TYPES.ABC_BOOK,
                            BOOK_TYPES.STICKERS,
                            BOOK_TYPES.TASKS,
                            BOOK_TYPES.COLORING_BOOK,
                            BOOK_TYPES.BOOK_IMAGE,
                            BOOK_TYPES.ENCYCLOPEDIA,
                            BOOK_TYPES.FOLD_OUT_BOOK,
                            BOOK_TYPES.RECIPES,
                            BOOK_TYPES.PUZZLES,
                            BOOK_TYPES.DESK_GAMES
                        ],
                        ages: [5, 6]
                    }
                },
                {
                    title: 'Віммельбухи',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.VIMMELBUH
                        ]
                    }
                },
                {
                    title: 'Завдання, тести',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.TASKS,
                            BOOK_TYPES.RECIPES
                        ]
                    }
                },
                {
                    title: 'Читаємо по складах',
                    params: {
                        quickSearch: [
                            'читаємо по складах'
                        ]
                    }
                },
                {
                    title: 'Пазли',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.PUZZLES
                        ]
                    }
                },
                {
                    title: 'Настільні ігри',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.DESK_GAMES
                        ]
                    }
                }
            ]
        },
        {
            title: 'Повчальні книжки',
            params: {
                bookTypes: [
                    BOOK_TYPES.RECIPES,
                    BOOK_TYPES.ABC_BOOK,
                    BOOK_TYPES.ENCYCLOPEDIA,
                    BOOK_TYPES.HISTORIES,
                    BOOK_TYPES.FAIRYTAILS,
                    BOOK_TYPES.TASKS,
                    BOOK_TYPES.STICKERS
                ]
            },
            children: [
                {
                    title: 'Прописи',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.RECIPES
                        ]
                    }
                },
                {
                    title: 'Енциклопедії',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.ENCYCLOPEDIA
                        ]
                    }
                },
                {
                    title: 'Перше читання',
                    params: {
                        quickSearch: [
                            'для самостійного читання'
                        ]
                    }
                },
                {
                    title: 'Читаємо по складах',
                    params: {
                        quickSearch: [
                            'читаємо по складах'
                        ]
                    }
                },
                {
                    title: 'Кросворди, ребуси, головоломки',
                    params: {
                        tags: [
                            'кросворди, ребуси, головоломки'
                        ]
                    }
                }
            ]
        },
        {
            title: 'Книги для найменших',
            params: {
                bookTypes: [
                    BOOK_TYPES.FAIRYTAILS,
                    BOOK_TYPES.TASKS,
                    BOOK_TYPES.STICKERS,
                    BOOK_TYPES.ABC_BOOK,
                    BOOK_TYPES.VIMMELBUH,
                    BOOK_TYPES.BOOK_IMAGE,
                    BOOK_TYPES.FOLD_OUT_BOOK,
                    BOOK_TYPES.POEMS,
                    BOOK_TYPES.PUZZLES
                ],
                ages: [1, 2, 3, 4, 5]
            },
            children: [
                {
                    title: 'Книжки з віконцями',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.WITH_WINDOWS
                        ]
                    }
                },
                {
                    title: 'Книжки-розкладайки',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.FOLD_OUT_BOOK
                        ]
                    }
                },
                {
                    title: 'Віршики',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.POEMS
                        ]
                    }
                },
                {
                    title: 'Книжки з наліпками',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.STICKERS
                        ],
                        ages: [1, 2, 3, 4]
                    }
                },
                {
                    title: 'Віммельбухи',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.VIMMELBUH
                        ]
                    }
                },
                {
                    title: 'Читаємо дітям',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.FAIRYTAILS,
                            BOOK_TYPES.BOOK_IMAGE,
                            BOOK_TYPES.HISTORIES
                        ],
                        ages: [1, 2, 3, 4]
                    }
                },
                {
                    title: 'Пазли',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.PUZZLES
                        ],
                        ages: [1, 2, 3, 4]
                    }
                }
            ]
        },
        {
            title: 'Дитяча творчість та ігри',
            params: {
                bookTypes: [
                    BOOK_TYPES.COLORING_BOOK,
                    BOOK_TYPES.STICKERS,
                    BOOK_TYPES.PUZZLES,
                    BOOK_TYPES.DESK_GAMES
                ]
            },
            children: [
                {
                    title: 'Розмальовки',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.COLORING_BOOK
                        ]
                    }
                },
                {
                    title: 'Наліпки',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.STICKERS
                        ]
                    }
                },
                {
                    title: 'Пазли',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.PUZZLES
                        ]
                    }
                },
                {
                    title: 'Настільні ігри',
                    params: {
                        bookTypes: [
                            BOOK_TYPES.DESK_GAMES
                        ]
                    }
                }
            ]
        }
    ]);
    const [parentIndex, setParentIndex] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const router = useRouter();
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    function onSectionClick(params: {
        [key: string]: (string | number)[]
    }, title?: string, url?: string, index?: number, event?) {
        if (event){
            event.stopPropagation();
            event.preventDefault();
        }
        if (!parentIndex && index >= 0) {
            setParentIndex(index);
            return;
        }
        setParentIndex(null);
        setOpenModal(false);
        let filters = {};

        Object.keys(params).forEach(key => {
            filters[key] = params[key].join();
        });
        if (title) {
            filters['sectionTitle'] = title;
        }
        router.push(`${url || '/books'}?${getParamsQueryString(filters)}`);
    }

    return (
        mobileMatches ?
            <StyledContainer container mb={1}>
                <StyledGrid item xs={12} px={2} py={1} sx={rightDivider} onClick={() => setOpenModal(true)}>
                    <Box width="30px" mr={1} display="flex" alignItems="center">
                        <CustomImage imageLink="/catalogue.png"/>
                    </Box>Усі категорії
                </StyledGrid>

                <CustomModal open={openModal} onClose={() => setOpenModal(false)} title="Усі категорії">
                    {items.map((item, index) => (
                        <Accordion key={index} expanded={expanded === `panel-${index}`}
                                   onChange={handleChange(`panel-${index}`)}>
                            <AccordionSummary expandIcon={<KeyboardArrowDownIcon color="primary"/>}>
                                {item.title}
                            </AccordionSummary>
                            <AccordionDetails>
                                {item.children.map((child, index) => (
                                    <Box key={index} py={2} pl={2}>
                                        <CustomLink
                                            onClick={() => onSectionClick(child.params, child.title, child.url)}>
                                            {child.title}
                                        </CustomLink>
                                    </Box>
                                ))}
                                <Box key={index} py={2} mt={1}>
                                    <CustomLink
                                        onClick={() => onSectionClick(item.params, item.title, item.url)}>
                                        <Box display="flex" alignItems="center" gap={1}>Дивитися усі
                                            <ArrowForwardIcon color="primary"/>
                                        </Box>
                                    </CustomLink>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </CustomModal>
            </StyledContainer> :
            <StyledContainer container mb={1}>
                {items.map((item, index) => (
                    <StyledGrid item xs={3} key={index} px={2} py={{ md: 1, lg: 2 }}
                                sx={index === items.length - 1 ? rightDivider : {}}
                                onMouseEnter={() => setParentIndex(index)}
                                onMouseLeave={() => setParentIndex(null)}
                                onClick={() => onSectionClick(item.params, item.title, item.url, index)}>
                        {item.title}

                        {!!item.children?.length &&
                          <StyledChildrenContainer px={2} py={3} gap={2}
                                                   sx={{ visibility: parentIndex === index ? 'visible' : 'hidden' }}>
                              {item.children.map((item, index) => (
                                  <CustomLink key={index}
                                              onClick={event => onSectionClick(item.params, item.title, item.url, event)}>
                                      <Box pl={2}>
                                          {item.title}
                                      </Box>
                                  </CustomLink>)
                              )}

                            <Box mb={1}></Box>
                            <CustomLink onClick={event => onSectionClick({}, null, '/publishing-houses', event)}
                                        key={index}>Подивитись усі видавництва</CustomLink>
                          </StyledChildrenContainer>}
                    </StyledGrid>
                ))}
            </StyledContainer>
    );
}

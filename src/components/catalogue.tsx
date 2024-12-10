import { Box, Grid, useTheme } from "@mui/material";
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { borderRadius, primaryLightColor } from '@/constants/styles-variables';
import { useRouter } from 'next/router';
import { getParamsQueryString } from '@/utils/utils';
import { BOOK_TYPES, LANGUAGES } from '@/constants/options';
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomLink from '@/components/custom-link';

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
                    BOOK_TYPES.COLORING_BOOK
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
                            BOOK_TYPES.RECIPES
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
                            BOOK_TYPES.RECIPES
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
                    BOOK_TYPES.POEMS
                ]
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
                }
            ]
        },
        {
            title: 'Дитяча творчість',
            params: {
                bookTypes: [
                    BOOK_TYPES.COLORING_BOOK,
                    BOOK_TYPES.STICKERS
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
                }
            ]
        }
    ]);
    const [parentIndex, setParentIndex] = useState<number | null>(null);
    const router = useRouter();

    function onSectionClick(params: { [key: string]: (string | number)[] }, title?: string, url?: string) {
        setParentIndex(null);
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
            <StyledContainer container>
                <StyledGrid item xs={12} px={2} py={2} sx={rightDivider}>
                    Каталог
                </StyledGrid>
            </StyledContainer> :
            <StyledContainer container>
                {items.map((item, index) => (
                    <>
                        <StyledGrid item xs={3} key={index} px={2} py={{ md: 1, lg: 2 }}
                                    sx={index === items.length - 1 ? rightDivider : {}}
                                    onMouseEnter={() => setParentIndex(index)}
                                    onMouseLeave={() => setParentIndex(null)}
                                    onClick={() => onSectionClick(item.params, item.title, item.url)}>
                            {item.title}
                        </StyledGrid>

                        {!!item.children?.length &&
                          <StyledChildrenContainer px={2} py={3} gap={2}
                                                   onMouseEnter={() => setParentIndex(index)}
                                                   onMouseLeave={() => setParentIndex(null)}
                                                   sx={{ visibility: parentIndex === index ? 'visible' : 'hidden' }}>
                              {item.children.map((item, index) => (
                                  <CustomLink onClick={() => onSectionClick(item.params, item.title, item.url)}
                                              key={index}>{item.title}</CustomLink>)
                              )}
                          </StyledChildrenContainer>}
                    </>
                ))}
            </StyledContainer>
    );
}

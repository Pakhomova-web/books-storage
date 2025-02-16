import { IOption } from '@/lib/data/types';

export const ageOptions: IOption<number>[] = [
    { label: '0 - 1', id: 1 },
    { label: '1 - 2', id: 2 },
    { label: '2 - 3', id: 3 },
    { label: '3 - 4', id: 4 },
    { label: '4 - 5', id: 5 },
    { label: '5 - 6', id: 6 },
    { label: '6 - 7', id: 7 },
    { label: '7 - 8', id: 8 },
    { label: '8 - 9', id: 9 },
    { label: '9 - 10', id: 10 }
];

export const DELIVERIES = {
    UKRPOSHTA: '66d5c9173415a4551a000606',
    NOVA_POSHTA: '66d5c90e3415a4551a000600',
    SELF_PICKUP: '67406cec5f3c198cb08c3ffb'
}

export const BOOK_TYPES = {
    HISTORIES: '66900e5cd4b33119e2069772',
    ALPHABET: '669134b094f74a2ad6b0e48a',
    ABC_BOOK: '67126e31c779e77559fb6ed0',
    VIMMELBUH: '673788f4df3067150dc47b25',
    POEMS: '66900e6ed4b33119e2069780',
    ENCYCLOPEDIA: '6691337ddbfbd12a74b40f08',
    TASKS: '6690109fd4b33119e2069796',
    FAIRYTAILS: '66900e56d4b33119e206976e',
    CARDS: '6755a5ee614871000389ffa5',
    WITH_WINDOWS: '674b7a4d4d90690003ce1e64',
    BOOK_IMAGE: '67546723584234076c50b7af',
    FOLD_OUT_BOOK: '67559ff26f6d1c1c1f3593b9',
    STICKERS: '66901099d4b33119e2069792',
    RECIPES: '669267823eab820889273689',
    COLORING_BOOK: '671389883908259306710c62',
    DESK_GAMES: '6765771dd643670e4af7e645',
    PUZZLES: '67657b88d643670e4af7ea9e'
};

export const LANGUAGES = {
    ENGLISH: '6687b7137b182a0a940db8e4'
};

export interface ICatalogueItem {
    id?: string,
    title?: string,
    params?: { [key: string]: (string | number)[] },
    children?: ICatalogueItem[],
    url?: string
}

export const CATALOGUE: ICatalogueItem[] = [
    {
        id: 'preschool',
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
                id: 'english',
                title: 'Англійська дітям',
                params: {
                    languages: [
                        LANGUAGES.ENGLISH
                    ]
                }
            },
            {
                id: 'to4',
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
                id: 'from4To6',
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
                id: 'vimmelbukh',
                title: 'Віммельбухи',
                params: {
                    bookTypes: [
                        BOOK_TYPES.VIMMELBUH
                    ]
                }
            },
            {
                id: 'tests',
                title: 'Завдання, тести',
                params: {
                    bookTypes: [
                        BOOK_TYPES.TASKS,
                        BOOK_TYPES.RECIPES
                    ]
                }
            },
            {
                id: 'readBySyllables',
                title: 'Читаємо по складах',
                params: {
                    quickSearch: [
                        'читаємо по складах'
                    ]
                }
            },
            {
                id: 'puzzles',
                title: 'Пазли',
                params: {
                    bookTypes: [
                        BOOK_TYPES.PUZZLES
                    ]
                }
            },
            {
                id: 'games',
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
        id: 'forDevelopment',
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
                id: 'prescriptions',
                title: 'Прописи',
                params: {
                    bookTypes: [
                        BOOK_TYPES.RECIPES
                    ]
                }
            },
            {
                id: 'encyclopedias',
                title: 'Енциклопедії',
                params: {
                    bookTypes: [
                        BOOK_TYPES.ENCYCLOPEDIA
                    ]
                }
            },
            {
                id: 'firstReading',
                title: 'Перше читання',
                params: {
                    quickSearch: [
                        'для самостійного читання'
                    ]
                }
            },
            {
                id: 'readBySyllables',
                title: 'Читаємо по складах',
                params: {
                    quickSearch: [
                        'читаємо по складах'
                    ]
                }
            },
            {
                id: 'crosswordsRebusesPuzzles',
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
        id: 'forSmallest',
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
                id: 'withWindows',
                title: 'Книжки з віконцями',
                params: {
                    bookTypes: [
                        BOOK_TYPES.WITH_WINDOWS
                    ]
                }
            },
            {
                id: 'foldOutBooks',
                title: 'Книжки-розкладайки',
                params: {
                    bookTypes: [
                        BOOK_TYPES.FOLD_OUT_BOOK
                    ]
                }
            },
            {
                id: 'poems',
                title: 'Віршики',
                params: {
                    bookTypes: [
                        BOOK_TYPES.POEMS
                    ]
                }
            },
            {
                id: 'stickersTo4',
                title: 'Книжки з наліпками',
                params: {
                    bookTypes: [
                        BOOK_TYPES.STICKERS
                    ],
                    ages: [1, 2, 3, 4]
                }
            },
            {
                id: 'vimmelbukh',
                title: 'Віммельбухи',
                params: {
                    bookTypes: [
                        BOOK_TYPES.VIMMELBUH
                    ]
                }
            },
            {
                id: 'readToChildrenFrom1To4',
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
                id: 'puzzlesFrom1To4',
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
        id: 'artAndGames',
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
                id: 'coloringBooks',
                title: 'Розмальовки',
                params: {
                    bookTypes: [
                        BOOK_TYPES.COLORING_BOOK
                    ]
                }
            },
            {
                id: 'stickers',
                title: 'Наліпки',
                params: {
                    bookTypes: [
                        BOOK_TYPES.STICKERS
                    ]
                }
            },
            {
                id: 'puzzles',
                title: 'Пазли',
                params: {
                    bookTypes: [
                        BOOK_TYPES.PUZZLES
                    ]
                }
            },
            {
                id: 'games',
                title: 'Настільні ігри',
                params: {
                    bookTypes: [
                        BOOK_TYPES.DESK_GAMES
                    ]
                }
            }
        ]
    }
];

export function getCatalogueParams(idsParam: string): ICatalogueItem {
    const ids = (idsParam || '').split('-');
    let item: ICatalogueItem;

    ids.forEach(id => {
        item = (item?.children || CATALOGUE).find(child => child.id === id);
    });

    return item;
}

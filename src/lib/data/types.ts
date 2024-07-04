export interface AuthorEntity {
    id: string,
    name: string,
    description?: string
}

export interface LanguageEntity {
    id: string,
    name: string
}

export interface PublishingHouseEntity {
    id: string,
    name: string
}

export interface PageTypeEntity {
    id: string,
    name: string
}

export interface BookTypeEntity {
    id: string,
    name: string
}

export interface CoverTypeEntity {
    id: string,
    name: string
}

export interface BookSeriesEntity {
    id: string,
    name: string,
    publishingHouseId: string,
    publishingHouse?: PublishingHouseEntity
}

export interface BookEntity {
    id: string,
    name: string,
    description: string,
    isbn: string,
    format: string,
    numberOfPages: number,
    numberInStock: number,
    price: number,
    bookSeriesId: string,
    bookSeries?: BookSeriesEntity,
    coverTypeId: string,
    coverType?: CoverTypeEntity,
    bookTypeId: string,
    bookType?: BookTypeEntity,
    pageTypeId: string,
    pageType?: PageTypeEntity,
    languageId: string,
    language?: LanguageEntity,
    authorId: string,
    author?: AuthorEntity
}

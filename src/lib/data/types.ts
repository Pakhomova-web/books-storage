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
    name: string,
    tags: string
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
    publishingHouse: PublishingHouseEntity
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

export interface IOption {
    id: string,
    label: string
}

export interface IPageable {
    orderBy?: string,
    order?: 'asc' | 'desc',
    page?: number,
    rowsPerPage?: number
}

export interface IBookSeriesFilter {
    name?: string,
    publishingHouse?: string
}

export interface IBookFilter {
    id?: string,
    name?: string,
    bookSeries?: string,
    description?: string,
    bookType?: string
    coverType?: string
    pageType?: string
    isbn?: string
    language?: string
    author?: string
}

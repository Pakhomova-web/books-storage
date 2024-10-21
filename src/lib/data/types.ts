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
    name: string,
    imageId?: string
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
    author?: AuthorEntity,
    imageId?: string,
    tags?: string[]
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

export class BookFilter {
    quickSearch?: string;
    id?: string;
    name?: string;
    bookSeries?: string;
    description?: string;
    bookType?: string;
    coverType?: string;
    pageType?: string;
    isbn?: string;
    language?: string;
    author?: string;
    publishingHouse?: string;
    isInStock?: boolean;
    tags?: string;

    constructor(data?) {
        if (data) {
            this.quickSearch = data.quickSearch;
            this.id = data.id;
            this.name = data.name;
            this.bookSeries = data.bookSeries;
            this.description = data.description;
            this.bookType = data.bookType;
            this.coverType = data.coverType;
            this.pageType = data.pageType;
            this.isbn = data.isbn;
            this.language = data.language;
            this.author = data.author;
            this.isInStock = data.isInStock;
            this.publishingHouse = data.publishingHouse;
            this.tags = data.tags;
        }
    }
}

export class BookSeriesFilter {
    name?: string;
    publishingHouse?: string;

    constructor(data?) {
        if (data) {
            this.publishingHouse = data.publishingHouse;
            this.name = data.name;
        }
    }
}

export class NameFilter {
    name?: string;

    constructor(data?) {
        if (data) {
            this.name = data.name;
        }
    }
}

export class UserEntity {
    id?: string;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export class DeliveryEntity {
    id?: string;
    name: string;
}

export class Address {
    region: string;
    district?: string;
    city: string;
    postcode: string;
}

export class OrderBook {
    bookId: string;
    book: BookEntity;
    count: number;
    discount?: number;
    price: number;
}

export class OrderEntity {
    id: string;
    customerFirstName: string;
    customerLastName: string;
    customerPhoneNumber: string;
    trackingNumber: string;
    deliveryId?: string;
    delivery?: DeliveryEntity;
    address: Address;
    isPaid: boolean;
    isPartlyPaid: boolean;
    isSent: boolean;
    isDone: boolean;
    books: OrderBook[];
    description?: string;
}

export interface IOrderFilter {
    quickSearch?: string
}

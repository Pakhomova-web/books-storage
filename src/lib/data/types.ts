import { isSelfPickup } from '@/utils/utils';
import { SortDirection } from '@mui/material';

export interface AuthorEntity {
    id: string,
    name: string,
    description?: string
}

export interface IAuthorFilter {
    name?: string,
    quickSearch?: string
}

export interface LanguageEntity {
    id: string,
    name: string
}

export class PublishingHouseEntity {
    id: string;
    name: string;
    tags: string;
    imageId?: string;

    constructor(data?) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.tags = data.tags;
            this.imageId = data.imageId;
        }
    }
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

export class BookSeriesEntity {
    id: string;
    name: string;
    publishingHouseId: string;
    publishingHouse: PublishingHouseEntity;
    default?: boolean;
    description?: string;

    constructor(data?) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.publishingHouseId = data.publishingHouseId;
            this.publishingHouse = new PublishingHouseEntity(data.publishingHouse);
            this.default = !!data.default;
            this.description = data.description;
        }
    }
}

export class BookEntity {
    id: string;
    name: string;
    description: string;
    isbn: string;
    format: string;
    numberOfPages: number;
    numberInStock: number;
    numberSold: number;
    price: number;
    archived: boolean;
    bookSeriesId: string;
    bookSeries?: BookSeriesEntity;
    coverTypeId: string;
    coverType?: CoverTypeEntity;
    bookTypeIds: string[];
    bookTypes?: BookTypeEntity[];
    pageTypeId: string;
    pageType?: PageTypeEntity;
    languageId: string;
    language?: LanguageEntity;
    authorIds: string[];
    authors?: AuthorEntity[];
    illustratorIds: string[];
    illustrators?: AuthorEntity[];
    imageIds?: string[];
    tags?: string[];
    ages: number[];
    comments?: CommentEntity[];
    discount?: number;

    constructor(data?) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.isbn = data.isbn;
            this.format = data.format;
            this.numberOfPages = data.numberOfPages;
            this.numberInStock = data.numberInStock;
            this.numberSold = data.numberSold;
            this.price = data.price;
            this.bookSeriesId = data.bookSeriesId;
            this.bookSeries = data.bookSeries;
            this.coverTypeId = data.coverTypeId;
            this.coverType = data.coverType;
            this.bookTypeIds = data.bookTypeIds;
            this.bookTypes = data.bookTypes;
            this.pageTypeId = data.pageTypeId;
            this.pageType = data.pageType;
            this.languageId = data.languageId;
            this.language = data.language;
            this.imageIds = data.imageIds;
            this.tags = data.tags;
            this.authorIds = data.authorIds;
            this.authors = data.authors;
            this.illustratorIds = data.illustratorIds;
            this.illustrators = data.illustrators;
            this.archived = data.archived;
            this.ages = data.ages
            this.discount = data.discount;
        }
    }

    get dataToUpdate(): Partial<BookEntity> {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            isbn: this.isbn,
            format: this.format,
            numberOfPages: this.numberOfPages,
            numberInStock: this.numberInStock,
            price: this.price,
            archived: this.archived,
            bookTypeIds: this.bookTypeIds || this.bookTypes.map(bT => bT.id),
            bookSeriesId: this.bookSeriesId || this.bookSeries?.id,
            coverTypeId: this.coverTypeId || this.coverType?.id,
            pageTypeId: this.pageTypeId || this.pageType?.id,
            languageId: this.languageId || this.language?.id,
            authorIds: this.authorIds || this.authors.map(({ id }) => id),
            imageIds: this.imageIds,
            tags: this.tags,
            ages: this.ages,
            discount: this.discount
        };
    }
}

export interface IOption<T> {
    id: T,
    label: string,
    description?: string
}

export interface IPageable {
    orderBy?: string,
    order?: SortDirection,
    page?: number,
    rowsPerPage?: number
}

export class BookFilter {
    quickSearch?: string;
    id?: string;
    name?: string;
    bookSeries?: string;
    description?: string;
    bookTypes?: string[];
    coverType?: string;
    pageType?: string;
    isbn?: string;
    language?: string;
    authors?: string[];
    publishingHouse?: string;
    isInStock?: boolean;
    withDiscount?: boolean;
    tags?: string[];
    archived?: boolean;
    ages?: number[];

    constructor(data?) {
        if (data) {
            this.quickSearch = data.quickSearch;
            this.id = data.id;
            this.name = data.name;
            this.bookSeries = data.bookSeries;
            this.description = data.description;
            this.bookTypes = data.bookTypes && typeof data.bookTypes === 'string' ? data.bookTypes.split(',') : data.bookTypes;
            this.coverType = data.coverType;
            this.pageType = data.pageType;
            this.isbn = data.isbn;
            this.language = data.language;
            this.authors = data.authors && typeof data.authors === 'string' ? data.authors.split(',') : data.authors;
            this.isInStock = data.isInStock ? data.isInStock.toString() === 'true' : null;
            this.withDiscount = data.withDiscount ? data.withDiscount.toString() === 'true' : null;
            this.publishingHouse = data.publishingHouse;
            this.tags = !!data.tags ? (typeof data.tags === 'string' ? data.tags.split(',') : data.tags) : [];
            this.archived = data.archived !== undefined ? data.archived : false;
            this.ages = data.ages && typeof data.ages === 'string' ? data.ages.split(',').map(age => +age) : data.ages;
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
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    likedBookIds?: string[];
    recentlyViewedBookIds?: string[];
    recentlyViewedBooks?: BookEntity[];
    basketItems?: { bookId: string, count: number }[];

    preferredDeliveryId?: string;
    region?: string;
    city?: string;
    district?: string;
    postcode?: number;
    novaPostOffice?: number;
    phoneNumber?: String;
    instagramUsername?: String;

    constructor(data?) {
        if (data) {
            this.id = data.id;
            this.email = data.email;
            this.password = data.password;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.role = data.role;
            this.likedBookIds = data.likedBookIds ? data.likedBookIds : [];
            this.recentlyViewedBookIds = data.recentlyViewedBookIds ? data.recentlyViewedBookIds : [];
            this.recentlyViewedBooks = data.recentlyViewedBooks ? data.recentlyViewedBooks : [];
            this.basketItems = data.basketItems ? data.basketItems : [];
            this.region = data.region;
            this.district = data.district;
            this.city = data.city;
            this.postcode = data.postcode;
            this.novaPostOffice = data.novaPostOffice;
            this.phoneNumber = data.phoneNumber;
            this.preferredDeliveryId = data.preferredDeliveryId;
            this.instagramUsername = data.instagramUsername;
        }
    }
}

export class DeliveryEntity {
    id?: string;
    name: string;
    imageId?: string;

    constructor(data?) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.imageId = data.imageId;
        }
    }
}

export class OrderBookEntity {
    bookId: string;
    book: BookEntity;
    count: number;
    discount?: number;
    price: number;

    constructor(data?) {
        if (data) {
            this.book = data.book ? new BookEntity(data.book) : null;
            this.bookId = data.bookId;
            this.count = data.count;
            this.discount = data.discount;
            this.price = data.price;
        }
    }
}

export class OrderEntity {
    id?: string;
    orderNumber?: number;
    userId?: string;
    user?: UserEntity;
    firstName: string;
    lastName: string;
    instagramUsername?: string;
    phoneNumber: string;
    trackingNumber?: string;
    deliveryId?: string;
    delivery?: DeliveryEntity;
    region: string;
    district?: string;
    city: string;
    postcode?: number;
    novaPostOffice?: number;
    isCanceled?: boolean;
    isConfirmed?: boolean;
    isPaid?: boolean;
    isPartlyPaid?: boolean;
    isSent?: boolean;
    isDone?: boolean;
    books: OrderBookEntity[];
    comment?: string;
    adminComment?: string;
    date?: string;
    finalSum?: number;
    finalSumWithDiscounts?: number;
    booksCount?: number;

    constructor(data?) {
        if (data) {
            this.id = data.id;
            this.userId = data.userId;
            this.user = data.user;
            this.orderNumber = data.orderNumber;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
            this.instagramUsername = data.instagramUsername;
            this.phoneNumber = data.phoneNumber;
            this.trackingNumber = data.trackingNumber;
            this.deliveryId = data.deliveryId;
            this.delivery = data.delivery;
            this.region = data.region;
            this.district = data.district;
            this.city = data.city;
            this.postcode = data.postcode;
            this.novaPostOffice = data.novaPostOffice;
            this.isCanceled = data.isCanceled;
            this.isConfirmed = data.isConfirmed;
            this.isPaid = data.isPaid;
            this.isPartlyPaid = data.isPartlyPaid;
            this.isDone = data.isDone;
            this.isSent = data.isSent;
            this.comment = data.comment;
            this.adminComment = data.adminComment;
            this.finalSum = 0;
            this.finalSumWithDiscounts = 0;
            this.booksCount = 0;
            this.books = data.books.map(b => {
                this.booksCount += b.count;
                this.finalSum += b.price * b.count;
                this.finalSumWithDiscounts += (b.discount ? (b.price * (100 - b.discount) / 100) : b.price) * b.count;
                return new OrderBookEntity(b);
            });
            this.date = data.date;
        }
    }

    get status(): IOrderStatus {
        if (this.isCanceled) {
            return {
                value: 'Відмінено', index: 0
            };
        } else if (!this.isConfirmed) {
            return {
                value: 'Чекає на підтвердження', index: 1
            };
        } else if (this.isConfirmed) {

            if (!this.isPaid && !this.isPartlyPaid) {
                return !isSelfPickup(this.delivery.id) ?
                    {
                        value: 'Чекає на оплату',
                        index: 1
                    } :
                    {
                        value: 'Готовий до видачі',
                        index: 2
                    };
            } else if (this.isPaid && !this.isSent && (!this.trackingNumber || isSelfPickup(this.delivery.id))) {
                return {
                    value: `Оплачене, чекає на ${isSelfPickup(this.delivery.id) ? 'видачу' : 'відправку'}`,
                    index: 2
                };
            } else if (this.isPartlyPaid && !this.isSent && (!this.trackingNumber || isSelfPickup(this.delivery.id))) {
                return {
                    value: `Зроблена передплата, чекає на ${isSelfPickup(this.delivery.id) ? 'видачу' : 'відправку'}`,
                    index: 2
                };
            } else if (!!this.trackingNumber && !this.isSent) {
                return {
                    value: 'Створено ТТН, чекає на відправку', index: 3
                };
            } else if (this.isSent) {
                if (this.isDone) {
                    return {
                        value: 'Завершено', index: 5
                    };
                } else {
                    return {
                        value: 'Відправлено', index: 4
                    };
                }
            }
        }
    }
}

export interface IOrderStatus {
    value: string,
    index: number
}

export interface OrderNumberEntity {
    value: number;
}

export interface IOrderFilter {
    quickSearch?: string,
    user?: string,
    orderNumber?: number,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    instagramUsername?: string,
    email?: string
}

export class CommentEntity {
    id: string;
    email: string;
    username: string;
    value: string;
    approved: boolean;
    date: string;

    constructor(data?) {
        if (data) {
            this.id = data.id;
            this.email = data.email;
            this.username = data.username;
            this.value = data.value;
            this.approved = data.approved;
            this.date = data.date;
        }
    }
}

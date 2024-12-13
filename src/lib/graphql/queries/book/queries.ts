import { gql } from '@apollo/client';

const bookFragment = gql`
    fragment Book on Book {
        id
        name
        price
        description
        numberInStock
        numberOfPages
        archived
        isbn
        format
        imageIds
        ages
        languages {
            id
            name
        }
        coverType {
            id
            name
        }
        bookTypes {
            id
            name
        }
        pageType {
            id
            name
        }
        bookSeries {
            id
            name
            publishingHouse {
                id
                name
                tags
                imageId
            }
            default
            description
        }
        authors {
            id
            name
            description
        }
        illustrators {
            id
            name
            description
        }
        tags
        discount
        archived
        languageBooks {
            id
            name
            bookSeries {
                name
                publishingHouse {
                    name
                }
            }
            languages {
                name
            }
        }
    }
`;
export const bookListFragment = gql`
    fragment BookList on Book {
        id
        name
        price
        numberInStock
        archived
        imageIds
        languages {
            id
            name
        }
        bookSeries {
            id
            name
            publishingHouse {
                id
                name
            }
        }
        discount
    }`;

export const booksQuery = gql`
    query Books($pageSettings: PageableInput, $filters: BookSearchInput) {
        books(pageSettings: $pageSettings, filters: $filters) {
            items {
                ...BookList
            }
            totalCount
        }
    }
    ${bookListFragment}
`;

export const booksByIdsQuery = gql`
    query BooksByIds($ids: [ID!], $pageSettings: PageableInput) {
        booksByIds(ids: $ids, pageSettings: $pageSettings) {
            items {
                ...Book
            }
            totalCount
        }
    }
    ${bookFragment}
`;

export const booksWithNotApprovedCommentsQuery = gql`
    query BooksWithComments($pageSettings: PageableInput) {
        booksWithNotApprovedComments(pageSettings: $pageSettings) {
            items {
                id
                name
                bookTypes {
                    name
                }
                bookSeries {
                    name
                    publishingHouse {
                        name
                    }
                    description
                }
                comments {
                    id
                    username
                    date
                    value
                    email
                    approved
                }
            }
            totalCount
        }
    }
`;

export const bookByIdQuery = gql`
    query BookById($id: ID!) {
        bookById(id: $id) {
            ...Book
        }
    }
    ${bookFragment}
`;

export const createBookQuery = gql`
    mutation CreateBook($input: BookCreateInput!) {
        item: createBook(input: $input) {
            id
        }
    }
`;

export const updateBookQuery = gql`
    mutation UpdateBook($input: BookUpdateInput!, $updateAllBooksInSeries: Boolean) {
        item: updateBook(input: $input, updateAllBooksInSeries: $updateAllBooksInSeries) {
            id
        }
    }
`;

export const updateBookNumberInStockQuery = gql`
    mutation UpdateBookNumberInStock($input: BookUpdateNumberInStockUpdateInput!) {
        item: updateBookNumberInStock(input: $input) {
            id
        }
    }
`;

export const approveComment = gql`
    mutation ApproveComment($input: UpdateCommentInput!) {
        item: approveComment(input: $input) {
            comments {
                id
                username
                value
                email
                date
                approved
            }
        }
    }
`;

export const removeComment = gql`
    mutation RemoveComment($input: UpdateCommentInput!) {
        item: removeComment(input: $input) {
            comments {
                id
                username
                value
                email
                date
                approved
            }
        }
    }
`;

export const addBookCommentQuery = gql`
    mutation AddBookComment($id: ID!, $input: CommentInput!) {
        item: addBookComment(id: $id, input: $input) {
            id
        }
    }
`;

export const likeBookQuery = gql`
    mutation LikeBook($id: ID!) {
        ids: likeBook(id: $id)
    }
`;

export const unlikeBookQuery = gql`
    mutation UnlikeBookQuery($id: ID!) {
        ids: unlikeBook(id: $id)
    }
`;

export const changeRecentlyViewedBooksQuery = gql`
    mutation ChangeRecentlyViewedBooks($id: ID!) {
        books: changeRecentlyViewedBooks(id: $id) {
            ...BookList
        }
    }
    ${bookListFragment}
`;

export const addBookInBasketQuery = gql`
    mutation AddBookInBasket($id: ID!) {
        items: addBookInBasket(id: $id) {
            bookId
            count
        }
    }
`;

export const addGroupDiscountInBasketQuery = gql`
    mutation AddGroupDiscountInBasket($id: ID!) {
        items: addGroupDiscountInBasket(id: $id) {
            groupDiscountId
            count
        }
    }
`;

export const removeBookFromBasketQuery = gql`
    mutation RemoveBookInBasket($id: ID!) {
        items: removeBookInBasket(id: $id) {
            bookId
            count
        }
    }
`;

export const removeGroupDiscountFromBasketQuery = gql`
    mutation RemoveGroupDiscountFromBasket($id: ID!) {
        items: removeGroupDiscountFromBasket(id: $id) {
            groupDiscountId
            count
        }
    }
`;

export const updateBookCountInBasketQuery = gql`
    mutation UpdateBookCountInBasket($id: ID!, $count: Int!) {
        items: updateBookCountInBasket(id: $id, count: $count) {
            bookId
            count
        }
    }
`;

export const bookCommentsQuery = gql`
    query BookComments($id: ID!, $page: Int!, $rowsPerPage: Int!) {
        items: bookComments(id: $id, page: $page, rowsPerPage: $rowsPerPage) {
            id
            username
            value
            approved
            date
        }
    }
`;

export const booksFromSeries = gql`
    query BooksFromSeries($bookId: ID!, $rowsPerPage: Int!) {
        items: booksFromSeries(bookId: $bookId, rowsPerPage: $rowsPerPage) {
            ...BookList
        }
    }
    ${bookListFragment}
`;

export const booksNameByQuickSearchQuery = gql`
    query BooksNameByQuickSearch($quickSearch: String!) {
        items: booksNameByQuickSearch(quickSearch: $quickSearch) {
            id
            label,
            description
        }
    }
`;

export const booksByAuthorQuery = gql`
    query BooksByAuthor($authorId: ID!, $rowsPerPage: Int!, $excludeBookSeriesId: ID) {
        items: booksByAuthor(authorId: $authorId, rowsPerPage: $rowsPerPage, excludeBookSeriesId: $excludeBookSeriesId) {
            ...BookList
        }
    }
    ${bookListFragment}
`;

export const booksWithDiscountQuery = gql`
    query BooksWithDiscount($rowsPerPage: Int!) {
        items: booksWithDiscount(rowsPerPage: $rowsPerPage) {
            ...BookList
        }
    }
    ${bookListFragment}
`;

export const topOfSoldBooksQuery = gql`
    query TopOfSoldBooksQuery($rowsPerPage: Int!) {
        items: topOfSoldBooks(rowsPerPage: $rowsPerPage) {
            ...BookList
        }
    }
    ${bookListFragment}
`;



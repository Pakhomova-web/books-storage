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
        language {
            id
            name
        }
        coverType {
            id
            name
        }
        bookType {
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
        }
        authors {
            id
            name
            description
        }
        tags
        discount
        archived
    }
`;

export const booksQuery = gql`
    query Books($pageSettings: PageableInput, $filters: BookSearchInput) {
        books(pageSettings: $pageSettings, filters: $filters) {
            items {
                ...Book
            }
            totalCount
        }
    }
    ${bookFragment}
`;

export const booksByIdsQuery = gql`
    query BooksByIds($ids: [ID!]) {
        items: booksByIds(ids: $ids) {
            ...Book
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
                bookType {
                    name
                }
                bookSeries {
                    name
                    publishingHouse {
                        name
                    }
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

export const addBookInBasketQuery = gql`
    mutation AddBookInBasket($id: ID!) {
        items: addBookInBasket(id: $id) {
            bookId
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
    query BooksFromSeries($bookSeriesId: ID!) {
        items: booksFromSeries(bookSeriesId: $bookSeriesId) {
            ...Book
        }
    }
    ${bookFragment}
`;

export const booksByAuthor = gql`
    query BooksByAuthor($authorId: ID!, $rowsPerPage: Int!, $excludeBookSeriesId: ID) {
        items: booksByAuthor(authorId: $authorId, rowsPerPage: $rowsPerPage, excludeBookSeriesId: $excludeBookSeriesId) {
            ...Book
        }
    }
    ${bookFragment}
`;



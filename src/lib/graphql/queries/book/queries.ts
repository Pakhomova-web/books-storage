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
            }
        }
        authors {
            id
            name
            description
        }
        tags
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
    mutation UpdateBook($input: BookUpdateInput!) {
        item: updateBook(input: $input) {
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

export const addBookCommentQuery = gql`
    mutation AddBookComment($id: ID!, $input: CommentInput!) {
        item: addBookComment(id: $id, input: $input) {
            id
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



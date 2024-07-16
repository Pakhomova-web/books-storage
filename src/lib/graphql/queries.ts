import { gql } from '@apollo/client';


/** language **/

export const languagesQuery = gql`
    query Languages($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: languages(pageSettings: $pageSettings, filters: $filters) {
            id
            name
        }
    }
`;

export const languageOptionsQuery = gql`
    query Languages($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: languages(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const createLanguageQuery = gql`
    mutation CreateLanguage($input: LanguageCreateInput!) {
        item: createLanguage(input: $input) {
            id
            name
        }
    }
`;

export const updateLanguageQuery = gql`
    mutation UpdateLanguage($input: LanguageInput!) {
        item: updateLanguage(input: $input) {
            id
            name
        }
    }
`;

export const deleteLanguageQuery = gql`
    mutation DeleteLanguage($id: ID!) {
        item: deleteLanguage(id: $id) {
            id
        }
    }
`;

/** publishing house **/

export const publishingHousesQuery = gql`
    query PublishingHouses($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: publishingHouses(pageSettings: $pageSettings, filters: $filters) {
            id
            name
            tags
        }
    }
`;

export const publishingHouseOptionsQuery = gql`
    query PublishingHouses($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: publishingHouses(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deletePublishingHouseQuery = gql`
    mutation DeletePublishingHouse($id: ID!) {
        item: deletePublishingHouse(id: $id) {
            id
        }
    }
`;

export const createPublishingHouseQuery = gql`
    mutation CreatePublishingHouse($input: PublishingHouseCreateInput!) {
        item: createPublishingHouse(input: $input) {
            id
            name
            tags
        }
    }
`;

export const updatePublishingHouseQuery = gql`
    mutation UpdatePublishingHouse($input: PublishingHouseInput!) {
        item: updatePublishingHouse(input: $input) {
            id
            name
            tags
        }
    }
`;

/** page type **/

export const pageTypesQuery = gql`
    query PageTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: pageTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            name
        }
    }
`;

export const pageTypeOptionsQuery = gql`
    query PageTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: pageTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deletePageTypeQuery = gql`
    mutation DeletePageType($id: ID!) {
        item: deletePageType(id: $id) {
            id
        }
    }
`;

export const createPageTypeQuery = gql`
    mutation CreatePageType($input: PageTypeCreateInput!) {
        item: createPageType(input: $input) {
            id
            name
        }
    }
`;

export const updatePageTypeQuery = gql`
    mutation UpdatePageType($input: PageTypeInput!) {
        item: updatePageType(input: $input) {
            id
            name
        }
    }
`;



/** author **/

export const authorsQuery = gql`
    query Authors($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: authors(pageSettings: $pageSettings, filters: $filters) {
            id
            name
            description
        }
    }
`;

export const authorOptionsQuery = gql`
    query Authors($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: authors(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deleteAuthorQuery = gql`
    mutation DeleteAuthor($id: ID!) {
        item: deleteAuthor(id: $id) {
            id
        }
    }
`;

export const createAuthorQuery = gql`
    mutation CreateAuthor($input: AuthorCreateInput!) {
        item: createAuthor(input: $input) {
            id
        }
    }
`;

export const updateAuthorQuery = gql`
    mutation UpdateAuthor($input: AuthorInput!) {
        item: updateAuthor(input: $input) {
            id
        }
    }
`;

/** book type **/

export const bookTypesQuery = gql`
    query BookTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: bookTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            name
        }
    }
`;

export const bookTypeOptionsQuery = gql`
    query BookTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: bookTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deleteBookTypeQuery = gql`
    mutation DeleteBookType($id: ID!) {
        item: deleteBookType(id: $id) {
            id
        }
    }
`;

export const createBookTypeQuery = gql`
    mutation CreateBookType($input: BookTypeCreateInput!) {
        item: createBookType(input: $input) {
            id
            name
        }
    }
`;

export const updateBookTypeQuery = gql`
    mutation UpdateBookType($input: BookTypeInput!) {
        item: updateBookType(input: $input) {
            id
            name
        }
    }
`;

/** cover type **/

export const coverTypesQuery = gql`
    query CoverTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: coverTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            name
        }
    }
`;

export const coverTypeOptionsQuery = gql`
    query CoverTypes($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: coverTypes(pageSettings: $pageSettings, filters: $filters) {
            id
            label: name
        }
    }
`;

export const deleteCoverTypeQuery = gql`
    mutation DeleteCoverType($id: ID!) {
        item: deleteCoverType(id: $id) {
            id
        }
    }
`;

export const createCoverTypeQuery = gql`
    mutation CreateCoverType($input: CoverTypeCreateInput!) {
        item: createCoverType(input: $input) {
            id
            name
        }
    }
`;

export const updateCoverTypeQuery = gql`
    mutation UpdateCoverType($input: CoverTypeInput!) {
        item: updateCoverType(input: $input) {
            id
            name
        }
    }
`;

/** book series **/

export const bookSeriesQuery = gql`
    query BookSeries($pageSettings: PageableInput, $filters: BookSeriesSearchInput) {
        items: bookSeries(pageSettings: $pageSettings, filters: $filters) {
            id
            name
            publishingHouseId
            publishingHouse {
                id
                name
                tags
            }
        }
    }
`;

export const deleteBookSeriesQuery = gql`
    mutation DeleteBookSeries($id: ID!) {
        item: deleteBookSeries(id: $id) {
            id
        }
    }
`;

export const createBookSeriesQuery = gql`
    mutation CreateBookSeries($input: BookSeriesCreateInput!) {
        item: createBookSeries(input: $input) {
            id
        }
    }
`;

export const updateBookSeriesQuery = gql`
    mutation UpdateBookSeries($input: BookSeriesInput!) {
        item: updateBookSeries(input: $input) {
            id
        }
    }
`;

/** books **/

export const booksQuery = gql`
    query Books($pageSettings: PageableInput, $filters: BookSearchInput) {
        books(pageSettings: $pageSettings, filters: $filters) {
            items {
                id
                name
                price
                description
                numberInStock
                numberOfPages
                isbn
                format
                languageId
                language {
                    id
                    name
                }
                coverTypeId
                coverType {
                    id
                    name
                }
                bookTypeId
                bookType {
                    id
                    name
                }
                pageTypeId
                pageType {
                    id
                    name
                }
                bookSeriesId
                bookSeries {
                    id
                    name
                    publishingHouseId
                    publishingHouse {
                        id
                        name
                        tags
                    }
                }
                authorId
                author {
                    id
                    name
                    description
                }
            }
            totalCount
        }
    }
`;

export const deleteBookQuery = gql`
    mutation DeleteBook($id: ID!) {
        item: deleteBook(id: $id) {
            id
        }
    }
`;

export const createBookQuery = gql`
    mutation CreateBook($input: BookCreateInput!) {
        item: createBook(input: $input) {
            id
        }
    }
`;

export const updateBookQuery = gql`
    mutation UpdateBook($input: BookInput!) {
        item: updateBook(input: $input) {
            id
        }
    }
`;

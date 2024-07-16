const typeDefs =  /* GraphQL */ `
    type Language {
        id: ID
        name: String!
    }

    type PublishingHouse {
        id: ID
        name: String!
        tags: String
    }

    type PageType {
        id: ID
        name: String!
    }

    type BookType {
        id: ID
        name: String!
    }

    type CoverType {
        id: ID
        name: String!
    }

    type BookSeries {
        id: ID
        name: String!
        publishingHouseId: ID!
        publishingHouse: PublishingHouse
    }

    type Author {
        id: ID
        name: String!
        description: String
    }

    type Book {
        id: ID
        name: String!
        description: String
        numberOfPages: Int
        price: Float
        numberInStock: Int
        bookTypeId: ID!
        bookType: BookType
        bookSeriesId: ID
        bookSeries: BookSeries
        coverTypeId: ID!
        coverType: CoverType
        pageTypeId: ID!
        pageType: PageType
        isbn: String
        languageId: ID!
        language: Language
        authorId: ID
        author: Author
        format: String
    }

    type Query {
        languages(pageSettings: PageableInput, filters: SearchByNameInput): [Language!]
        publishingHouses(pageSettings: PageableInput, filters: SearchByNameInput): [PublishingHouse!]
        pageTypes(pageSettings: PageableInput, filters: SearchByNameInput): [PageType!]
        bookTypes(pageSettings: PageableInput, filters: SearchByNameInput): [BookType!]
        coverTypes(pageSettings: PageableInput, filters: SearchByNameInput): [CoverType!]
        bookSeries(pageSettings: PageableInput, filters: BookSeriesSearchInput): [BookSeries!]
        books(pageSettings: PageableInput, filters: BookSearchInput): BookSubList
        authors(pageSettings: PageableInput, filters: SearchByNameInput): [Author!]
    }

    type Mutation {
        updateLanguage(input: LanguageInput!): Language
        createLanguage(input: LanguageCreateInput!): Language
        deleteLanguage(id: ID!): Language

        updatePublishingHouse(input: PublishingHouseInput!): PublishingHouse
        createPublishingHouse(input: PublishingHouseCreateInput!): PublishingHouse
        deletePublishingHouse(id: ID!): PublishingHouse

        updatePageType(input: PageTypeInput!): PageType
        createPageType(input: PageTypeCreateInput!): PageType
        deletePageType(id: ID!): PageType

        updateBookType(input: BookTypeInput!): BookType
        createBookType(input: BookTypeCreateInput!): BookType
        deleteBookType(id: ID!): BookType

        updateCoverType(input: CoverTypeInput!): CoverType
        createCoverType(input: CoverTypeCreateInput!): CoverType
        deleteCoverType(id: ID!): CoverType

        updateBookSeries(input: BookSeriesInput!): BookSeries
        createBookSeries(input: BookSeriesCreateInput!): BookSeries
        deleteBookSeries(id: ID!): BookSeries

        updateBook(input: BookInput!): Book
        createBook(input: BookCreateInput!): Book
        deleteBook(id: ID!): Book

        updateAuthor(input: AuthorInput!): Author
        createAuthor(input: AuthorCreateInput!): Author
        deleteAuthor(id: ID!): Author
    }

    type BookSubList {
        items: [Book!]!
        totalCount: Int!
    }

    input PageableInput {
        order: String,
        orderBy: String,
        page: Int,
        rowsPerPage: Int
    }

    input BookCreateInput {
        name: String!
        description: String
        numberOfPages: Int!
        price: Float
        numberInStock: Int
        bookTypeId: ID!
        bookSeriesId: ID!
        coverTypeId: ID!
        pageTypeId: ID!
        isbn: String
        languageId: ID!
        authorId: ID
        format: String
    }

    input AuthorCreateInput {
        name: String!
        description: String
    }

    input PublishingHouseCreateInput {
        name: String!
        tags: String
    }

    input PageTypeCreateInput {
        name: String!
    }

    input LanguageCreateInput {
        name: String!
    }

    input BookTypeCreateInput {
        name: String!
    }

    input CoverTypeCreateInput {
        name: String!
    }

    input BookSeriesCreateInput {
        name: String!
        publishingHouseId: ID!
    }

    input SearchByNameInput {
        name: String
    }

    input PublishingHouseInput {
        id: ID!
        name: String!
        tags: String
    }

    input AuthorInput {
        id: ID!
        name: String!
        description: String
    }

    input PageTypeInput {
        id: ID!
        name: String!
    }

    input LanguageInput {
        id: ID!
        name: String!
    }

    input BookTypeInput {
        id: ID!
        name: String!
    }

    input CoverTypeInput {
        id: ID!
        name: String!
    }

    input BookSeriesInput {
        id: ID!
        name: String!
        publishingHouseId: ID!
    }

    input BookInput {
        id: ID!
        name: String!
        description: String
        numberOfPages: Int!
        price: Float
        numberInStock: Int
        bookTypeId: ID!
        bookSeriesId: ID!
        coverTypeId: ID!
        pageTypeId: ID!
        isbn: String
        languageId: ID!
        authorId: ID
        format: String
    }

    input BookSeriesSearchInput {
        name: String,
        publishingHouseId: ID!
    }

    input BookSearchInput {
        id: ID
        name: String
        description: String
        bookTypeId: ID
        coverTypeId: ID
        bookSeriesId: ID
        publishingHouseId: ID
        pageTypeId: ID
        isbn: String
        languageId: ID
        authorId: ID
    }
`;

export default typeDefs;

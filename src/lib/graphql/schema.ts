const typeDefs =  /* GraphQL */ `
    type Language {
        id: ID
        name: String!
    }
    
    type Delivery {
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
        publishingHouse: PublishingHouse!
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
        numberOfPages: Int!
        price: Float!
        numberInStock: Int
        bookType: BookType!
        bookSeries: BookSeries!
        coverType: CoverType!
        pageType: PageType!
        isbn: String
        language: Language!
        author: Author
        format: String
    }
    
    type User {
        id: ID!,
        email: String!,
        password: String,
        firstName: String,
        lastName: String,
        role: String
    }

    type Query {
        languages(pageSettings: PageableInput, filters: SearchByNameInput): [Language!]
        publishingHouses(pageSettings: PageableInput, filters: SearchByNameInput): [PublishingHouse!]
        pageTypes(pageSettings: PageableInput, filters: SearchByNameInput): [PageType!]
        coverTypes(pageSettings: PageableInput, filters: SearchByNameInput): [CoverType!]
        bookSeries(pageSettings: PageableInput, filters: BookSeriesSearchInput): BookSeriesSubList
        authors(pageSettings: PageableInput, filters: SearchByNameInput): [Author!]
        books(pageSettings: PageableInput, filters: BookSearchInput): BookSubList
        deliveries(pageSettings: PageableInput, filters: SearchByNameInput): [Delivery!]
        
        bookSeriesOptions(filters: BookSeriesSearchInput): [BookSeries!]
        bookTypes(pageSettings: PageableInput, filters: SearchByNameInput): [BookType!]
        
        refreshToken(refreshToken: String!): UserToken!
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

        updateBookSeries(input: BookSeriesUpdateInput!): BookSeries
        createBookSeries(input: BookSeriesCreateInput!): BookSeries
        deleteBookSeries(id: ID!): BookSeries

        updateBook(input: BookUpdateInput!): Book
        updateBookNumberInStock(input: BookUpdateNumberInStockInput!): Book!
        createBook(input: BookCreateInput!): Book
        deleteBook(id: ID!): Book

        updateAuthor(input: AuthorInput!): Author
        createAuthor(input: AuthorCreateInput!): Author
        deleteAuthor(id: ID!): Author

        createUser(input: UserCreateInput!): User
        login(email: String!, password: String!): UserToken!
        user: User
        updateUser(input: UserUpdateInput!): User!
        
        updateDelivery(input: DeliveryInput!): Delivery
        createDelivery(input: DeliveryCreateInput!): Delivery
        deleteDelivery(id: ID!): Delivery
    }
    
    type UserToken {
        token: String!,
        refreshToken: String!,
        user: User!
    }

    input PageableInput {
        order: String,
        orderBy: String,
        page: Int,
        rowsPerPage: Int
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

    #    book

    input BookUpdateNumberInStockInput {
        id: ID!
        numberInStock: Int!
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

    input BookUpdateInput {
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

    input BookSearchInput {
        id: ID
        name: String
        description: String
        bookType: ID
        coverType: ID
        bookSeries: ID
        pageType: ID
        isbn: String
        language: ID
        author: ID,
        isInStock: Boolean,
        quickSearch: String
    }

    type BookSubList {
        items: [Book!]!
        totalCount: Int!
    }

    #    book series

    input BookSeriesCreateInput {
        name: String!
        publishingHouseId: ID!
    }

    input BookSeriesUpdateInput {
        id: ID!
        name: String!
        publishingHouseId: ID!
    }

    input BookSeriesSearchInput {
        name: String,
        publishingHouse: ID!
    }

    type BookSeriesSubList {
        items: [BookSeries!]!
        totalCount: Int!
    }
    
    input UserCreateInput {
        email: String!,
        password: String!,
        firstName: String,
        lastName: String
    }
    
    input UserUpdateInput {
        id: ID!,
        email: String!,
        firstName: String,
        lastName: String
    }

    input DeliveryInput {
        id: ID!
        name: String!
    }
    
    input DeliveryCreateInput {
        name: String!
    }
`;

export default typeDefs;

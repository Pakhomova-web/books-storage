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
        imageId: String
    }

    type PageType {
        id: ID
        name: String!
    }

    type BookType {
        id: ID
        name: String!
        imageId: String
    }

    type CoverType {
        id: ID
        name: String!
    }

    type BookSeries {
        id: ID
        name: String!
        publishingHouse: PublishingHouse!
        default: Boolean
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
        archived: Boolean
        bookType: BookType!
        bookSeries: BookSeries!
        coverType: CoverType!
        pageType: PageType!
        isbn: String
        language: Language!
        authors: [Author]
        format: String
        imageIds: [String]
        tags: [String]
        ages: [Int]
        comments: [Comment]
        discount: Float
    }

    type Comment {
        id: ID!
        value: String!
        email: String!
        username: String!
        approved: Boolean
        date: String!
    }
    
    type BasketItem {
        bookId: ID!
        count: Int!
    }

    type User {
        id: ID!
        email: String!
        password: String
        firstName: String
        lastName: String
        role: String
        basketItems: [BasketItem!]
        likedBookIds: [String]
    }

    type Address {
        region: String!
        district: String
        city: String!
        postcode: String
    }

    type OrderBook {
        book: Book!
        count: Int!
        discount: Float
        price: Float!
    }

    type Order {
        id: ID
        customerFirstName: String!
        customerLastName: String!
        customerPhoneNumber: String!
        trackingNumber: String!
        isPaid: Boolean
        isPartlyPaid: Boolean
        isSent: Boolean
        isDone: Boolean
        delivery: Delivery
        books: [OrderBook!]!
        address: Address!
        description: String
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
        orders(pageSettings: PageableInput, filters: SearchByNameInput): OrderSubList
        bookSeriesOptions(filters: BookSeriesSearchInput): [BookSeries!]
        fullBookSeriesOptions(filters: BookSeriesSearchInput): [BookSeries!]
        bookTypes(pageSettings: PageableInput, filters: SearchByNameInput): [BookType!]
        bookById(id: ID!): Book
        bookTypeById(id: ID!): BookType
        authorById(id: ID!): Author
        publishingHouseById(id: ID!): PublishingHouse
        languageById(id: ID!): Language
        bookSeriesByIdQuery(id: ID!): BookSeries
        bookComments(id: ID!, page: Int!, rowsPerPage: Int!): [Comment!]
        booksFromSeries(bookSeriesId: ID!): [Book!]
        booksByAuthor(authorId: ID!, rowsPerPage: Int!, excludeBookSeriesId: ID): [Book!]
        booksWithNotApprovedComments(pageSettings: PageableInput): BookSubList
        booksByIds(ids: [ID!]): [Book!]

        refreshToken(refreshToken: String!): UserToken!
    }

    type Mutation {
        updateLanguage(input: LanguageUpdateInput!): Language
        createLanguage(input: LanguageCreateInput!): Language
        deleteLanguage(id: ID!): Language

        updatePublishingHouse(input: PublishingHouseUpdateInput!): PublishingHouse
        createPublishingHouse(input: PublishingHouseCreateInput!): PublishingHouse
        deletePublishingHouse(id: ID!): PublishingHouse

        updatePageType(input: PageTypeUpdateInput!): PageType
        createPageType(input: PageTypeCreateInput!): PageType
        deletePageType(id: ID!): PageType

        updateBookType(input: BookTypeUpdateInput!): BookType
        createBookType(input: BookTypeCreateInput!): BookType
        deleteBookType(id: ID!): BookType

        updateCoverType(input: CoverTypeUpdateInput!): CoverType
        createCoverType(input: CoverTypeCreateInput!): CoverType
        deleteCoverType(id: ID!): CoverType

        updateBookSeries(input: BookSeriesUpdateInput!): BookSeries
        createBookSeries(input: BookSeriesCreateInput!): BookSeries
        deleteBookSeries(id: ID!): BookSeries

        updateBook(input: BookUpdateInput!, updateAllBooksInSeries: Boolean): Book
        updateBookNumberInStock(input: BookUpdateNumberInStockUpdateInput!): Book!
        approveComment(input: UpdateCommentInput!): Book!
        removeComment(input: UpdateCommentInput!): Book!
        addBookComment(id: ID!, input: CommentInput!): Book!
        createBook(input: BookCreateInput!): Book
        likeBook(id: ID!): [ID!]
        unlikeBook(id: ID!): [ID!]
        addBookInBasket(id: ID!): [BasketItem!]
        removeBookInBasket(id: ID!): [BasketItem!]
        updateBookCountInBasket(id: ID!, count: Int!): [BasketItem!]

        updateAuthor(input: AuthorUpdateInput!): Author
        createAuthor(input: AuthorCreateInput!): Author
        deleteAuthor(id: ID!): Author

        createUser(input: UserCreateInput!): User
        login(email: String!, password: String!): UserToken!
        user: User
        updateUser(input: UserUpdateInput!): User!

        updateDelivery(input: DeliveryUpdateInput!): Delivery
        createDelivery(input: DeliveryCreateInput!): Delivery
        deleteDelivery(id: ID!): Delivery

        updateOrder(input: OrderUpdateInput!): Order
        createOrder(input: OrderCreateInput!): Order
        deleteOrder(id: ID!): Order
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
        imageId: String
    }

    input PageTypeCreateInput {
        name: String!
    }

    input LanguageCreateInput {
        name: String!
    }

    input BookTypeCreateInput {
        name: String!
        imageId: String
    }

    input CoverTypeCreateInput {
        name: String!
    }

    input SearchByNameInput {
        name: String
    }

    input PublishingHouseUpdateInput {
        id: ID!
        name: String!
        tags: String
        imageId: String
    }

    input AuthorUpdateInput {
        id: ID!
        name: String!
        description: String
    }

    input PageTypeUpdateInput {
        id: ID!
        name: String!
    }

    input LanguageUpdateInput {
        id: ID!
        name: String!
    }

    input BookTypeUpdateInput {
        id: ID!
        name: String!
        imageId: String
    }

    input CoverTypeUpdateInput {
        id: ID!
        name: String!
    }

    #    book

    input BookUpdateNumberInStockUpdateInput {
        id: ID!
        numberInStock: Int!
    }

    input UpdateCommentInput {
        bookId: ID!
        commentId: ID!
    }

    input CommentInput {
        username: String!
        email: String!
        value: String!
        date: String!
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
        authorIds: [ID]
        format: String
        imageIds: [String],
        tags: [String]
        archived: Boolean
        ages: [Int]
        discount: Float
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
        authorIds: [ID]
        format: String
        imageIds: [String]
        tags: [String]
        archived: Boolean
        ages: [Int]
        discount: Float
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
        authors: [ID]
        publishingHouse: ID
        isInStock: Boolean
        quickSearch: String
        tags: String
        archived: Boolean
        ages: [Int]
    }

    type BookSubList {
        items: [Book!]!
        totalCount: Int!
    }

    #    book series

    input BookSeriesCreateInput {
        name: String!
        publishingHouseId: ID!
        default: Boolean
    }

    input BookSeriesUpdateInput {
        id: ID!
        name: String!
        publishingHouseId: ID!
        default: Boolean
    }

    input BookSeriesSearchInput {
        name: String,
        publishingHouse: ID!
    }

    type BookSeriesSubList {
        items: [BookSeries!]!
        totalCount: Int!
    }

    #    user

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

    #    order

    input DeliveryUpdateInput {
        id: ID!
        name: String!
    }

    input DeliveryCreateInput {
        name: String!
    }

    input OrderBookInput {
        bookId: ID!
        count: Int!
        discount: Float
        price: Float!
    }

    input AddressInput {
        region: String!
        district: String
        city: String!
        postcode: String!
    }

    input OrderCreateInput {
        customerFirstName: String!
        customerLastName: String!
        customerPhoneNumber: String!
        trackingNumber: String!
        isPaid: Boolean
        isPartlyPaid: Boolean
        isSent: Boolean
        isDone: Boolean
        deliveryId: ID
        books: [OrderBookInput!]!
        address: AddressInput!
        description: String
    }

    input OrderUpdateInput {
        id: ID!
        customerFirstName: String!
        customerLastName: String!
        customerPhoneNumber: String!
        trackingNumber: String!
        isPaid: Boolean
        isPartlyPaid: Boolean
        isSent: Boolean
        isDone: Boolean
        deliveryId: ID
        books: [OrderBookInput!]!
        address: AddressInput!
        description: String
    }

    type OrderSubList {
        items: [Order!]!
        totalCount: Int!
    }
`;

export default typeDefs;

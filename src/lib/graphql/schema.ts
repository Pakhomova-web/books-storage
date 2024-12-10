const typeDefs =  /* GraphQL */ `
    type Language {
        id: ID
        name: String!
    }

    type Delivery {
        id: ID
        name: String!
        imageId: String
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
        description: String
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
        purchasePrice: Float
        numberInStock: Int
        archived: Boolean
        bookTypes: [BookType!]
        bookSeries: BookSeries!
        coverType: CoverType!
        pageType: PageType!
        isbn: String
        languages: [Language!]!
        authors: [Author]
        illustrators: [Author]
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
        recentlyViewedBookIds: [String]
        recentlyViewedBooks: [Book!]
        postcode: Int
        city: String
        region: String
        novaPostOffice: Int
        phoneNumber: String
        preferredDeliveryId: ID
        instagramUsername: String
    }

    type OrderBook {
        book: Book!
        count: Int!
        discount: Float
        price: Float!
    }

    type Order {
        id: ID
        user: User!
        orderNumber: Int!
        firstName: String!
        lastName: String!
        phoneNumber: String!
        instagramUsername: String
        trackingNumber: String
        isPaid: Boolean
        isPartlyPaid: Boolean
        isSent: Boolean
        isDone: Boolean
        isCanceled: Boolean
        isConfirmed: Boolean
        delivery: Delivery
        books: [OrderBook!]!
        region: String!
        district: String
        city: String!
        postcode: Int
        novaPostOffice: Int
        comment: String
        adminComment: String
        date: String
    }
    
    type IOption {
        id: ID!
        label: String!
        description: String
        fullDescription: String
    }

    type Query {
        languages(pageSettings: PageableInput, filters: SearchByNameInput): LanguageSubList
        publishingHouses(pageSettings: PageableInput, filters: SearchByNameInput): PublishingHouseSubList
        pageTypes(pageSettings: PageableInput, filters: SearchByNameInput): PageTypeSubList
        coverTypes(pageSettings: PageableInput, filters: SearchByNameInput): CoverTypeSubList
        bookSeries(pageSettings: PageableInput, filters: BookSeriesSearchInput): BookSeriesSubList
        authors(pageSettings: PageableInput, filters: SearchByNameInput): AuthorSubList
        books(pageSettings: PageableInput, filters: BookSearchInput): BookSubList
        deliveries(pageSettings: PageableInput, filters: SearchByNameInput): DeliverySubList
        deliveryOptions: [Delivery!]
        bookTypes(pageSettings: PageableInput, filters: SearchByNameInput): BookTypeSubList
        orders(pageSettings: PageableInput, filters: OrderSearchInput): OrderSubList
        bookSeriesOptions(filters: BookSeriesSearchInput): [IOption!]
        bookById(id: ID!): Book
        bookTypeById(id: ID!): BookType
        authorById(id: ID!): Author
        publishingHouseById(id: ID!): PublishingHouse
        languageById(id: ID!): Language
        bookSeriesByIdQuery(id: ID!): BookSeries
        bookComments(id: ID!, page: Int!, rowsPerPage: Int!): [Comment!]
        booksFromSeries(bookId: ID!, rowsPerPage: Int!): [Book!]
        booksNameByQuickSearch(quickSearch: String!): [IOption!]
        booksByAuthor(authorId: ID!, rowsPerPage: Int!, excludeBookSeriesId: ID): [Book!]
        booksWithDiscount(rowsPerPage: Int!): [Book!]
        topOfSoldBooks(rowsPerPage: Int!): [Book!]
        booksWithNotApprovedComments(pageSettings: PageableInput): BookSubList
        booksByIds(ids: [ID!], pageSettings: PageableInput): BookSubList
        balance: Float
        checkResetPasswordToken(userId: String!, token: String!): String

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
        changeRecentlyViewedBooks(id: ID!): [Book!]
        addBookInBasket(id: ID!): [BasketItem!]
        removeBookInBasket(id: ID!): [BasketItem!]
        updateBookCountInBasket(id: ID!, count: Int!): [BasketItem!]

        updateAuthor(input: AuthorUpdateInput!): Author
        createAuthor(input: AuthorCreateInput!): Author
        deleteAuthor(id: ID!): Author

        createUser(input: UserCreateInput!): User
        login(email: String!, password: String!): UserToken!
        sendUpdatePasswordLink(email: String!): String
        changePassword(userId: String!, password: String!): String
        user: User
        updateUser(input: UserUpdateInput!): User!

        updateDelivery(input: DeliveryUpdateInput!): Delivery
        createDelivery(input: DeliveryCreateInput!): Delivery
        deleteDelivery(id: ID!): Delivery

        updateOrder(input: OrderUpdateInput!): Order
        cancelOrder(id: ID!): Order
        createOrder(input: OrderCreateInput!): Order
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
        receivedNumber: Int!
        purchasePrice: Float!
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
        price: Float!
        purchasePrice: Float
        numberInStock: Int
        bookTypeIds: [ID!]!
        bookSeriesId: ID!
        coverTypeId: ID!
        pageTypeId: ID!
        isbn: String
        languageIds: [ID!]!
        authorIds: [ID]
        illustratorIds: [ID]
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
        bookTypeIds: [ID!]!
        bookSeriesId: ID!
        coverTypeId: ID!
        pageTypeId: ID!
        isbn: String
        languageIds: [ID!]!
        authorIds: [ID]
        illustratorIds: [ID]
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
        bookTypes: [ID]
        coverType: ID
        bookSeries: [ID]
        pageType: ID
        isbn: String
        languages: [ID]
        authors: [ID]
        publishingHouse: ID
        isInStock: Boolean
        withDiscount: Boolean
        quickSearch: String
        tags: [String]
        archived: Boolean
        ages: [Int]
        priceMin: Float
        priceMax: Float
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
        description: String
    }

    input BookSeriesUpdateInput {
        id: ID!
        name: String!
        publishingHouseId: ID!
        default: Boolean
        description: String
    }

    input BookSeriesSearchInput {
        name: String,
        publishingHouse: ID
    }

    type BookSeriesSubList {
        items: [BookSeries!]!
        totalCount: Int!
    }

    type CoverTypeSubList {
        items: [CoverType!]!
        totalCount: Int!
    }

    type BookTypeSubList {
        items: [BookType!]!
        totalCount: Int!
    }

    type LanguageSubList {
        items: [Language!]!
        totalCount: Int!
    }

    type PublishingHouseSubList {
        items: [PublishingHouse!]!
        totalCount: Int!
    }

    type PageTypeSubList {
        items: [PageType!]!
        totalCount: Int!
    }

    type AuthorSubList {
        items: [Author!]!
        totalCount: Int!
    }

    type DeliverySubList {
        items: [Delivery!]!
        totalCount: Int!
    }

    #    user

    input UserCreateInput {
        email: String!,
        password: String!,
        firstName: String,
        lastName: String,
        postcode: Int,
        novaPostOffice: Int,
        region: String,
        city: String,
        phoneNumber: String
        preferredDeliveryId: ID
        instagramUsername: String
    }

    input UserUpdateInput {
        id: ID!,
        firstName: String,
        lastName: String,
        postcode: Int,
        novaPostOffice: Int,
        isPaid: Boolean
        isPartlyPaid: Boolean
        isConfirmed: Boolean
        isSent: Boolean
        isDone: Boolean
        region: String,
        city: String,
        phoneNumber: String
        preferredDeliveryId: ID
        instagramUsername: String
    }

    #    order

    input DeliveryUpdateInput {
        id: ID!
        name: String!
        imageId: String
    }

    input DeliveryCreateInput {
        name: String!
        imageId: String
    }

    input OrderBookInput {
        bookId: ID!
        count: Int!
        discount: Float
        price: Float!
    }

    input OrderCreateInput {
        userId: ID!
        firstName: String!
        lastName: String!
        instagramUsername: String
        phoneNumber: String!
        trackingNumber: String
        isPaid: Boolean
        isPartlyPaid: Boolean
        isSent: Boolean
        isDone: Boolean
        deliveryId: ID!
        books: [OrderBookInput!]!
        region: String!
        district: String
        city: String!
        postcode: Int
        novaPostOffice: Int
        comment: String
        adminComment: String
    }

    input OrderUpdateInput {
        id: ID!
        firstName: String!
        lastName: String!
        instagramUsername: String
        phoneNumber: String!
        trackingNumber: String
        isConfirmed: Boolean
        isPaid: Boolean
        isPartlyPaid: Boolean
        isSent: Boolean
        isDone: Boolean
        deliveryId: ID!
        books: [OrderBookInput!]!
        region: String!
        district: String
        city: String!
        postcode: Int
        novaPostOffice: Int
        comment: String
        adminComment: String
    }

    type OrderSubList {
        items: [Order!]!
        totalCount: Int!
    }
    
    input OrderSearchInput {
        quickSearch: String
        user: ID
        firstName: String
        lastName: String
        instagramUsername: String
        phoneNumber: String
        orderNumber: Int
    }
`;

export default typeDefs;

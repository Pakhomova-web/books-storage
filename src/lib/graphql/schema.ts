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

    type BookPart {
        name: String!
        imageId: String
        price: Float!
        discount: Float
        bookSeries: BookSeries!
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
        nameToSearch: String!
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
        discountEndDate: String
        languageBooks: [Book]
    }

    type BookLanguageItem {
        id: ID!
        languages: [String!]!
    }

    type GroupDiscount {
        id: ID!
        discount: Float!
        books: [Book!]!
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

    type BasketGroupDiscountItem {
        groupDiscountId: ID!
        count: Int!
    }

    type NovaPoshtaCourierAddress {
        city: String
        region: String
        district: String
        street: String
        house: String
        flat: String
    }

    type NovaPoshtaWarehouseAddress {
        city: String
        region: String
        district: String
        warehouse: Int
    }

    type UkrPoshtaWarehouseAddress {
        city: String
        region: String
        district: String
        warehouse: Int
    }

    type User {
        id: ID!
        email: String!
        password: String
        firstName: String
        lastName: String
        role: String
        basketItems: [BasketItem!]
        basketGroupDiscounts: [BasketGroupDiscountItem!]
        likedBookIds: [String]
        recentlyViewedBookIds: [String]
        recentlyViewedBooks: [Book!]
        phoneNumber: String
        instagramUsername: String
        active: Boolean
        novaPoshtaCourierAddress: NovaPoshtaCourierAddress
        novaPoshtaWarehouseAddress: NovaPoshtaWarehouseAddress
        ukrPoshtaWarehouseAddress: UkrPoshtaWarehouseAddress
    }

    type OrderBook {
        book: Book!
        count: Int!
        discount: Float
        price: Float!
        groupDiscountId: ID
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
        street: String
        house: String
        flat: String
        warehouse: Int
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

    type NovaPoshtaSettlement {
        title: String!
        ref: String!
        city: String!
        region: String!
        district: String!
    }

    type NovaPoshtaWarehouse {
        number : Int!
        description : String!
    }

    type NovaPoshtaStreet {
        description : String!
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
        ukrPoshtaWarehouses: [UkrPoshtaWarehouseAddress!]
        bookTypes(pageSettings: PageableInput, filters: SearchByNameInput): BookTypeSubList
        orders(pageSettings: PageableInput, filters: OrderSearchInput): OrderSubList
        sendEmailWithOrder(orderId: ID!): String!
        bookSeriesOptions(filters: BookSeriesSearchInput): [IOption!]
        bookById(id: ID!): Book
        bookPartById(id: ID!): BookPart
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
        groupDiscounts(pageSettings: PageableInput, filters: GroupDiscountSearchInput): GroupDiscountSubList
        groupDiscountsByIds(ids: [ID!], pageSettings: PageableInput): GroupDiscountSubList

        refreshToken(refreshToken: String!): UserToken!
        login(email: String!, password: String!): UserToken!
        activateUser(token: String!): String!
        sendActivationLinkTo: String!

        settlements(searchValue: String!): [NovaPoshtaSettlement!]!
        warehouses(settlementRef: String!, searchValue: String!): [NovaPoshtaWarehouse!]!
        streets(ref: String!, searchValue: String!): [NovaPoshtaStreet!]!
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
        addGroupDiscountInBasket(id: ID!): [BasketGroupDiscountItem!]
        removeGroupDiscountFromBasket(id: ID!): [BasketGroupDiscountItem!]
        updateBookCountInBasket(id: ID!, count: Int!): [BasketItem!]

        updateAuthor(input: AuthorUpdateInput!): Author
        createAuthor(input: AuthorCreateInput!): Author
        deleteAuthor(id: ID!): Author

        createUser(input: UserCreateInput!): User
        activateUser(email: String!): ID!
        sendUpdatePasswordLink(email: String!): String
        changePasswordByToken(userId: String!, password: String!): String
        changePassword(password: String!, newPassword: String!): String
        user: User
        updateUser(input: UserUpdateInput!): User!

        updateDelivery(input: DeliveryUpdateInput!): Delivery
        createDelivery(input: DeliveryCreateInput!): Delivery
        deleteDelivery(id: ID!): Delivery

        updateGroupDiscount(input: GroupDiscountUpdateInput!): GroupDiscount
        createGroupDiscount(input: GroupDiscountCreateInput!): GroupDiscount
        deleteGroupDiscount(id: ID!): GroupDiscount
        updateGroupDiscountCountInBasket(id: ID!, count: Int!): [BasketGroupDiscountItem!]

        updateOrder(input: OrderUpdateInput!): Order
        cancelOrder(id: ID!): Order
        createOrder(input: OrderCreateInput!): Order
        updateBalance(expense: Float!): Float
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
        discountEndDate: String
        languageBookIds: [ID!]
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
        discountEndDate: String
        languageBookIds: [ID!]
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

    #    group discount

    input GroupDiscountSearchInput {
        books: [ID!]
        isInStock: Boolean
    }

    input GroupDiscountCreateInput {
        discount: Float!
        bookIds: [ID!]!
    }

    input GroupDiscountUpdateInput {
        id: ID!
        discount: Float!
        bookIds: [ID!]!
    }

    type GroupDiscountSubList {
        items: [GroupDiscount!]!
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
        email: String!
        password: String!
        firstName: String
        lastName: String
        phoneNumber: String
        instagramUsername: String
    }

    input NovaPoshtaWarehouseAddressInput {
        city: String
        region: String
        district: String
        warehouse: Int
    }

    input NovaPoshtaCourierAddressInput {
        city: String
        region: String
        district: String
        street: String
        house: String
        flat: String
    }

    input UkrPoshtaWarehouseAddressInput {
        city: String
        region: String
        district: String
        warehouse: Int
    }

    input UserUpdateInput {
        id: ID!
        firstName: String
        lastName: String
        phoneNumber: String
        instagramUsername: String
        novaPoshtaWarehouseAddress: NovaPoshtaWarehouseAddressInput
        novaPoshtaCourierAddress: NovaPoshtaCourierAddressInput
        ukrPoshtaWarehouseAddress: UkrPoshtaWarehouseAddressInput
    }

    #    order

    input OrderBookInput {
        bookId: ID!
        count: Int!
        discount: Float
        groupDiscountId: String
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
        region: String
        district: String
        city: String
        street: String
        house: String
        flat: String
        warehouse: Int
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
        region: String
        district: String
        city: String
        street: String
        house: String
        flat: String
        warehouse: Int
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

    #   delivery

    input DeliveryUpdateInput {
        id: ID!
        name: String!
        imageId: String
    }

    input DeliveryCreateInput {
        name: String!
        imageId: String
    }
`;

export default typeDefs;

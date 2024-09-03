import { GraphQLResolveInfo } from 'graphql';
import { LanguageEntity, PublishingHouseEntity, PageTypeEntity, BookTypeEntity, CoverTypeEntity, BookSeriesEntity, BookEntity, AuthorEntity, UserEntity, DeliveryEntity, OrderEntity } from '../data/types';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Address = {
  city: Scalars['String']['output'];
  district?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  region: Scalars['String']['output'];
};

export type AddressInput = {
  city: Scalars['String']['input'];
  district?: InputMaybe<Scalars['String']['input']>;
  postcode: Scalars['String']['input'];
  region: Scalars['String']['input'];
};

export type Author = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type AuthorCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AuthorUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Book = {
  author?: Maybe<Author>;
  bookSeries: BookSeries;
  bookType: BookType;
  coverType: CoverType;
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isbn?: Maybe<Scalars['String']['output']>;
  language: Language;
  name: Scalars['String']['output'];
  numberInStock?: Maybe<Scalars['Int']['output']>;
  numberOfPages: Scalars['Int']['output'];
  pageType: PageType;
  price: Scalars['Float']['output'];
};

export type BookCreateInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  bookSeriesId: Scalars['ID']['input'];
  bookTypeId: Scalars['ID']['input'];
  coverTypeId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  numberInStock?: InputMaybe<Scalars['Int']['input']>;
  numberOfPages: Scalars['Int']['input'];
  pageTypeId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
};

export type BookSearchInput = {
  author?: InputMaybe<Scalars['ID']['input']>;
  bookSeries?: InputMaybe<Scalars['ID']['input']>;
  bookType?: InputMaybe<Scalars['ID']['input']>;
  coverType?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isInStock?: InputMaybe<Scalars['Boolean']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pageType?: InputMaybe<Scalars['ID']['input']>;
  quickSearch?: InputMaybe<Scalars['String']['input']>;
};

export type BookSeries = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  publishingHouse: PublishingHouse;
};

export type BookSeriesCreateInput = {
  name: Scalars['String']['input'];
  publishingHouseId: Scalars['ID']['input'];
};

export type BookSeriesSearchInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  publishingHouse: Scalars['ID']['input'];
};

export type BookSeriesSubList = {
  items: Array<BookSeries>;
  totalCount: Scalars['Int']['output'];
};

export type BookSeriesUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  publishingHouseId: Scalars['ID']['input'];
};

export type BookSubList = {
  items: Array<Book>;
  totalCount: Scalars['Int']['output'];
};

export type BookType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type BookTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type BookTypeUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type BookUpdateInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  bookSeriesId: Scalars['ID']['input'];
  bookTypeId: Scalars['ID']['input'];
  coverTypeId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isbn?: InputMaybe<Scalars['String']['input']>;
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  numberInStock?: InputMaybe<Scalars['Int']['input']>;
  numberOfPages: Scalars['Int']['input'];
  pageTypeId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
};

export type BookUpdateNumberInStockUpdateInput = {
  id: Scalars['ID']['input'];
  numberInStock: Scalars['Int']['input'];
};

export type CoverType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type CoverTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type CoverTypeUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Delivery = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type DeliveryCreateInput = {
  name: Scalars['String']['input'];
};

export type DeliveryUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Language = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type LanguageCreateInput = {
  name: Scalars['String']['input'];
};

export type LanguageUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Mutation = {
  createAuthor?: Maybe<Author>;
  createBook?: Maybe<Book>;
  createBookSeries?: Maybe<BookSeries>;
  createBookType?: Maybe<BookType>;
  createCoverType?: Maybe<CoverType>;
  createDelivery?: Maybe<Delivery>;
  createLanguage?: Maybe<Language>;
  createOrder?: Maybe<Order>;
  createPageType?: Maybe<PageType>;
  createPublishingHouse?: Maybe<PublishingHouse>;
  createUser?: Maybe<User>;
  deleteAuthor?: Maybe<Author>;
  deleteBook?: Maybe<Book>;
  deleteBookSeries?: Maybe<BookSeries>;
  deleteBookType?: Maybe<BookType>;
  deleteCoverType?: Maybe<CoverType>;
  deleteDelivery?: Maybe<Delivery>;
  deleteLanguage?: Maybe<Language>;
  deleteOrder?: Maybe<Order>;
  deletePageType?: Maybe<PageType>;
  deletePublishingHouse?: Maybe<PublishingHouse>;
  login: UserToken;
  updateAuthor?: Maybe<Author>;
  updateBook?: Maybe<Book>;
  updateBookNumberInStock: Book;
  updateBookSeries?: Maybe<BookSeries>;
  updateBookType?: Maybe<BookType>;
  updateCoverType?: Maybe<CoverType>;
  updateDelivery?: Maybe<Delivery>;
  updateLanguage?: Maybe<Language>;
  updateOrder?: Maybe<Order>;
  updatePageType?: Maybe<PageType>;
  updatePublishingHouse?: Maybe<PublishingHouse>;
  updateUser: User;
  user?: Maybe<User>;
};


export type MutationCreateAuthorArgs = {
  input: AuthorCreateInput;
};


export type MutationCreateBookArgs = {
  input: BookCreateInput;
};


export type MutationCreateBookSeriesArgs = {
  input: BookSeriesCreateInput;
};


export type MutationCreateBookTypeArgs = {
  input: BookTypeCreateInput;
};


export type MutationCreateCoverTypeArgs = {
  input: CoverTypeCreateInput;
};


export type MutationCreateDeliveryArgs = {
  input: DeliveryCreateInput;
};


export type MutationCreateLanguageArgs = {
  input: LanguageCreateInput;
};


export type MutationCreateOrderArgs = {
  input: OrderCreateInput;
};


export type MutationCreatePageTypeArgs = {
  input: PageTypeCreateInput;
};


export type MutationCreatePublishingHouseArgs = {
  input: PublishingHouseCreateInput;
};


export type MutationCreateUserArgs = {
  input: UserCreateInput;
};


export type MutationDeleteAuthorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookSeriesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCoverTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDeliveryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLanguageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePageTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePublishingHouseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateAuthorArgs = {
  input: AuthorUpdateInput;
};


export type MutationUpdateBookArgs = {
  input: BookUpdateInput;
};


export type MutationUpdateBookNumberInStockArgs = {
  input: BookUpdateNumberInStockUpdateInput;
};


export type MutationUpdateBookSeriesArgs = {
  input: BookSeriesUpdateInput;
};


export type MutationUpdateBookTypeArgs = {
  input: BookTypeUpdateInput;
};


export type MutationUpdateCoverTypeArgs = {
  input: CoverTypeUpdateInput;
};


export type MutationUpdateDeliveryArgs = {
  input: DeliveryUpdateInput;
};


export type MutationUpdateLanguageArgs = {
  input: LanguageUpdateInput;
};


export type MutationUpdateOrderArgs = {
  input: OrderUpdateInput;
};


export type MutationUpdatePageTypeArgs = {
  input: PageTypeUpdateInput;
};


export type MutationUpdatePublishingHouseArgs = {
  input: PublishingHouseUpdateInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

export type Order = {
  address: Address;
  books: Array<OrderBook>;
  customerFirstName: Scalars['String']['output'];
  customerLastName: Scalars['String']['output'];
  customerPhoneNumber: Scalars['String']['output'];
  delivery?: Maybe<Delivery>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isDone?: Maybe<Scalars['Boolean']['output']>;
  isPaid?: Maybe<Scalars['Boolean']['output']>;
  isPartlyPaid?: Maybe<Scalars['Boolean']['output']>;
  isSent?: Maybe<Scalars['Boolean']['output']>;
  trackingNumber: Scalars['String']['output'];
};

export type OrderBook = {
  book: Book;
  count: Scalars['Int']['output'];
  discount?: Maybe<Scalars['Float']['output']>;
  price: Scalars['Float']['output'];
};

export type OrderBookInput = {
  bookId: Scalars['ID']['input'];
  count: Scalars['Int']['input'];
  discount?: InputMaybe<Scalars['Float']['input']>;
  price: Scalars['Float']['input'];
};

export type OrderCreateInput = {
  address: AddressInput;
  books: Array<OrderBookInput>;
  customerFirstName: Scalars['String']['input'];
  customerLastName: Scalars['String']['input'];
  customerPhoneNumber: Scalars['String']['input'];
  deliveryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isPartlyPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSent?: InputMaybe<Scalars['Boolean']['input']>;
  trackingNumber: Scalars['String']['input'];
};

export type OrderSubList = {
  items: Array<Order>;
  totalCount: Scalars['Int']['output'];
};

export type OrderUpdateInput = {
  address: AddressInput;
  books: Array<OrderBookInput>;
  customerFirstName: Scalars['String']['input'];
  customerLastName: Scalars['String']['input'];
  customerPhoneNumber: Scalars['String']['input'];
  deliveryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isPartlyPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSent?: InputMaybe<Scalars['Boolean']['input']>;
  trackingNumber: Scalars['String']['input'];
};

export type PageType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type PageTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type PageTypeUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type PageableInput = {
  order?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  rowsPerPage?: InputMaybe<Scalars['Int']['input']>;
};

export type PublishingHouse = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  tags?: Maybe<Scalars['String']['output']>;
};

export type PublishingHouseCreateInput = {
  name: Scalars['String']['input'];
  tags?: InputMaybe<Scalars['String']['input']>;
};

export type PublishingHouseUpdateInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  tags?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  authors?: Maybe<Array<Author>>;
  bookSeries?: Maybe<BookSeriesSubList>;
  bookSeriesOptions?: Maybe<Array<BookSeries>>;
  bookTypes?: Maybe<Array<BookType>>;
  books?: Maybe<BookSubList>;
  coverTypes?: Maybe<Array<CoverType>>;
  deliveries?: Maybe<Array<Delivery>>;
  languages?: Maybe<Array<Language>>;
  orders?: Maybe<OrderSubList>;
  pageTypes?: Maybe<Array<PageType>>;
  publishingHouses?: Maybe<Array<PublishingHouse>>;
  refreshToken: UserToken;
};


export type QueryAuthorsArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBookSeriesArgs = {
  filters?: InputMaybe<BookSeriesSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBookSeriesOptionsArgs = {
  filters?: InputMaybe<BookSeriesSearchInput>;
};


export type QueryBookTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBooksArgs = {
  filters?: InputMaybe<BookSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryCoverTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryDeliveriesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryLanguagesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryOrdersArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryPageTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryPublishingHousesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};

export type SearchByNameInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type UserCreateInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type UserToken = {
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type UserUpdateInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>;
  AddressInput: AddressInput;
  Author: ResolverTypeWrapper<AuthorEntity>;
  AuthorCreateInput: AuthorCreateInput;
  AuthorUpdateInput: AuthorUpdateInput;
  Book: ResolverTypeWrapper<BookEntity>;
  BookCreateInput: BookCreateInput;
  BookSearchInput: BookSearchInput;
  BookSeries: ResolverTypeWrapper<BookSeriesEntity>;
  BookSeriesCreateInput: BookSeriesCreateInput;
  BookSeriesSearchInput: BookSeriesSearchInput;
  BookSeriesSubList: ResolverTypeWrapper<Omit<BookSeriesSubList, 'items'> & { items: Array<ResolversTypes['BookSeries']> }>;
  BookSeriesUpdateInput: BookSeriesUpdateInput;
  BookSubList: ResolverTypeWrapper<Omit<BookSubList, 'items'> & { items: Array<ResolversTypes['Book']> }>;
  BookType: ResolverTypeWrapper<BookTypeEntity>;
  BookTypeCreateInput: BookTypeCreateInput;
  BookTypeUpdateInput: BookTypeUpdateInput;
  BookUpdateInput: BookUpdateInput;
  BookUpdateNumberInStockUpdateInput: BookUpdateNumberInStockUpdateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CoverType: ResolverTypeWrapper<CoverTypeEntity>;
  CoverTypeCreateInput: CoverTypeCreateInput;
  CoverTypeUpdateInput: CoverTypeUpdateInput;
  Delivery: ResolverTypeWrapper<DeliveryEntity>;
  DeliveryCreateInput: DeliveryCreateInput;
  DeliveryUpdateInput: DeliveryUpdateInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Language: ResolverTypeWrapper<LanguageEntity>;
  LanguageCreateInput: LanguageCreateInput;
  LanguageUpdateInput: LanguageUpdateInput;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<OrderEntity>;
  OrderBook: ResolverTypeWrapper<Omit<OrderBook, 'book'> & { book: ResolversTypes['Book'] }>;
  OrderBookInput: OrderBookInput;
  OrderCreateInput: OrderCreateInput;
  OrderSubList: ResolverTypeWrapper<Omit<OrderSubList, 'items'> & { items: Array<ResolversTypes['Order']> }>;
  OrderUpdateInput: OrderUpdateInput;
  PageType: ResolverTypeWrapper<PageTypeEntity>;
  PageTypeCreateInput: PageTypeCreateInput;
  PageTypeUpdateInput: PageTypeUpdateInput;
  PageableInput: PageableInput;
  PublishingHouse: ResolverTypeWrapper<PublishingHouseEntity>;
  PublishingHouseCreateInput: PublishingHouseCreateInput;
  PublishingHouseUpdateInput: PublishingHouseUpdateInput;
  Query: ResolverTypeWrapper<{}>;
  SearchByNameInput: SearchByNameInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<UserEntity>;
  UserCreateInput: UserCreateInput;
  UserToken: ResolverTypeWrapper<Omit<UserToken, 'user'> & { user: ResolversTypes['User'] }>;
  UserUpdateInput: UserUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  AddressInput: AddressInput;
  Author: AuthorEntity;
  AuthorCreateInput: AuthorCreateInput;
  AuthorUpdateInput: AuthorUpdateInput;
  Book: BookEntity;
  BookCreateInput: BookCreateInput;
  BookSearchInput: BookSearchInput;
  BookSeries: BookSeriesEntity;
  BookSeriesCreateInput: BookSeriesCreateInput;
  BookSeriesSearchInput: BookSeriesSearchInput;
  BookSeriesSubList: Omit<BookSeriesSubList, 'items'> & { items: Array<ResolversParentTypes['BookSeries']> };
  BookSeriesUpdateInput: BookSeriesUpdateInput;
  BookSubList: Omit<BookSubList, 'items'> & { items: Array<ResolversParentTypes['Book']> };
  BookType: BookTypeEntity;
  BookTypeCreateInput: BookTypeCreateInput;
  BookTypeUpdateInput: BookTypeUpdateInput;
  BookUpdateInput: BookUpdateInput;
  BookUpdateNumberInStockUpdateInput: BookUpdateNumberInStockUpdateInput;
  Boolean: Scalars['Boolean']['output'];
  CoverType: CoverTypeEntity;
  CoverTypeCreateInput: CoverTypeCreateInput;
  CoverTypeUpdateInput: CoverTypeUpdateInput;
  Delivery: DeliveryEntity;
  DeliveryCreateInput: DeliveryCreateInput;
  DeliveryUpdateInput: DeliveryUpdateInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Language: LanguageEntity;
  LanguageCreateInput: LanguageCreateInput;
  LanguageUpdateInput: LanguageUpdateInput;
  Mutation: {};
  Order: OrderEntity;
  OrderBook: Omit<OrderBook, 'book'> & { book: ResolversParentTypes['Book'] };
  OrderBookInput: OrderBookInput;
  OrderCreateInput: OrderCreateInput;
  OrderSubList: Omit<OrderSubList, 'items'> & { items: Array<ResolversParentTypes['Order']> };
  OrderUpdateInput: OrderUpdateInput;
  PageType: PageTypeEntity;
  PageTypeCreateInput: PageTypeCreateInput;
  PageTypeUpdateInput: PageTypeUpdateInput;
  PageableInput: PageableInput;
  PublishingHouse: PublishingHouseEntity;
  PublishingHouseCreateInput: PublishingHouseCreateInput;
  PublishingHouseUpdateInput: PublishingHouseUpdateInput;
  Query: {};
  SearchByNameInput: SearchByNameInput;
  String: Scalars['String']['output'];
  User: UserEntity;
  UserCreateInput: UserCreateInput;
  UserToken: Omit<UserToken, 'user'> & { user: ResolversParentTypes['User'] };
  UserUpdateInput: UserUpdateInput;
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  district?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postcode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  author?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType>;
  bookSeries?: Resolver<ResolversTypes['BookSeries'], ParentType, ContextType>;
  bookType?: Resolver<ResolversTypes['BookType'], ParentType, ContextType>;
  coverType?: Resolver<ResolversTypes['CoverType'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  isbn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numberInStock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  numberOfPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageType?: Resolver<ResolversTypes['PageType'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSeriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSeries'] = ResolversParentTypes['BookSeries']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publishingHouse?: Resolver<ResolversTypes['PublishingHouse'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSeriesSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSeriesSubList'] = ResolversParentTypes['BookSeriesSubList']> = {
  items?: Resolver<Array<ResolversTypes['BookSeries']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSubList'] = ResolversParentTypes['BookSubList']> = {
  items?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookType'] = ResolversParentTypes['BookType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoverTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CoverType'] = ResolversParentTypes['CoverType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Delivery'] = ResolversParentTypes['Delivery']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationCreateAuthorArgs, 'input'>>;
  createBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationCreateBookArgs, 'input'>>;
  createBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationCreateBookSeriesArgs, 'input'>>;
  createBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationCreateBookTypeArgs, 'input'>>;
  createCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationCreateCoverTypeArgs, 'input'>>;
  createDelivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationCreateDeliveryArgs, 'input'>>;
  createLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationCreateLanguageArgs, 'input'>>;
  createOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'input'>>;
  createPageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationCreatePageTypeArgs, 'input'>>;
  createPublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationCreatePublishingHouseArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationDeleteAuthorArgs, 'id'>>;
  deleteBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationDeleteBookArgs, 'id'>>;
  deleteBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationDeleteBookSeriesArgs, 'id'>>;
  deleteBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationDeleteBookTypeArgs, 'id'>>;
  deleteCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationDeleteCoverTypeArgs, 'id'>>;
  deleteDelivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationDeleteDeliveryArgs, 'id'>>;
  deleteLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationDeleteLanguageArgs, 'id'>>;
  deleteOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationDeleteOrderArgs, 'id'>>;
  deletePageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationDeletePageTypeArgs, 'id'>>;
  deletePublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationDeletePublishingHouseArgs, 'id'>>;
  login?: Resolver<ResolversTypes['UserToken'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  updateAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationUpdateAuthorArgs, 'input'>>;
  updateBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationUpdateBookArgs, 'input'>>;
  updateBookNumberInStock?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<MutationUpdateBookNumberInStockArgs, 'input'>>;
  updateBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationUpdateBookSeriesArgs, 'input'>>;
  updateBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationUpdateBookTypeArgs, 'input'>>;
  updateCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationUpdateCoverTypeArgs, 'input'>>;
  updateDelivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType, RequireFields<MutationUpdateDeliveryArgs, 'input'>>;
  updateLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationUpdateLanguageArgs, 'input'>>;
  updateOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationUpdateOrderArgs, 'input'>>;
  updatePageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationUpdatePageTypeArgs, 'input'>>;
  updatePublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationUpdatePublishingHouseArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  books?: Resolver<Array<ResolversTypes['OrderBook']>, ParentType, ContextType>;
  customerFirstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerLastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customerPhoneNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  delivery?: Resolver<Maybe<ResolversTypes['Delivery']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  isDone?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPaid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPartlyPaid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isSent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  trackingNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderBookResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderBook'] = ResolversParentTypes['OrderBook']> = {
  book?: Resolver<ResolversTypes['Book'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  discount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderSubList'] = ResolversParentTypes['OrderSubList']> = {
  items?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageType'] = ResolversParentTypes['PageType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublishingHouseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublishingHouse'] = ResolversParentTypes['PublishingHouse']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authors?: Resolver<Maybe<Array<ResolversTypes['Author']>>, ParentType, ContextType, Partial<QueryAuthorsArgs>>;
  bookSeries?: Resolver<Maybe<ResolversTypes['BookSeriesSubList']>, ParentType, ContextType, Partial<QueryBookSeriesArgs>>;
  bookSeriesOptions?: Resolver<Maybe<Array<ResolversTypes['BookSeries']>>, ParentType, ContextType, Partial<QueryBookSeriesOptionsArgs>>;
  bookTypes?: Resolver<Maybe<Array<ResolversTypes['BookType']>>, ParentType, ContextType, Partial<QueryBookTypesArgs>>;
  books?: Resolver<Maybe<ResolversTypes['BookSubList']>, ParentType, ContextType, Partial<QueryBooksArgs>>;
  coverTypes?: Resolver<Maybe<Array<ResolversTypes['CoverType']>>, ParentType, ContextType, Partial<QueryCoverTypesArgs>>;
  deliveries?: Resolver<Maybe<Array<ResolversTypes['Delivery']>>, ParentType, ContextType, Partial<QueryDeliveriesArgs>>;
  languages?: Resolver<Maybe<Array<ResolversTypes['Language']>>, ParentType, ContextType, Partial<QueryLanguagesArgs>>;
  orders?: Resolver<Maybe<ResolversTypes['OrderSubList']>, ParentType, ContextType, Partial<QueryOrdersArgs>>;
  pageTypes?: Resolver<Maybe<Array<ResolversTypes['PageType']>>, ParentType, ContextType, Partial<QueryPageTypesArgs>>;
  publishingHouses?: Resolver<Maybe<Array<ResolversTypes['PublishingHouse']>>, ParentType, ContextType, Partial<QueryPublishingHousesArgs>>;
  refreshToken?: Resolver<ResolversTypes['UserToken'], ParentType, ContextType, RequireFields<QueryRefreshTokenArgs, 'refreshToken'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserToken'] = ResolversParentTypes['UserToken']> = {
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Address?: AddressResolvers<ContextType>;
  Author?: AuthorResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  BookSeries?: BookSeriesResolvers<ContextType>;
  BookSeriesSubList?: BookSeriesSubListResolvers<ContextType>;
  BookSubList?: BookSubListResolvers<ContextType>;
  BookType?: BookTypeResolvers<ContextType>;
  CoverType?: CoverTypeResolvers<ContextType>;
  Delivery?: DeliveryResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderBook?: OrderBookResolvers<ContextType>;
  OrderSubList?: OrderSubListResolvers<ContextType>;
  PageType?: PageTypeResolvers<ContextType>;
  PublishingHouse?: PublishingHouseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserToken?: UserTokenResolvers<ContextType>;
};


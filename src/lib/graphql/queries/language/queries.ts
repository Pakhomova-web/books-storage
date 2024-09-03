import { gql } from '@apollo/client';

const languageFragment = gql`
    fragment Language on Language {
        id
        name
    }
`;

export const languagesQuery = gql`
    query Languages($pageSettings: PageableInput, $filters: SearchByNameInput) {
        items: languages(pageSettings: $pageSettings, filters: $filters) {
            ...Language
        }
    }
    ${languageFragment}
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
            ...Language
        }
    }
    ${languageFragment}
`;

export const updateLanguageQuery = gql`
    mutation UpdateLanguage($input: LanguageUpdateInput!) {
        item: updateLanguage(input: $input) {
            ...Language
        }
    }
    ${languageFragment}
`;

export const deleteLanguageQuery = gql`
    mutation DeleteLanguage($id: ID!) {
        item: deleteLanguage(id: $id) {
            id
        }
    }
`;

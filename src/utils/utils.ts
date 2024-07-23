import { TableKey } from '@/components/table/table-key';

export function downloadCsv<K>(items: K[], tableKeys: TableKey<K>[], filename = 'data') {
    const blob = new Blob(
        ['\ufeff' + convertToCSV<K>(items, tableKeys.filter(key => key.type === 'text'))],
        { type: 'text/csv;charset=utf-8;' }
    );
    const link = document.createElement('a');

    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute('download', filename + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function convertToCSV<K>(data: K[], tableKeys: TableKey<K>[], delimiter = ',') {
    return `${tableKeys.map(key => key.title).join(delimiter)}\r\n${data.map(item => tableKeys
        .map(key => `"${key.renderValue(item) || ''}"`)
        .join(delimiter)).join('\r\n')}`;
}

const TOKEN_STORAGE = 'user_token';
const REFRESH_TOKEN_STORAGE = 'user_refresh_token';

export function saveTokenToLocalStorage(token: string, refreshToken: string) {
    saveToLocalStorage(TOKEN_STORAGE, token);
    saveToLocalStorage(REFRESH_TOKEN_STORAGE, refreshToken);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem(TOKEN_STORAGE);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE);
}

export function getAccessToken(): string {
    return getFromLocalStorage(TOKEN_STORAGE);
}

export function getRefreshToken(): string {
    return getFromLocalStorage(REFRESH_TOKEN_STORAGE);
}

export function saveToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, encrypt(value));
}

export function getFromLocalStorage(key: string) {
    const value = localStorage.getItem(key);

    return value ? decrypt(value) : null;
}

function encrypt(val: string): string {
    if (val === null || val === '') {
        return null;
    }
    return btoa(val);
}

function decrypt(val: string): string {
    if (val === null || val === '') {
        return null;
    }
    return atob(val);
}

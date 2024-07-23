import bcrypt from 'bcrypt';
import { decode, Secret, sign } from 'jsonwebtoken';

export const SECRET_JWT_KEY: Secret = 'books-storage-token-key';
const saltRounds = 10;

export function cryptPassword(password: string): Promise<string> {
    return bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => hash);
}

export function comparePassword(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword).then(resp => resp);
}

export function createToken(userId: string) {
    return _createToken(userId, '30 seconds');
}

export function createRefreshToken(userId: string) {
    return _createToken(userId, '2 minutes');
}

function _createToken(userId: string, expiresIn: string) {
    return sign({ id: userId }, SECRET_JWT_KEY, { expiresIn });
}

export function getUserIdFromToken(token: string): string {
    return decode(token).id;
}

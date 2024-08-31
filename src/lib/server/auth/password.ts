import { HASH_ROUNDS as ENV_HASH_ROUNDS } from '$env/static/private';
import bcrypt from 'bcryptjs';

const HASH_ROUNDS = parseInt(ENV_HASH_ROUNDS);

export async function generatePasswordHash(password: string): Promise<string> {
	const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

	return hashedPassword;
}

export async function verifyPassword(
	plainPassword: string,
	hashedPassword: string
): Promise<boolean> {
	const isCorrect = bcrypt.compare(plainPassword, hashedPassword);

	return isCorrect;
}

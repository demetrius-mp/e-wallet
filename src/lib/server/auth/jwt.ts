import type { User } from '@prisma/client';
import jwt, { type Algorithm, type VerifyOptions } from 'jsonwebtoken';

import { JWT_ALGORITHM, JWT_EXPIRES_IN, JWT_SECRET_KEY } from '$env/static/private';
import { db } from '$lib/server/db';

const SECRET_KEY = JWT_SECRET_KEY;
const EXPIRES_IN = JWT_EXPIRES_IN || '1d';
const ALGORITHM = (JWT_ALGORITHM || 'HS256') as Algorithm;

type JwtPayloadType = {
	userId: User['id'];
};

export function generateJwt(payload: JwtPayloadType): string {
	const token = jwt.sign(payload, SECRET_KEY, {
		algorithm: ALGORITHM,
		expiresIn: EXPIRES_IN
	});

	return token;
}

function verifyJwt(token: string, options?: VerifyOptions): JwtPayloadType {
	const payload = jwt.verify(token, SECRET_KEY, options) as JwtPayloadType;

	return payload;
}

export async function getUserFromJwt(jwt?: string) {
	if (!jwt) {
		return undefined;
	}

	try {
		const { userId } = verifyJwt(jwt);

		const user = await db.user.findFirst({
			where: {
				archived: false,
				id: userId
			},
			omit: {
				password: true,
				archived: true
			}
		});

		if (!user) return undefined;

		return user;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return undefined;
	}
}

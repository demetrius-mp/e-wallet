import { date } from '$lib/utils/date';
import { TransactionType } from '@prisma/client';
import { z } from 'zod';

export const signUpSchema = z
	.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8)
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Senha e confirmação devem ser iguais',
				path: ['confirmPassword']
			});

			ctx.addIssue({
				code: 'custom',
				message: 'Senha e confirmação devem ser iguais',
				path: ['password']
			});
		}
	});

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const editAccountSchema = z.object({
	name: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8)
});

export const timezoneSchema = z.object({
	timezone: z.string().refine(
		(value) => {
			return Intl.supportedValuesOf('timeZone').includes(value);
		},
		{
			message: 'Fuso horário inválido'
		}
	)
});

export const resetPasswordSchema = z
	.object({
		currentPassword: z.string().min(8),
		newPassword: z.string().min(8),
		confirmNewPassword: z.string().min(8)
	})
	.superRefine((data, ctx) => {
		if (data.newPassword !== data.confirmNewPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Nova senha e confirmação devem ser iguais',
				path: ['newPassword']
			});

			ctx.addIssue({
				code: 'custom',
				message: 'Nova senha e confirmação devem ser iguais',
				path: ['confirmNewPassword']
			});
		}
	});

export const groupSchema = z.object({
	name: z.string().min(1)
});

export const transactionSchema = z.object({
	name: z.string().min(1),
	value: z.coerce.number().min(0.01).step(0.01),
	groupId: z.coerce.number().min(1).optional(),
	type: z.nativeEnum(TransactionType).default('EXPENSE'),
	saveAndContinue: z.string().nullish(),
	date: z
		.string()
		.length(8)
		.refine(
			(value) => {
				return date(value, 'DD/MM/YY', true).isValid();
			},
			{
				message: 'Data inválida'
			}
		),
	tags: z
		.string()
		.optional()
		.refine((value) => {
			if (value === undefined) return true;

			const numberOfTags = (value.match(/,/g) || []).length + 1;
			if (numberOfTags > 5) return false;

			return true;
		}, 'Máximo de 5 tags'),
	installments: z.coerce.number().int().min(1).nullish(),
	endsAt: z.string().refine(
		(value) => {
			return value === 'Recorrente' || date(value, 'MM/YY', true).isValid();
		},
		{
			message: 'Data inválida. Deve ser no formato MM/YY ou "Recorrente"'
		}
	)
});

function transformTags(tags?: string): string[] {
	if (!tags) return [];

	return tags
		.trim()
		.split(',')
		.map((tag) => tag.trim());
}

function transformEndsAt(endsAt: string): Date | null {
	if (endsAt === 'Recorrente') return null;

	const parsed = date(endsAt, 'MM/YY', true);

	if (!parsed.isValid()) {
		throw new Error('Invalid date');
	}

	return parsed.utc(true).toDate();
}

function transformDate(d: string): Date {
	const parsed = date(d, 'DD/MM/YY', true);

	if (!parsed.isValid()) {
		throw new Error('Invalid date');
	}

	return parsed.utc(true).toDate();
}

export function transformTransactionFormData(data: z.output<typeof transactionSchema>) {
	return {
		name: data.name,
		value: data.value,
		tags: transformTags(data.tags),
		date: transformDate(data.date),
		endsAt: transformEndsAt(data.endsAt),
		installments: data.installments || null,
		saveAndContinue: Boolean(data.saveAndContinue),
		groupId: data.groupId || null,
		type: data.type
	};
}

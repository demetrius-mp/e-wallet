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

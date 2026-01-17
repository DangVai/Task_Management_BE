import { Role } from '@prisma/client'; // Import enum từ Prisma

export class UserResponseDto {
    id!: string;
    email!: string;
    username!: string;
    fullName?: string | null;
    role!: Role;
    isActive!: boolean;
    createdAt!: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}

export class AuthResponseDto {
    user!: UserResponseDto;
    accessToken!: string; // Thường dùng để trả về kèm token sau khi login

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial);
        if (partial.user) {
            this.user = new UserResponseDto(partial.user);
        }
    }
}
// Định nghĩa cấu trúc User tối giản bên trong Task
class UserResponseDto {
    id!: string;
    username!: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}

export class TaskResponseDto {
    id!: string;
    content!: string;
    status!: string;
    createdAt!: Date;
    updatedAt!: Date;
    user!: UserResponseDto; // Thông tin user đi kèm từ lệnh 'include' trong prisma

    constructor(partial: Partial<TaskResponseDto>) {
        Object.assign(this, partial);
        if (partial.user) {
            this.user = new UserResponseDto(partial.user);
        }
    }
}

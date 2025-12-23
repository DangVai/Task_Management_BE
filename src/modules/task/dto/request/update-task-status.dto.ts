import { IsEnum, IsNotEmpty } from 'class-validator';

enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status!: TaskStatus;
}
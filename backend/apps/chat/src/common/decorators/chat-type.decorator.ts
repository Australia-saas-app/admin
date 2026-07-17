import { SetMetadata } from '@nestjs/common';

export const ChatType = (type: 'live' | 'order' | 'agency') => SetMetadata('chatType', type);


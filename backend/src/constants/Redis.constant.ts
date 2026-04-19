import { APP_CONSTANT } from "@/constants/AppConstant";

const redisHost = APP_CONSTANT.REDIS_HOST as string;
const redisPort = APP_CONSTANT.REDIS_PORT as number;

export const REDIS_CONSTANT = {
    redis: {
        port: redisPort,
        host: redisHost,
    },
};

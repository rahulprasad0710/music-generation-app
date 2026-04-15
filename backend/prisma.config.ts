import "dotenv/config";
import { defineConfig } from "prisma/config";
import { APP_CONSTANT } from "./src/constants/AppConstant";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: APP_CONSTANT.DATABASE,
    },
});

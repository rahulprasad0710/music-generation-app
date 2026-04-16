import { EcomActiveStatus } from "../../enums/ecommerce.enum";
import { FindOptionsOrderValue } from "typeorm";

declare global {
    namespace Express {
        interface Request {
            pagination: IPagination;
            verifiedUserId: number;
            verifiedUser: IUser;
            internalCompanyList: number[];
            internalCompanyId: number;
            tenantId: number;
            tenantSlug: string;
        }
    }
}

export interface IPagination {
    skip?: number;
    take?: number;
    keyword?: string;
    isPaginationEnabled: boolean;
    requestFromUrl?: string;
    ecomActiveStatus?: EcomActiveStatus;
    orderBy?: Record<string, FindOptionsOrderValue>;
}

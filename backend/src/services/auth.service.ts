import AppError from "@utils/AppError";
import { ErrorType } from "@enums/error.enum";
import { RedisService } from "@services/redis.service";
import bcrypt from "bcryptjs";
import generateToken from "@utils/generateToken";
import { UserService } from "./user.service";
import {
    LoginPayloadInput,
    RegisterPayloadInput,
} from "@/validations/auth.validation";
import { ILoggedInUser } from "@/types/auth.types";

const userService = new UserService();

const loginWithCredentials = async (payload: LoginPayloadInput) => {
    const { email, isRememberMe, password } = payload;
    const userFromDB = await userService.getByEmail(email);

    if (!userFromDB) {
        throw new AppError("Invalid Credentials", ErrorType.AUTH_ERROR);
    }

    const isPasswordCorrect = await checkPassword(
        password,
        userFromDB.password,
    );

    if (!isPasswordCorrect) {
        throw new AppError(
            "Invalid user credentials",

            ErrorType.AUTH_ERROR,
        );
    }

    if (userFromDB?.isBlacklisted) {
        throw new AppError("Forbidden", ErrorType.FORBIDDEN);
    }

    if (!userFromDB.isActive) {
        throw new AppError("User Deactivated.", ErrorType.AUTH_ERROR);
    }

    const accessToken = generateToken.accessToken({
        userId: userFromDB?.id,
        userType: "credentials",
        loginType: "credentials",
    });

    const refreshToken = generateToken.refreshToken({
        userId: userFromDB?.id,
        userType: "credentials",
        loginType: "credentials",
        isRememberMe,
    });

    await userService.updateRefreshToken(userFromDB.id, refreshToken);

    RedisService.setValue<ILoggedInUser>(`user:${userFromDB?.id}`, {
        id: userFromDB?.id,
        email: userFromDB?.email,
        name: userFromDB.name,
        authenticated: true,
        refreshToken,
        isRememberMe: userFromDB?.isRememberMe,
        isActive: userFromDB.isActive,
        isBlacklisted: userFromDB.isBlacklisted,
        isPremium: userFromDB.isPremium,
        type: "credentials",
    });

    return {
        id: userFromDB?.id,
        email: userFromDB?.email,
        name: userFromDB.name,
        authenticated: true,
        refreshToken,
        isRememberMe,
        accessToken,
        type: "credentials",
        isActive: userFromDB.isActive,
        isBlacklisted: userFromDB.isBlacklisted,
        isPremium: userFromDB.isPremium,
    };
};

const registerWithCredentials = async (payload: RegisterPayloadInput) => {
    const { name, email, password } = payload;
    const userFromDB = await userService.getByEmail(email);

    if (userFromDB) {
        throw new AppError("Email already taken.", ErrorType.AUTH_ERROR);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const createUserResponse = await userService.createUser({
        name,
        email,
        password: hashPassword,
    });

    if (!createUserResponse) {
        throw new AppError(
            "Something Went Wrong.",
            ErrorType.INTERNAL_SERVER_ERROR,
        );
    } else {
        return createUserResponse.id;
    }
};

const checkPassword = async (enteredPassword: string, realPassword: string) => {
    const isPasswordCorrect = await bcrypt.compare(
        enteredPassword,
        realPassword,
    );
    return isPasswordCorrect;
};

const logout = async (userId: number) => {
    RedisService.deleteKey(`user:${userId}`);

    await userService.updateRefreshToken(userId, undefined);

    return { id: userId, accessToken: null, refreshToken: null };
};

const authenticateUser = async (userId: number, fromCache: boolean) => {
    if (fromCache) {
        const cached = await RedisService.getValue<ILoggedInUser>(
            `user:${userId}`,
        );
        if (cached) return cached;
    }

    const userFromDB = await userService.getUserById(userId);
    if (!userFromDB) {
        return null;
    } else {
        const redisPayload: ILoggedInUser = {
            id: userFromDB?.id,
            email: userFromDB?.email,
            name: userFromDB.name,
            type: "credentials",
            authenticated: true,
            refreshToken: userFromDB.refreshToken,
            isRememberMe: userFromDB.isRememberMe,
            isActive: userFromDB.isActive,
            isBlacklisted: userFromDB.isBlacklisted,
            isPremium: userFromDB.isPremium,
        };
        RedisService.setValue(`user:${userFromDB?.id}`, redisPayload);
        return redisPayload;
    }
};

const refreshUser = async (userId: number, isRememberMe: boolean) => {
    const refreshToken = generateToken.refreshToken({
        userId: userId,
        userType: "credentials",
        loginType: "credentials",
        isRememberMe: isRememberMe,
    });
    const accessToken = generateToken.accessToken({
        userId: userId,
        userType: "credentials",
        loginType: "credentials",
    });

    await userService.updateRefreshToken(userId, refreshToken);

    await authenticateUser(userId, false);

    return {
        refreshToken,
        accessToken,
    };
};

const authenticateMe = async (userId: number) => {
    const accessToken = generateToken.accessToken({
        userId: userId,
        userType: "credentials",
        loginType: "credentials",
    });
    return accessToken;
};

export default {
    loginWithCredentials,
    registerWithCredentials,
    authenticateMe,
    refreshUser,
    logout,
    authenticateUser,
};

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const loginLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(5,"1 m")
})

export const signupLimiter = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(3,"1 m")
})

export const searchLimit = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(10, "1 m")
})

export const favouriteLimit = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(10, "1 m")
})

export const updateUserNameLimit = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(2, "1 m")
})

export const updatePasswordLimit = new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(1, "1 m")
})


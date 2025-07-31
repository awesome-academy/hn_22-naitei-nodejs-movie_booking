import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, UseGuards } from '@nestjs/common'
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()

export class AccessTokenGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        // lấy ra accessToken khi truyền lên
        const accessToken = request.headers.authorization?.split(' ')[1]
        if (!accessToken) {
            throw new UnauthorizedException()
        }
        try {
            // xác thực lại token
            const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken)
            request[REQUEST_USER_KEY] = decodedAccessToken
            return true
        } catch {
            throw new UnauthorizedException()
        }
    }
}

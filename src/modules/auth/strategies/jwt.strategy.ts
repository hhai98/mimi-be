import { TOKEN_TYPE_ENUM } from 'modules/auth/enums/tokens.enum'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'
import { User } from 'modules/users/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

type JwtPayload = Pick<User, 'id' | 'role'> & { iat: number; exp: number; type: TOKEN_TYPE_ENUM }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
    })
  }

  public async validate(payload: JwtPayload) {
    // Check token: It must be accessToken
    if (payload.type !== TOKEN_TYPE_ENUM.ACCESS_TOKEN) throw new UnauthorizedException('Sai token')

    // We need to find user because when user was deleted, token will be expired. Or Id from payload is not exist in database
    const currentUser = await this.usersRepository.findOne({
      where: { id: payload.id },
    })

    if (!currentUser) throw new UnauthorizedException('Sai token hoặc Không tìm thấy user')

    return currentUser
  }
}

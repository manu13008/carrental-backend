
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {

    
    
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = bcrypt.compareSync(pass, user.password);
      if (!isPasswordValid) {
        console.log('Mot de passe incorrect');
        throw new UnauthorizedException('Invalid credentials');
      }
  
      console.log('Mots de passe identiques');
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        console.error('Error during sign-in process:', error);
        throw new InternalServerErrorException('An error occurred during the sign-in process');
      }
    }
  }



}

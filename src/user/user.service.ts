import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const bcrypt = require('bcrypt');
import { User} from './schemas/user.schema';


@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}


  async createUser(createUserDto: CreateUserDto): Promise<User> {
// Vérifiez si l'utilisateur existe déjà
const existingUser = await this.findOne(createUserDto.email);

// Je vérifie qu'il n'existe pas déjà
if (existingUser) {
  throw new ConflictException('User with this email already exists');
}

    const hash = bcrypt.hashSync(createUserDto.password, 10); // je hash le mot de passe

    // je créé mon nouvel utilisateur
    const savedUser = this.userModel.create({
      email : createUserDto.email,
      password : hash,
    })
    return savedUser; 
  }



  async findOne(email : string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }


  async addDL(email: string, filePath: string): Promise<User> {
    console.log(email)
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { drivingLicensePath: filePath },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user.save() ;
  }
  
//   findAll() {
//     return `This action returns all user`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} user`;
//   }

//   update(id: number, updateUserDto: UpdateUserDto) {
//     return `This action updates a #${id} user`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} user`;
//   }
}

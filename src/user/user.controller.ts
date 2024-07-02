import { Controller,  Post, Body, BadRequestException} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {  UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';


import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }





  @UseGuards(AuthGuard)
  @Post('loaddrivinglicence')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/driving-licenses',
      filename: (req, file, cb) => {
     
        // console.log('MANUUUU CB',cb)
        // console.log('MANUUUU REQ',req.user)

        // Controle de l'extension du fichier
        const fileExtension = extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.pdf', '.jpeg', '.jpg'];

        if (!allowedExtensions.includes(fileExtension)) {
          return cb(new BadRequestException('Only PDF and JPEG files are allowed'), false);
        }
        const timestamp = Date.now();
        const newFileName = `${req.user.sub}-${timestamp}${fileExtension}`; 
        cb(null, newFileName);
      }
    })
  }))

  async addDrivingLicense(@UploadedFile() file , @Request() req) {
    console.log('File received:', file);
    return this.userService.addDL(req.user.email, file.path);
  }






//   @Get()
//   findAll() {
//     return this.userService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.userService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//     return this.userService.update(+id, updateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.userService.remove(+id);
//   }
}

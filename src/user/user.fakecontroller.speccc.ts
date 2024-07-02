// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './schemas/user.schema';
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { AuthGuard } from '../auth/auth.guard';
// import { JwtService } from '@nestjs/jwt';

// describe('UserController', () => {
//   let userController: UserController;
//   let userService: UserService;

//   const mockUserService = {
//     createUser: jest.fn(),
//   };

//   const mockJwtService = {
//     sign: jest.fn().mockReturnValue('mockJwtToken'),
//     verify: jest.fn().mockReturnValue({ userId: 'mockUserId' }),
//   };

//   beforeEach(async () => {

//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         UserService,
//         {
//           provide: getModelToken(User.name),
//           useValue: Model,
//         },
//         {
//           provide: JwtService,
//           useValue: mockJwtService,
//         },
//         {
//           provide: AuthGuard,
//           useValue: {
//             canActivate: jest.fn(() => true), // Mock implementation of AuthGuard
//           },
//         },
//       ],
//     })
//       .overrideProvider(UserService)
//       .useValue(mockUserService)
//       .compile();

//     userController = module.get<UserController>(UserController);
//     userService = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(userController).toBeDefined();
//   });

//   describe('createUser', () => {
//     it('should create a new user', async () => {
//       const createUserDto: CreateUserDto = {
//         email: 'test@example.com',
//         password: 'password123',
//       };

//       const result: User = {
//         email: createUserDto.email,
//         password: 'hashedPassword123',
//         drivingLicensePath: '',
//       } as User;

//       jest.spyOn(userService, 'createUser').mockImplementation(async () => result);

//       expect(await userController.createUser(createUserDto)).toBe(result);
//       expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
//     });
//   });
// });

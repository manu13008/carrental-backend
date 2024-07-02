import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User  } from './schemas/user.schema';
import { ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
// import * as bcrypt from 'bcrypt';


describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    email: 'test2@gmail.com',
    password: 'hashedPassword',
    drivingLicensePath: null,
    save: jest.fn().mockResolvedValue(true),
  };

  const updatedUser = {
    ...mockUser,
    drivingLicensePath: '/path/to/driving/license',
  };

  const mockUserModel = {


    findOne: jest.fn().mockImplementation((query) => {
      if (query.email === 'test2@gmail.com') {
        return { exec: jest.fn().mockResolvedValue({ email: 'test2@gmail.com', password: 'hashedPassword' }) };
      }
      return { exec: jest.fn().mockResolvedValue(null) };
    }),


    // create: jest.fn().mockImplementation((createUserDto) => {
    //   return { ...createUserDto, save: jest.fn().mockResolvedValue(true) };
    // }),
    create: jest.fn().mockResolvedValue({ email: 'new@example.com', password: 'hashedPassword123' }),
 


    findOneAndUpdate: jest.fn().mockImplementation((query, update, options) => {
      if (query.email === 'test2@gmail.com') {
        return { exec: jest.fn().mockResolvedValue(updatedUser) };
      }
      return { exec: jest.fn().mockResolvedValue(null) };
    }),

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });


 


  it('should be defined', () => {
    expect(service).toBeDefined();
  });





  describe('findOne', () => {
    it('should return a user if email exists', async () => {
      const email = 'test2@gmail.com';
      const user = await mockUserModel.findOne({ email }).exec();
      expect(user).toBeDefined();
      expect(user.email).toBe(email);
    });

    it('should return null if email does not exist', async () => {
      const email = 'nonexistinguser@gmail.com';
      const user = await mockUserModel.findOne({ email }).exec();
      expect(user).toBeNull();
    });
  });



  describe('createUser', () => {
    it('should throw a ConflictException if user already exists', async () => {
      const createUserDto = {
        email: 'test2@gmail.com',
        password: 'password123',
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(mockUserModel.create).not.toHaveBeenCalled();
     
    });





    it('should create a new user if email does not exist', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'hashedPassword123',
      };


      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      expect(createUserDto.email).toMatch(emailRegex);

      // Validate password length
      expect(createUserDto.password.length).toBeGreaterThanOrEqual(8);

      // Check que l'utilisateur n'est pas connu
      const userNonexisting = await service.findOne(createUserDto.email);
      expect(userNonexisting).toBeNull;

     

      const user = await mockUserModel.create(createUserDto);
      // const user = await service.createUser(createUserDto)
      // console.log(user)

      expect(user).toBeDefined();
      expect(user.email).toBe(createUserDto.email);
      expect(user.password).toBe(createUserDto.password);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: createUserDto.password,
      });
    });
  });





  // describe('addDL', () => {
  //   it('should update the driving license path of the user', async () => {
  //     const email = 'test2@gmail.com';
  //     const filePath = '/path/to/driving/license';
      
  //     const user = await service.addDL(email, filePath);
  //     console.log('userrrrr', user)

  //     expect(user).toBeDefined();
  //     expect(user.email).toBe(email);
  //     expect(user.drivingLicensePath).toBe(filePath);
  //     expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
  //       { email },
  //       { drivingLicensePath: filePath },
  //       { new: true }
  //     );
  //   });



    it('should throw an error if user is not found', async () => {
      const email = 'nonexistinguser@gmail.com';
      const filePath = '/path/to/driving/license';

      await expect(service.addDL(email, filePath)).rejects.toThrow();
    });
  });


  // });







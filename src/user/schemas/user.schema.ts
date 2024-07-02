import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ 
    required: true,
    match: [/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,'Merci de renseigner une addresse email valide']
  })
  email: string;

  @Prop({ 
    required: true, 
    minlength: [8, 'Votre mot de passe doit faire au moins 8 caractères'] })
  password: string;



@Prop()
drivingLicensePath: string; 
}

export const UserSchema = SchemaFactory.createForClass(User);
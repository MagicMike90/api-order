import { Document, Model, model, Schema } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import User from '../models/user';

export interface UserModel extends User, Document {
  createdAt: Date;
  modifiedAt: Date;
}

export const UserSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  userStatus: Number,
  username: String,
});

UserSchema.methods.fullName = function(): string {
  return this.firstName.trim() + ' ' + this.lastName.trim();
};

UserSchema.plugin(uniqueValidator);

export const UserModel: Model<UserModel> = model<UserModel>('User', UserSchema);

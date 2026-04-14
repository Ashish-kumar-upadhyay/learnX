import mongoose, { Schema, Document } from 'mongoose';
import type { AppRole } from '../types/auth.types';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: AppRole;
  assignedClass?: string | null;
  avatar_url?: string | null;
  is_approved?: boolean;

  // Token invalidation (optional for existing data)
  token_version?: number;

  /** One-time link for welcome email (plain token stored; cleared after use). */
  welcome_login_token?: string | null;
  welcome_login_expires?: Date | null;

  // Existing naming from your current Mongo documents
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
    assignedClass: { type: String, default: null },
    avatar_url: { type: String, default: null },
    is_approved: { type: Boolean, default: true },

    token_version: { type: Number, default: 0 },

    welcome_login_token: { type: String, default: null, select: false, sparse: true, index: true },
    welcome_login_expires: { type: Date, default: null, select: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'users' }
);

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);

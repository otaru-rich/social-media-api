import { Schema, Document, model , Model} from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default model<IUser,Model<IUser>>('User', UserSchema);

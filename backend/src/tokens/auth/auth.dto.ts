import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator'
import { Exclude } from 'class-transformer'

export class LoginBodyDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Mật khẩu phải từ 6 đến 20 kí tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).+$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    name: string
    email: string
    role: string
  }

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDTO {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string

  @Length(6, 20, { message: 'Mật khẩu phải từ 6 đến 20 kí tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).+$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string
}

export class RegisterResDTO {
  id: number
  email: string
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial)
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}

export class LogoutBodyDTO extends RefreshTokenBodyDTO {}

export class LogoutResDTO {
  message: string
  constructor(partial: Partial<LogoutResDTO>) {
    Object.assign(this, partial)
  }
}

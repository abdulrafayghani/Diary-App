import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../interfaces/user.interface';
import * as Yup from 'yup';
import http from '../../services/api';
import { saveToken, setAuthState } from './authSlice';
import { setUser } from './userSlice';
import { AuthResponse } from '../../services/mirage/routes/user';
import { useAppDispatch } from '../../store';

const schema = Yup.object().shape<any>({
  username: Yup.string()
    .required('What? No username?')
    .max(16, 'Username cannot be longer than 16 characters'),
  password: Yup.string().required('Without a password, "None shall pass!"'),
  email: Yup.string().email('Please provide a valid email address (abc@xy.z)'),
});

const Auth: FC = () => {
  const { handleSubmit, register, errors } = useForm<User>({
    validationSchema: schema
            
});

  const [isLogin, SetISLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispath = useAppDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? '/auth/login' : '/auth/signup';
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispath(saveToken(token));
          dispath(setUser(user));
          dispath(setAuthState(true));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(submitForm)}>
          <div>
            <input ref={register} name="username" placeholder="Username" />
            {errors && errors.username && (
              <p className="error"> {errors.username.message} </p>
            )}
          </div>
          <div>
            <input
              ref={register}
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors && errors.password && (
              <p className="error"> {errors.password.message} </p>
            )}
          </div>
          {!isLogin && (
            <div>
              <input
                ref={register}
                name="email"
                placeholder="Email (optional)"
              />
              {errors && errors.email && (
                <p className="error"> {errors.email.message} </p>
              )}
            </div>
          )}
          <div>
            <button type="submit" disabled={loading}>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
          <p
            onClick={() => SetISLogin(!isLogin)}
            style={{ cursor: 'pointer', opacity: 0.7 }}
          >
            {isLogin ? 'No account? Create one' : 'Already have an account?'}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;

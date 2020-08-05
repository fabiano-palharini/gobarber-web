import React, { useCallback, useRef, ChangeEvent } from 'react';
import {  FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import {  useHistory, Link } from 'react-router-dom';
import { Container, Content, AvatarInput } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { userInfo } from 'os';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const data = new FormData();

      data.append('avatar_file_name', e.target.files[0]);

      api.patch('/users/avatar', data).then((response) => {
        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Avatar updated!'
        });
      });
    }
  }, [addToast, updateUser]);


  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is mandatory'),
          email: Yup.string()
            .required('E-mail is mandatory')
            .email('Please inform a valid email'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Mandatory field'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Mandatory field'),
            otherwise: Yup.string(),
          }).oneOf(
            [Yup.ref('password'), null],
            'Password confirmation does not match'
          ),
        });

        await schema.validate(data, { abortEarly: false });

        //object.assign une os objetos
        const formData = Object.assign({
          name: data.name,
          email: data.email,
        }, data.old_password ? {
          old_password: data.old_password,
          password: data.password,
          password_confirmation: data.password_confirmation,
        } : {});

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Profile updated!',
          description: 'Your profile has been updated successfully!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Error when saving the information',
          description:
            'An error happened when saving your profile information. Please check it and try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to='/dashboard'>
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form ref={formRef} initialData={{name: user.name, email: user.email}} onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>My Profile</h1>
          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="E-Mail" />
          <Input
            containerStyle={{ marginTop: 24}}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Current Password"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New Password"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Password Confirmation"
          />
          <Button type="submit">Update</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;

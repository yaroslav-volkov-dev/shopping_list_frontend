import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { errorMessageRequired } from '../../utils/infoMessages.js';
import { useAuth } from '../../hooks/useAuth.js';

export const RegistrationPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: handleRegistration, isLoading } = useAuth();

  const onSubmit = async (data) => {
    await handleRegistration(data);
  };
  
  return (
    <>
      <h1>REGISTRATION PAGE</h1>
      <div className="w-full flex justify-center">
        <form className="w-[700px] bg-green-200 flex flex-col p-5 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Enter your name"
            errorMessage={errors.username?.message}
            {...register('username', {
              required: errorMessageRequired,
              minLength: { value: 3, message: 'The min length is 3 characters' }
            })}
          />
          <Input
            label="Enter your email"
            labelClassName="mt-2"
            errorMessage={errors.email?.message}
            {...register('email', {
              required: errorMessageRequired,
              pattern: { value: /\S+@\S+\.\S+/, message: 'This field must be email' }
            })}
          />
          <Input
            label="Enter your password"
            labelClassName="mt-2"
            errorMessage={errors.password?.message}
            {...register('password', {
              required: errorMessageRequired,
              minLength: { value: 5, message: 'The min length is 5 characters' },
            })}
          />
          <Input
            label="Enter your password again"
            labelClassName="mt-2"
            errorMessage={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              validate: (value, formValues) => {
                if (formValues.password !== value) {
                  return 'Your passwords do no match';
                }
              },
            })}
          />
          <div className="mt-5 flex justify-center">
            <button type="submit" className="border border-black rounded px-3 py-1">Submit</button>
          </div>
        </form>
      </div>
      <OverlayLoader show={isLoading} />
    </>
  );
};
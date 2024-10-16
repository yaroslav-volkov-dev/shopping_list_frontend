import { Link } from '../Link/Link.jsx';
import { Button } from '../Button/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const authorizedLinks = [
  {
    label: 'Your profile',
    to: '/profile'
  },
  {
    label: 'Edit database',
    to: '/edit-database',
  }
];

const unauthorizedLinks = [
  {
    label: 'Registration',
    to: '/registration',
  },
  {
    label: 'Login',
    to: '/login',
  },
];


const renderLinks = (links) => links.map(({ to, label }) => (
  <Link
    to={to}
    key={to}
    className={({ isActive }) => isActive && 'text-button-primary'}
  >
    {label}
  </Link>
));

export const Header = () => {
  const { logout, isAuth, userData } = useAuth();
  const { username } = userData || {};

  return (
    <header className="w-full h-16 flex items-center bg-primary shrink-0 justify-between px-16">
      <div className="flex items-center">
        <Link to="/">
          <h2 className="font-[600] text-center text-[24px] flex flex-col">
            Shopping list
          </h2>
        </Link>
      </div>
      {username && (
        <p className="text-center font-bold">
          Hello, {userData.username}
        </p>
      )}
      <div
        className="flex items-center gap-3">{isAuth ? (
        <>
          {renderLinks(authorizedLinks)}
          <Button onClick={logout}>
            Log out
          </Button>
        </>
      ) : renderLinks(unauthorizedLinks)}
      </div>
    </header>
  );
};
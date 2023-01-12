import { Grid, Toolbar } from '@mui/material';
import Link from 'next/link';
import PropTypes from 'prop-types';
import MenuWithAvatar from './MenuWithAvatar';
import { styleToolbar } from './SharedStyles';

const optionsMenu = [
  { text: 'Got question?', href: 'https://github.com/danielatonge', anchor: true },
  { text: 'Log out', href: '/logout' },
];
const Header = ({ user }) => {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justifyContent="space-around" align="center">
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            {user ? (
              <div style={{ whiteSpace: 'nowrap' }}>
                {user.avatarUrl && (
                  <MenuWithAvatar
                    options={optionsMenu}
                    src={user.avatarUrl}
                    alt={user.displayName}
                  />
                )}
              </div>
            ) : (
              <Link href="/public/login" as="/login">
                <a style={{ margin: '0px 20px 0px auto' }}>Log in</a>
              </Link>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
  }),
};

Header.defaultProps = {
  user: null,
};

Header.getInitialProps = async (ctx) => {
  return {
    user: ctx.req.user,
  };
};

export default Header;

import { Button } from '@mui/material';
// import dynamic from 'next/dynamic';
import Head from 'next/head';
import PropTypes from 'prop-types';
import notify from '../lib/notify';
import withAuth from '../lib/withAuth';

const propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  user: null,
};

// const DynamicButton = dynamic(import('../components/DynamicButton'), { ssr: false });

const Index = ({ user }) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index page</title>
      <meta name="description" content="This is the description of the index page" />
    </Head>
    <p>Content on Index page {user && user.displayName}</p>
    <p>Email: {user.email}</p>
    <p>Slug: {user.slug}</p>
    <Button
      variant="contained"
      onClick={() => notify({ notificationMessage: 'some javascript here' })}
    >
      Notify Me
    </Button>
    {/* <DynamicButton /> */}
  </div>
);

Index.propTypes = propTypes;
Index.defaultProps = defaultProps;
export default withAuth(Index);

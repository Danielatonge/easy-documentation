import { Button, Stack, TextField } from '@mui/material';
import Head from 'next/head';
import { styleLoginButton } from '../../components/SharedStyles';
import withAuth from '../../lib/withAuth';

const Login = () => (
  <div style={{ textAlign: 'center', margin: '0 20px' }}>
    <Head>
      <title>Login page</title>
      <meta name="description" content="This is the description of the Login page" />
    </Head>
    <br />

    <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: '400' }}>Log in</p>
    <p>You’ll be logged in for 14 days unless you log out manually.</p>
    <Stack
      component="form"
      sx={{
        width: '25ch',
        margin: '45px auto',
      }}
      spacing={2}
      noValidate
      autoComplete="off"
    >
      <TextField hiddenLabel defaultValue="Username" variant="filled" />
      <TextField hiddenLabel defaultValue="Password" type="password" variant="filled" />
    </Stack>
    <p>OR</p>
    <br />
    <Button variant="contained" style={styleLoginButton} href="/auth/google">
      <img
        src="https://storage.googleapis.com/builderbook/G.svg"
        alt="Log in with Google"
        style={{ marginRight: '10px' }}
      />
      Log in with Google
    </Button>
  </div>
);

export default withAuth(Login, { byPassLogin: true });

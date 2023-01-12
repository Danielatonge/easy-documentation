import Router from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

let globalUser = null;

function withAuth(Component, { loginRequired = true, byPassLogin = false } = {}) {
  const propTypes = {
    user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      isAdmin: PropTypes.bool.isRequired,
    }),
    isFromServer: PropTypes.bool.isRequired,
  };

  const defaultProps = {
    user: null,
  };

  class Page extends React.Component {
    static async getInitialProps(ctx) {
      const isFromServer = typeof window === 'undefined';
      const user = ctx.req ? ctx.req.user : globalUser;

      if (isFromServer && user) {
        console.log('before', typeof user._id, user._id);
        user._id = user._id.toString();
        console.log('after', typeof user._id, user._id);
      }

      const props = { user, isFromServer };

      if (Component.getInitialProps) {
        Object.assign(props, (await Component.getInitialProps(ctx)) || {});
      }
      console.log(props);
      return props;
    }

    componentDidMount() {
      const { user, isFromServer } = this.props;

      if (isFromServer) {
        globalUser = user;
      }
      // componentDidMount
      if (loginRequired && !byPassLogin && !user) {
        Router.push('/login');
        return;
      }

      if (byPassLogin && user) {
        Router.push('/');
      }
    }

    render() {
      const { user } = this.props;
      if (loginRequired && !byPassLogin && !user) {
        return null;
      }

      if (byPassLogin && user) {
        return null;
      }

      return <Component {...this.props} />;
    }
  }

  Page.propTypes = propTypes;
  Page.defaultProps = defaultProps;

  return Page;
}

export default withAuth;

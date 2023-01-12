import { Button } from '@mui/material';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { getBookListApiMethod } from '../../lib/api/admin';
import notify from '../../lib/notify';
import withAuth from '../../lib/withAuth';

const propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const Index = ({ books }) => (
  <div style={{ padding: '10px 45px' }}>
    <div>
      <h2>Books</h2>
      <Link href="/admin/add-book">
        <Button variant="contained"> Add book</Button>
      </Link>
      <br />
      <ul>
        {books.map((b) => (
          <li key={b._id}>
            <Link href={`/admin/book-detail?slug=${b.slug}`} as={`/admin/book-detail/${b.slug}`}>
              <a>{b.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <br />
    </div>
  </div>
);

Index.propTypes = propTypes;

class IndexWithData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  async componentDidMount() {
    try {
      const { books } = await getBookListApiMethod();
      this.setState({ books });
    } catch (err) {
      notify(err);
    }
  }

  render() {
    return <Index {...this.state} />;
  }
}

export default withAuth(IndexWithData);

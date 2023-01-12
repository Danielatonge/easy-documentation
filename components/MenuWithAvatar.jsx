import { Avatar, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(Object).isRequired,
};

class MenuWithAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
    };
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { src, alt, options } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <Avatar
          aria-controls={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          src={src}
          alt={alt}
          style={{ margin: '0px 20px 0px auto', cursor: 'pointer' }}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          keepMounted
        >
          {options.map((option) => (
            <div id="wrappingLink" key={option.text}>
              {option.anchor ? (
                <MenuItem
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.href = option.href;
                    this.handleClose();
                  }}
                >
                  {option.text}
                </MenuItem>
              ) : (
                <Link href={option.href} as={option.as || option.href}>
                  <MenuItem>{option.text}</MenuItem>
                </Link>
              )}
            </div>
          ))}
        </Menu>
      </div>
    );
  }
}

MenuWithAvatar.propTypes = propTypes;

export default MenuWithAvatar;

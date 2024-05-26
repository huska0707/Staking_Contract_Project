import { useState, useEffect } from 'react';
import { IsMobile } from '@utils/utils';
import ModeButton from '@components/ModeButton';

const Header = () => {
    const [anchorEl, setAnchorEl] = useState();
    const location = useLocation();
  
    const open = Boolean(anchorEl);
    const id = open ? 'popover' : undefined;
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
 
 return (   
    <header id="myHeader" className="header container mx-auto top-0 flex items-center justify-between px-4 sm:px-8 py-4 z-[60] transition-all text-white">
    {IsMobile() ?
      <img src="assets/logo.png" width="70" alt="logo" />
      :
      <img src="assets/logo3.png" width="130" alt="logo" />
    }

    <div className="w-1/2 sm:w-3/12 flex gap-1 sm:gap-3 justify-end items-center">
      <ModeButton />
      <WalletButton />
      <div className='block xl:hidden'>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuOpenIcon
            sx={{
              color: 'white',
              fontSize: '32px'
            }}
          />
        </IconButton>
      </div>
    </div>
  </header>
  )
}

export default Header;
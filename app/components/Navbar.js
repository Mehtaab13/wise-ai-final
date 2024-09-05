import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Link } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import logoImage from './openart-f37951f6-6b23-47be-ac5b-f1c6be527db5.png';


export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed"
      sx={{ 
        backgroundColor: "#2c2c2c",
        color: "#f95d9b",
        top: 0,
        zIndex: 10,
        height: '64px',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <Box sx={{ mr: 2 }}> 
              <Image
                src={logoImage}
                alt="InstaWise AI Logo"
                width={60}
                height={60}
                style={{ borderRadius: '50%' }}
              />
            </Box>
            <Typography variant="h6">
              InstaWise AI
            </Typography>
          </Link>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" onClick={handleMenuClick}>
            Menu
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#1e1e1e', 
                color: '#f95d9b',
              }
            }}
          >
            <MenuItem
              onClick={handleMenuClose}
              component="a"
              href="/"
              sx={{
                color: '#f95d9b',
                '&:hover': {
                  backgroundColor: '#39a0ca',
                },
              }}
            >
              Home
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component="a"
              href="/generate"
              sx={{
                color: '#f95d9b',
                '&:hover': {
                  backgroundColor: '#39a0ca',
                },
              }}
            >
              Advice Bot
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component="a"
              href="/flashcards"
              sx={{
                color: '#f95d9b',
                '&:hover': {
                  backgroundColor: '#39a0ca',
                },
              }}
            >
              View Chat History
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component="a"
              href="/payment"
              sx={{
                color: '#f95d9b',
                '&:hover': {
                  backgroundColor: '#39a0ca',
                },
              }}
            >
              Upgrade Account
            </MenuItem>
          </Menu>

          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ ml: 2 }}>
              Login
            </Button>
            <Button color="inherit" href="/sign-up" sx={{ ml: 2 }}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

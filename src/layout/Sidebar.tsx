import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Agriculture as AgricultureIcon,
  Inventory as InventoryIcon,
  Payment as PaymentIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, NavigationItem } from '../types';

const drawerWidth = 240;

const navigationItems: NavigationItem[] = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: 'Dashboard',
  },
  {
    text: 'Farmers',
    path: '/farmers',
    icon: 'People',
  },
  {
    text: 'Harvests',
    path: '/harvests',
    icon: 'Agriculture',
  },
  {
    text: 'Batches',
    path: '/batches',
    icon: 'Inventory',
  },
  {
    text: 'Payments',
    path: '/payments',
    icon: 'Payment',
    roles: ['COOP_ADMIN', 'FINANCE', 'SUPER_ADMIN'],
  },
  {
    text: 'Daily Prices',
    path: '/prices',
    icon: 'Price',
    roles: ['COOP_ADMIN', 'SUPER_ADMIN'],
  },
];

const iconMap: { [key: string]: React.ReactElement } = {
  Dashboard: <DashboardIcon />,
  People: <PeopleIcon />,
  Agriculture: <AgricultureIcon />,
  Inventory: <InventoryIcon />,
  Payment: <PaymentIcon />,
  Price: <AttachMoneyIcon />,
};

interface SidebarProps {
  open?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path: string): void => {
    console.log('=== SIDEBAR NAVIGATION ===');
    console.log('Navigating to:', path);
    navigate(path);
  };

  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return user ? item.roles.includes(user.role) : false;
  });

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AgricultureIcon color="primary" fontSize="large" />
          <Typography variant="h6" noWrap component="div" color="primary">
            Smart Coop
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {filteredNavigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {iconMap[item.icon]}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      {user && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            Logged in as:
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {user.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role}
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;

"use client";

import { useState } from "react";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { LOGO } from "../../config/siteConfig";
import { BrandText } from "../ui";

const Shell = styled(AppBar)({
  background: "rgba(6,6,6,.96)",
  borderBottom: "1px solid rgba(184,134,11,.2)",
  backdropFilter: "blur(20px)",
  boxShadow: "none",
  color: "#f8f4ec",
});

const NavToolbar = styled(Toolbar)({
  minHeight: 76,
  maxWidth: 1360,
  width: "100%",
  margin: "0 auto",
  paddingLeft: 36,
  paddingRight: 36,
  gap: 24,
  "@media (max-width: 600px)": {
    minHeight: 72,
    paddingLeft: 14,
    paddingRight: 14,
    gap: 12,
  },
});

const BrandButton = styled(Button)({
  justifyContent: "flex-start",
  minWidth: 0,
  padding: 0,
  color: "inherit",
  textAlign: "left",
  textTransform: "none",
  "&:hover": {
    background: "transparent",
  },
});

const LogoFrame = styled(Box)({
  display: "grid",
  placeItems: "center",
  width: 42,
  height: 42,
  flex: "0 0 42px",
  padding: 2,
  borderRadius: "50%",
  background: "conic-gradient(#b8860b,#f0c040,#e8d5a3,#f0c040,#b8860b)",
});

const NavButton = styled(Button, {
  shouldForwardProp: prop => prop !== "active",
})(({active}) => ({
  minHeight: 40,
  padding: "8px 13px",
  borderBottom: active ? "1px solid #f0c040" : "1px solid transparent",
  borderRadius: 0,
  color: active ? "#f0c040" : "rgba(248,244,236,.55)",
  fontFamily: "Cinzel, serif",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  transition: "color .2s ease,border-color .2s ease",
  whiteSpace: "nowrap",
  "&:hover": {
    borderBottomColor: "#f0c040",
    background: "transparent",
    color: "#f0c040",
  },
}));

const AdminButton = styled(NavButton)({
  color: "#b8860b",
  fontSize: 9,
});

const MobileDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    width: "min(340px, calc(100vw - 32px))",
    borderLeft: "1px solid rgba(184,134,11,.24)",
    background: "#080808",
    color: "#f8f4ec",
    padding: 18,
  },
});

export default function SiteNavbar({brandName,companyName,navItems,activePage,onNavigate,onAdmin}) {
  const [open,setOpen] = useState(false);
  const items = navItems || [];

  const navigate = page => {
    onNavigate(page);
    setOpen(false);
  };

  const admin = () => {
    onAdmin();
    setOpen(false);
  };

  const navButtons = items.map(item=>(
    <NavButton key={item.k} active={activePage===item.k ? 1 : 0} onClick={()=>navigate(item.k)}>
      {item.l}
    </NavButton>
  ));

  return (
    <Shell position="fixed">
      <NavToolbar disableGutters>
        <BrandButton onClick={()=>navigate("home")} aria-label="Go to home">
          <Stack direction="row" alignItems="center" spacing={1.5} minWidth={0}>
            <LogoFrame>
              <Avatar src={LOGO} alt="Monarch Blends logo" sx={{width:36,height:36}}/>
            </LogoFrame>
            <Box minWidth={0}>
              <BrandText sz={24}>{brandName}</BrandText>
              <Typography
                component="span"
                sx={{
                  display:"block",
                  maxWidth:{xs:210,sm:320},
                  mt:.25,
                  overflow:"hidden",
                  color:"rgba(248,244,236,.42)",
                  fontSize:8,
                  letterSpacing:2,
                  lineHeight:1.4,
                  textOverflow:"ellipsis",
                  textTransform:"uppercase",
                  whiteSpace:{xs:"normal",sm:"nowrap"}
                }}
              >
                {companyName}
              </Typography>
            </Box>
          </Stack>
        </BrandButton>

        <Stack component="nav" direction="row" alignItems="center" justifyContent="flex-end" flex={1} sx={{display:{xs:"none",lg:"flex"}}} aria-label="Primary navigation">
          {navButtons}
          <AdminButton onClick={admin} startIcon={<AdminPanelSettingsOutlinedIcon sx={{fontSize:14}}/>}>
            Admin
          </AdminButton>
        </Stack>

        <Box flex={1} sx={{display:{xs:"block",lg:"none"}}}/>
        <IconButton
          onClick={()=>setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          sx={{display:{xs:"inline-flex",lg:"none"},color:"#f0c040"}}
        >
          <MenuIcon/>
        </IconButton>
      </NavToolbar>

      <MobileDrawer anchor="right" open={open} onClose={()=>setOpen(false)}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <BrandText sz={22}>{brandName}</BrandText>
          <IconButton onClick={()=>setOpen(false)} aria-label="Close navigation menu" sx={{color:"#f0c040"}}>
            <CloseIcon/>
          </IconButton>
        </Stack>
        <Stack component="nav" spacing={1} aria-label="Mobile navigation">
          {items.map(item=>(
            <NavButton key={item.k} active={activePage===item.k ? 1 : 0} onClick={()=>navigate(item.k)} fullWidth>
              {item.l}
            </NavButton>
          ))}
          <AdminButton onClick={admin} startIcon={<AdminPanelSettingsOutlinedIcon sx={{fontSize:14}}/>} fullWidth>
            Admin
          </AdminButton>
        </Stack>
      </MobileDrawer>
    </Shell>
  );
}

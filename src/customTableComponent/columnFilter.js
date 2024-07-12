import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

export default function BasicMenu({ columns, setColumnsData }) {
  const [anchorEl, setAnchorEl] = React.useState();
  // (React.useState < null) | (HTMLElement > null);
  const open = Boolean(anchorEl);
  const [checked, setChecked] = React.useState([...columns.slice(0, 4)]);
  console.log(checked, "checked");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const sortColumnsById = (columns) => {
    return columns.sort((a, b) => a.id - b.id);
  };

  const handleToggle = (value) => () => {
    console.log(value, "value");

    const currentIndex = checked.indexOf(value);
    console.log(currentIndex, "currentInder");
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setColumnsData(sortColumnsById(newChecked));
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4"
          height="25"
          viewBox="0 0 4 25"
          fill="none"
        >
          <path
            d="M2.00002 4.50003C3.10461 4.50003 4.00005 3.60459 4.00005 2.50002C4.00005 1.39544 3.10461 0.5 2.00002 0.5C0.895441 0.5 0 1.39544 0 2.50002C0 3.60459 0.895441 4.50003 2.00002 4.50003Z"
            fill="#333333"
          />
          <path
            d="M2.00002 14.5C3.10461 14.5 4.00005 13.6046 4.00005 12.5C4.00005 11.3954 3.10461 10.5 2.00002 10.5C0.895441 10.5 0 11.3954 0 12.5C0 13.6046 0.895441 14.5 2.00002 14.5Z"
            fill="#333333"
          />
          <path
            d="M2.00002 24.5C3.10461 24.5 4.00005 23.6046 4.00005 22.5C4.00005 21.3954 3.10461 20.4999 2.00002 20.4999C0.895441 20.4999 0 21.3954 0 22.5C0 23.6046 0.895441 24.5 2.00002 24.5Z"
            fill="#333333"
          />
        </svg>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {columns?.map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem key={value} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={` ${value?.label}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Menu>
    </div>
  );
}

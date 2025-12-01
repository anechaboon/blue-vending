import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default function AdminSideMenu() {
    return (
        <Sidebar width="250px" className="h-full bg-gray-700 text-black">
            <Menu>
                <MenuItem href="/admin">Dashboard</MenuItem>
                <SubMenu label="Management">
                    <MenuItem className="bg-gray-800 text-white hover:text-black" href="/admin/cash">Cash</MenuItem>
                    <MenuItem className="bg-gray-800 text-white hover:text-black" href="/admin/product">Product</MenuItem>
                </SubMenu>
            </Menu>
        </Sidebar>
    );
}
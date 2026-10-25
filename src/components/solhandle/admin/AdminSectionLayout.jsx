import { Outlet } from 'react-router-dom';
import '@/components/solhandle/admin/ecosystem-admin.css';
import '@/components/solhandle/admin/admin-sections.css';

export default function AdminSectionLayout() {
  return <div className="ep-page el-admin"><div className="el-admin-workspace"><Outlet/></div></div>;
}
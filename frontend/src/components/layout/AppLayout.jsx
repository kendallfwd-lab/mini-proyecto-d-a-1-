import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return <div className="app-shell"><Sidebar /><main className="main-content"><Header />{children}</main></div>;
}

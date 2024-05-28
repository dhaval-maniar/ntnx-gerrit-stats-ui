// Import the style sheet.  You only need to do this one time in your project.
import '@nutanix-ui/prism-reactjs/dist/index.css';
import './App.css';
import UserDetails from './Features/UserStats';
import UserList from './Features/UserList';


function App() {
  return (
    <>
      <UserList/>
      <UserDetails/>
    </>
  );
}

export default App;

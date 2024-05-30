// Import the style sheet.  You only need to do this one time in your project.
import '@nutanix-ui/recharts/umd/recharts.css';
import '@nutanix-ui/prism-reactjs/dist/index.css';
import './App.css';
import UserList from './Features/UserList';


function App() {
  return (
    <>
      <UserList/>
    </>
  );
}

export default App;

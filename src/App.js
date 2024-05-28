import logo from './logo.svg';
// Import the style sheet.  You only need to do this one time in your project.
import '@nutanix-ui/prism-reactjs/dist/index.css';
import { Button, FlexLayout, Input, StackingLayout, Table } from '@nutanix-ui/prism-reactjs';
import './App.css';
import { useState } from 'react';


const columns = [
  {
    title: "User Name",
    key: "userName"
  },
  {
    title: "Changes Count",
    key: "changesCount"
  }
]

function App() {

  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);  
  
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  }

  const getDataSource = () => {
    return [];
  }

  return (
    <FlexLayout padding="20px" itemFlexBasis='100pc' flexDirection='column' alignItems='center' justifyContent='center'>
      <FlexLayout>
        <Input 
          value={userName} 
          placeholder='Enter username to get statistics' 
          onChange={handleUserNameChange} 
          label='Username'
          style={{width: '300px'}}
        />
        <Button>Fetch</Button>
      </FlexLayout>
      {
        userName &&
        <Table
          showCustomScrollbar={true}
          dataSource={getDataSource()}
          columns={columns}
          topSection={{
            title: "User Statistics",
          }}
          loading={loading} 
          wrapperProps={{
            "data-test-id": "rule-table",
          }}
          customMessages={{noData: "No User Data Found"}}
        />  
      }
    </FlexLayout>
  );
}

export default App;

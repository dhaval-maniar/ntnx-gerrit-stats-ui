import { Button, ContainerLayout, DashboardWidgetHeader, DashboardWidgetLayout, Divider, FlexLayout, Input, StackingLayout, Table, Title } from "@nutanix-ui/prism-reactjs";
import { useState } from "react";
import UserDetails from "./UserStats";


const columns = [
  {
    title:  "Name",
    key: "name"
  },
  {
    title: "Gerrit UserName",
    key: "gerritUserName"
  },
  {
    title: "Email",
    key: "email"
  }
]

const header = (
  <DashboardWidgetHeader title="Users" showCloseIcon={ false } />
);

function UserList(){

  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  }

  const addUser = async () => {
    setLoading(true);
    const response = await fetch(`api/members/${userName}`);
    const data = await response.json();
    setUserList([...userList, data[0]]);
    setUserName('');
    setLoading(false);
  }

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userStatsModal, setUserStatsModal] = useState(false);

  const onUserClick = (userId) => {
    setSelectedUserId(userList.find((item) => item._account_id === userId));
    setUserStatsModal(true);
  }

  const handleClose = () => {
    setUserStatsModal(false);
  }

  const getDataSource = () => {
    if(userList){
      let data =  userList.map((item) => {
        return {
          key: item._account_id,
          name: <Button type="icon-link" onClick={(e) => onUserClick(item._account_id)}>{item.name}</Button>,
          gerritUserName: item.username,
          email: item.email
        }
      })
      return data;
    }else {
      return [];
    }
  }

  const tableSection = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="key"
        dataSource={ getDataSource() }
        columns={ columns } 
        loading = {loading}  
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No User Added'
        }}
      />
    </FlexLayout>
  );

  const bodyContent = (
    <StackingLayout itemSpacing="0px" style={{width:"100%"}}>
      {tableSection}
      <Divider />
    </StackingLayout>
  );

  return(
    <StackingLayout>
      <FlexLayout padding="20px" flexDirection='column' alignItems='center' justifyContent='center'>
        <ContainerLayout padding='10px' style={{width: "90%"}} border={true}>
          <FlexLayout padding="10px" flexDirection='column' alignItems='center' justifyContent='center'>
            <Title data-test-id="size-h2" size="h2">Users List</Title>
            <FlexLayout>
              <Input 
                value={userName} 
                placeholder='Please enter full name or email' 
                onChange={handleUserNameChange} 
                label='Name/Email'
                style={{width: '300px'}}
              />
              <Button
                onClick={addUser} 
                disabled={loading || !userName}
              >
                Add User
              </Button>
            </FlexLayout>
            {
              // (userList.length > 0) &&
              <DashboardWidgetLayout
                header={header}
                bodyContent = {bodyContent}
                footer={null}
                bodyContentProps={{itemFlexBasis: '100pc'}}
                style={{flexBasis:'100%', width: '100%'}}
                itemSpacing='0px'
              />
            }
          </FlexLayout>
        </ContainerLayout>
      </FlexLayout>
      {
        userStatsModal && 
        <UserDetails 
          userDetails={selectedUserId} 
          handleClose={handleClose}
          onClose={() => setUserStatsModal(false)}
        />
      }
    </StackingLayout>
    
  );
}

export default UserList;
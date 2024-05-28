import { Button, ContainerLayout, DashboardWidgetHeader, DashboardWidgetLayout, Divider, FlexLayout, Input, StackingLayout, Table } from "@nutanix-ui/prism-reactjs";
import { useState } from "react";


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

  const getDataSource = () => {
    if(userList){
      let data =  userList.map((item) => {
        return {
          key: item._account_id,
          name: item.name,
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
    <FlexLayout padding="20px" itemFlexBasis='100pc' flexDirection='column' alignItems='center' justifyContent='center'>
        <ContainerLayout padding='10px' style={{width: "90%"}} border={true}>
          <FlexLayout padding="10px" itemFlexBasis='100pc' flexDirection='column' alignItems='center' justifyContent='center'>
            <FlexLayout inemFlexBasis='100pc'>
              <Input 
                value={userName} 
                placeholder='Please enter full name or email' 
                onChange={handleUserNameChange} 
                label='Name/Email'
                style={{width: '300px'}}
                loading={loading}
              />
              <Button
                onClick={addUser} 
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
  );
}

export default UserList;
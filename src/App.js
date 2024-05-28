// Import the style sheet.  You only need to do this one time in your project.
import '@nutanix-ui/prism-reactjs/dist/index.css';
import { Button, ContainerLayout, DashboardWidgetHeader, DashboardWidgetLayout, Divider, FlexLayout, Input, StackingLayout, Table } from '@nutanix-ui/prism-reactjs';
import './App.css';
import { useCallback, useState } from 'react';


const columns = [
  {
    title: "User Name",
    key: "userName"
  },
  {
    title: "CRs Raised",
    key: "changesCount"
  },
  {
    title: "Added as Reviewer",
    key: "reviewCount"
  }, 
  {
    title: "Comments Recieved",
    key: "commentsRecieved"
  },
  {
    title: "+2 given",
    key: "plusTwoGiven"
  },
  {
    title: "+1 given",
    key: "plusOneGiven"
  },
  {
    title: "-1 given",
    key: "minusOneGiven"
  },
  {
    title: "-2 given",
    key: "minusTwoGiven"
  },
  {
    title: "+2 received",
    key: "plusTwoReceived"
  },
  {
    title: "+1 received",
    key: "plusOneReceived"
  },
  {
    title: "-1 received",
    key: "minusOneReceived"
  },
  {
    title: "-2 received",
    key: "minusTwoReceived"
  }
]

const header = (
  <DashboardWidgetHeader title="Gerrit Statistics" showCloseIcon={ false } />
);


function App() {

  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);  
  
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  }

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/${userName}`);
      const data = await response.json();
      setUserData([data]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [userName])

  const getDataSource = () => {
    if(userData){
      let data =  userData.map((data) => {
  
        return {
          key: data.userId,
          userName: data.name,
          changesCount: data.ownChangesCount,
          reviewCount: data.addedAsReviewer,
          commentsRecieved: data.comments,
          plusTwoGiven: data.reviewedChanges.plusTwos,
          plusOneGiven: data.reviewedChanges.plusOnes,
          minusOneGiven: data.reviewedChanges.minusOnes,
          minusTwoGiven: data.reviewedChanges.minusTwos,
          plusTwoReceived: data.reviews.plusTwos,
          plusOneReceived: data.reviews.plusOnes,
          minusOneReceived: data.reviews.minusOnes,
          minusTwoReceived: data.reviews.minusTwos
        }
      });
      return data;
    }else{
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
          noData: 'No data found'
        }}
      />
    </FlexLayout>
  );

  const bodyContent = (
    <StackingLayout itemSpacing="0px">
      {tableSection}
      <Divider />
    </StackingLayout>
  );

  return (
    <FlexLayout padding="20px" itemFlexBasis='100pc' flexDirection='column' alignItems='center' justifyContent='center'>
        <ContainerLayout padding='10px' style={{width: "90%"}} border={true}>
          <FlexLayout padding="10px" itemFlexBasis='100pc' flexDirection='column' alignItems='center' justifyContent='center'>
            <FlexLayout>
              <Input 
                value={userName} 
                placeholder='Enter username to get statistics' 
                onChange={handleUserNameChange} 
                label='Username'
                style={{width: '300px'}}
                loading={loading}
              />
              <Button
                onClick={getData}
                disabled={userName.length === 0 || loading} 
              >
                Fetch
              </Button>
            </FlexLayout>
            {
              (userData.length > 0) &&
              <DashboardWidgetLayout
                header={header}
                bodyContent = {bodyContent}
                footer={null}
                bodyContentProps={{itemFlexBasis: '100pc'}}
                style={{flexBasis:'100%'}}
                itemSpacing='0px'
              />
            }
          </FlexLayout>
        </ContainerLayout>
    </FlexLayout>
  );
}

export default App;

import { Button, CloseIcon, ContainerLayout, DashboardWidgetHeader, DashboardWidgetLayout, DatePicker, Divider, FlexLayout, FullPageModal, Input, StackingLayout, Table, TextLabel } from '@nutanix-ui/prism-reactjs';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

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


function UserDetails(props) {

  const userId = props.userDetails._account_id;

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [startDate, setStartDate] = useState(moment().subtract(1, 'weeks'));
  const [endDate, setEndDate] = useState(moment().startOf('day')); 

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/${userId}?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`);
      const data = await response.json();
      setUserData([data]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [startDate,endDate])

  useEffect(()=>{
    getData();
  },[])

  const getDataSource = () => {
    if(userData){
      let data =  userData.map((data) => {
  
        return {
          key: data.userId,
          userName: props.userDetails.name,
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
    <FullPageModal
      visible={true}
      title="User Stats"
      headerActions={[
      <CloseIcon key="close" onClick={props.handleClose}/>
      ]}
    >
      <FlexLayout padding="20px" flexDirection='column' alignItems='center' justifyContent='center'>
        <ContainerLayout padding='10px' style={{width: "90%"}} border={true}>
          <FlexLayout padding="10px" flexDirection='column' alignItems='center' justifyContent='center'>
            <FlexLayout alignItems='flex-end'>
              <StackingLayout itemSpacing='0px'>
                <TextLabel>Start Date</TextLabel>
                <DatePicker
                  oldDatePicker={false}
                  inputProps={ { name:'datepicker-select-on-initial-render' } }
                  onChange={ (selectedDate) => setStartDate(selectedDate) }
                  defaultValue={startDate}
                  popupProviderProps={{
                    popupClassName: 'my-datepicker',
                    getPopupContainer: () => {
                      const container = document.querySelector(".right-panel");
                      return container || document.body;
                    }
                  }}
                />
              </StackingLayout>
              <StackingLayout>
                <TextLabel>End Date</TextLabel>
                <DatePicker
                  oldDatePicker={false}
                  inputProps={ { name:'datepicker-select-on-initial-render' } }
                  onChange={ (selectedDate) => setEndDate(selectedDate)}
                  defaultValue={endDate}
                  popupProviderProps={{
                    popupClassName: 'my-datepicker',
                    getPopupContainer: () => {
                      const container = document.querySelector(".right-panel");
                      return container || document.body;
                    }
                  }}
                />
              </StackingLayout>
              <Button
                onClick={getData}
                disabled={loading} 
              >
                Fetch
              </Button>
            </FlexLayout>
            {
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
    </FullPageModal>
  );
}

export default UserDetails;
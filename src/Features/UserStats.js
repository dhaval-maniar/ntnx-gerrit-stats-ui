import { Button, CloseIcon, ContainerLayout, DashboardWidgetLayout, DatePicker, Divider, FlexLayout, FullPageModal, Link, StackingLayout, Table, Tabs, TextLabel, Title } from '@nutanix-ui/prism-reactjs';
import { useRef, useState } from 'react';
import moment from 'moment';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from '@nutanix-ui/recharts';
import GerritStats from './GerritStats';
import CrStats from './CrStats';

const data = [
  {
    title: "User Statistics",
    key: "userStats"
  },
  {
    title: "CR statistics",
    key: "crStats"
  },
  {
    title: "Open Changes",
    key: "openChanges"
  }
]

const oldestChangesColumns = [
  {
    title: "Gerrit URL",
    key: "url"
  },
  {
    title: "Created On",
    key: "createdOn"
  }
]

const maxCommentsColumns = [
  {
    title: "Gerrit URL",
    key: "url"
  },
  {
    title: "Comments",
    key: "comments"
  }
]

const longestAndShortestColumns = [
  {
    title: "Gerrit URL",
    key: "url"
  },
  {
    title: "Time",
    key: "time"
  }
]

function UserDetails(props) {

  const childRef = useRef();

  const [activeTab, setActiveTab] = useState("userStats");

  const userId = props.userDetails._account_id;

  const [userData, setUserData] = useState([]);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'weeks'));
  const [endDate, setEndDate] = useState(moment().startOf('day')); 

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  }

  const oldestChangesData = () => {
    if(userData && userData[0] && userData[0]['oldestOpenChanges']){
      let data = userData[0].oldestOpenChanges.map((item)=> {
        const localDate = new Date(item.created);
        return {
          id: item.id,
          url: <Link style={{color:'#22a5f7'}} data-test-id="inline-with-href" type="inline" href={item.url}>{item.url}</Link>,
          createdOn: localDate.toString()
        }
      });
      return data;
    } else {
      return [];
    }
  }

  const oldestChangesTable = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="id"
        dataSource={ oldestChangesData() }
        columns={ oldestChangesColumns } 
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No open changes'
        }}
      />
    </FlexLayout>
  );

  const chartData = () => {
    if(userData && userData[0]){
      const data = [
        {
          name: "Mon",
          reviews: userData[0].reviewedChanges.reviewsByday["1"] || 0
        },
        {
          name: "Tues",
          reviews: userData[0].reviewedChanges.reviewsByday["2"] || 0
        },
        {
          name: "Wed",
          reviews: userData[0].reviewedChanges.reviewsByday["3"] || 0
        },
        {
          name: "Thurs",
          reviews: userData[0].reviewedChanges.reviewsByday["4"] || 0
        },
        {
          name: "Fri",
          reviews: userData[0].reviewedChanges.reviewsByday["5"] || 0
        }
      ]
      return data;
    } else {
      return null;
    }
  }

  const reviewChart = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}} justifyContent='center' alignItems='center'>
      <BarChart
        width={ 500 }
        height={ 300 }
        data = {chartData()}
        margin={ {
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        } }
      >
        <CartesianGrid />
        <XAxis dataKey="name" interval={ 0 }/>
        <YAxis />
        <Tooltip  />
        <Legend />
        <Bar dataKey="reviews" minPointSize={ 10 }/>
      </BarChart>
    </FlexLayout>
  );

  function renderTabContent(tab){
    if(tab === "userStats"){
      return (
        <>
          <Divider />
            <GerritStats userId={userId} startDate={startDate} endDate={endDate} handleSuccessOrFailure={props.handleSuccessOrFailure} handleClose={props.handleClose} name={props.userDetails.name} ref={childRef} />
          <Divider />
        </>
      )
    }
    if(tab === "crStats"){
     return (
        <>
          <Divider />
            <CrStats userId={userId} startDate={startDate} endDate={endDate} handleSuccessOrFailure={props.handleSuccessOrFailure} handleClose={props.handleClose} name={props.userDetails.name} ref={childRef} />
          <Divider />
        </>
      )
    }
  }

  const bodyContent = (
    <StackingLayout itemSpacing="0px">
      {renderTabContent(activeTab)}
      {/* <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Reviews by Day of the Week</Title>
      </FlexLayout>
      <Divider />
      {reviewChart}
      <Divider />
      <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Open Changes</Title>
      </FlexLayout>
      <Divider />
      {oldestChangesTable}
      <Divider /> */}
    </StackingLayout>
  );

  const callGetData = () => {
    childRef.current.getData();
  }

  const title = `User Details for ${props.userDetails.name}`;

  return (
    <FullPageModal
      visible={true}
      title={title}
      headerActions={[
      <CloseIcon key="close" onClick={props.handleClose}/>
      ]}
    >
      <FlexLayout padding="20px" flexDirection='column' alignItems='center' justifyContent='center'>
        <ContainerLayout padding='10px' style={{width: "100%"}} border={true}>
          <FlexLayout padding="10px" flexDirection='column' alignItems='center' justifyContent='center'>
            <FlexLayout alignItems='flex-end'>
              <StackingLayout itemSpacing='5px'>
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
              <StackingLayout itemSpacing='5px'>
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
                onClick={callGetData}
              >
                Fetch
              </Button>
            </FlexLayout>
            <FlexLayout alignItems='flex-start' justifyContent='flex-start'>
              <Tabs
                data={data}
                onTabClick={handleTabClick}
                defaultActiveKey={activeTab}
                data-test-id="default-active"
              />
            </FlexLayout>
            {
              <DashboardWidgetLayout
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
